"""
Gap Service
===========
Skill gap detection engine that compares current employee skills against
target requirements and future demand. Produces gap percentages, missing
skills lists, critical skill alerts, and department-level comparisons.
"""

import uuid
from collections import defaultdict
from typing import Any, Dict, List, Optional

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.department import Department
from app.models.employee import Employee
from app.models.employee_skill import EmployeeSkill
from app.models.skill import Skill


class GapService:
    """Workforce skill gap detection and analysis."""

    def __init__(self, db: AsyncSession):
        self.db = db

    # ------------------------------------------------------------------
    # Organization-wide
    # ------------------------------------------------------------------

    async def get_organization_gap_overview(self) -> Dict[str, Any]:
        """High-level organization-wide skill gap summary."""
        gaps = await self._compute_skill_gaps()
        critical_gaps = [g for g in gaps if g["is_critical"] and g["gap_pct"] > 20]
        avg_gap = sum(g["gap_pct"] for g in gaps) / len(gaps) if gaps else 0

        return {
            "total_skills_tracked": len(gaps),
            "average_gap_percentage": round(avg_gap, 1),
            "critical_gaps_count": len(critical_gaps),
            "top_gaps": sorted(gaps, key=lambda x: x["gap_pct"], reverse=True)[:10],
            "critical_gaps": critical_gaps[:5],
            "skills_at_target": len([g for g in gaps if g["gap_pct"] <= 5]),
        }

    # ------------------------------------------------------------------
    # Department-level
    # ------------------------------------------------------------------

    async def get_department_gaps(self, dept_id: str) -> Dict[str, Any]:
        """Skill gaps for a specific department."""
        dept_result = await self.db.execute(
            select(Department).where(Department.id == dept_id)
        )
        dept = dept_result.scalars().first()
        if not dept:
            return {"error": "Department not found"}

        # Get employees in this department
        emp_result = await self.db.execute(
            select(Employee.id).where(Employee.department_id == dept_id)
        )
        emp_ids = [row[0] for row in emp_result.all()]

        if not emp_ids:
            return {
                "department": dept.name,
                "employee_count": 0,
                "gaps": [],
                "missing_skills": [],
            }

        gaps = await self._compute_skill_gaps(employee_ids=emp_ids)
        missing = await self._find_missing_critical_skills(emp_ids)

        return {
            "department_id": dept_id,
            "department": dept.name,
            "employee_count": len(emp_ids),
            "average_gap": round(
                sum(g["gap_pct"] for g in gaps) / len(gaps) if gaps else 0, 1
            ),
            "gaps": sorted(gaps, key=lambda x: x["gap_pct"], reverse=True)[:15],
            "missing_skills": missing,
        }

    # ------------------------------------------------------------------
    # Employee-level
    # ------------------------------------------------------------------

    async def get_employee_gaps(self, emp_id: str) -> Dict[str, Any]:
        """Individual employee skill gap analysis."""
        emp_result = await self.db.execute(
            select(Employee).where(Employee.id == emp_id)
        )
        emp = emp_result.scalars().first()
        if not emp:
            return {"error": "Employee not found"}

        # Get employee skills with skill details
        es_result = await self.db.execute(
            select(EmployeeSkill, Skill)
            .join(Skill)
            .where(EmployeeSkill.employee_id == emp_id)
        )
        records = es_result.all()

        skill_gaps = []
        for emp_skill, skill in records:
            gap = max(0, emp_skill.target_level - emp_skill.proficiency_level)
            gap_pct = (gap / 5.0) * 100
            skill_gaps.append({
                "skill_id": skill.id,
                "skill_name": skill.name,
                "category": skill.category,
                "current_level": emp_skill.proficiency_level,
                "target_level": emp_skill.target_level,
                "gap": gap,
                "gap_pct": round(gap_pct, 1),
                "is_critical": skill.is_critical,
                "priority": (
                    "critical" if skill.is_critical and gap >= 2
                    else "high" if gap >= 2
                    else "medium" if gap >= 1
                    else "low"
                ),
            })

        # Readiness impact: how much would closing gaps improve readiness
        total_gap = sum(g["gap"] for g in skill_gaps)
        readiness_impact = min(30, total_gap * 3.5)

        return {
            "employee_id": emp_id,
            "employee_name": emp.full_name,
            "job_title": emp.job_title,
            "skills_assessed": len(skill_gaps),
            "average_gap": round(
                sum(g["gap_pct"] for g in skill_gaps) / len(skill_gaps)
                if skill_gaps else 0, 1
            ),
            "readiness_impact": round(readiness_impact, 1),
            "gaps": sorted(
                skill_gaps, key=lambda x: x["gap_pct"], reverse=True
            ),
        }

    # ------------------------------------------------------------------
    # Department comparison
    # ------------------------------------------------------------------

    async def compare_departments(self) -> List[Dict[str, Any]]:
        """Compare skill gaps across all departments."""
        dept_result = await self.db.execute(select(Department))
        departments = dept_result.scalars().all()

        comparisons = []
        for dept in departments:
            emp_result = await self.db.execute(
                select(Employee.id).where(
                    Employee.department_id == dept.id
                )
            )
            emp_ids = [row[0] for row in emp_result.all()]
            if not emp_ids:
                continue

            gaps = await self._compute_skill_gaps(employee_ids=emp_ids)
            avg_gap = (
                sum(g["gap_pct"] for g in gaps) / len(gaps) if gaps else 0
            )
            critical_count = len(
                [g for g in gaps if g["is_critical"] and g["gap_pct"] > 20]
            )

            comparisons.append({
                "department_id": dept.id,
                "department_name": dept.name,
                "employee_count": len(emp_ids),
                "average_gap": round(avg_gap, 1),
                "critical_gaps": critical_count,
                "skills_tracked": len(gaps),
                "risk_level": (
                    "critical" if avg_gap > 40
                    else "high" if avg_gap > 25
                    else "medium" if avg_gap > 15
                    else "low"
                ),
            })

        return sorted(comparisons, key=lambda x: x["average_gap"], reverse=True)

    # ------------------------------------------------------------------
    # Internal
    # ------------------------------------------------------------------

    async def _compute_skill_gaps(
        self, employee_ids: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """Aggregate skill gaps, optionally filtered by employee IDs."""
        query = select(EmployeeSkill, Skill).join(Skill)
        if employee_ids:
            query = query.where(EmployeeSkill.employee_id.in_(employee_ids))

        result = await self.db.execute(query)
        records = result.all()

        agg: Dict[str, Dict[str, Any]] = defaultdict(
            lambda: {
                "target_sum": 0, "current_sum": 0, "count": 0,
                "name": "", "category": "", "is_critical": False,
            }
        )

        for emp_skill, skill in records:
            bucket = agg[skill.id]
            bucket["name"] = skill.name
            bucket["category"] = skill.category
            bucket["is_critical"] = skill.is_critical
            bucket["target_sum"] += emp_skill.target_level
            bucket["current_sum"] += emp_skill.proficiency_level
            bucket["count"] += 1

        gaps = []
        for skill_id, data in agg.items():
            if data["count"] == 0:
                continue
            avg_target = data["target_sum"] / data["count"]
            avg_current = data["current_sum"] / data["count"]
            gap_pct = max(0, ((avg_target - avg_current) / 5.0) * 100)
            gaps.append({
                "skill_id": skill_id,
                "skill_name": data["name"],
                "category": data["category"],
                "is_critical": data["is_critical"],
                "avg_current": round(avg_current, 2),
                "avg_target": round(avg_target, 2),
                "gap_pct": round(gap_pct, 1),
                "employees_assessed": data["count"],
            })

        return gaps

    async def _find_missing_critical_skills(
        self, employee_ids: List[str]
    ) -> List[Dict[str, Any]]:
        """Find critical skills that employees don't have at all."""
        # All critical skills
        crit_result = await self.db.execute(
            select(Skill).where(Skill.is_critical == True)
        )
        critical_skills = crit_result.scalars().all()

        # Skills employees already have
        es_result = await self.db.execute(
            select(EmployeeSkill.skill_id.distinct()).where(
                EmployeeSkill.employee_id.in_(employee_ids)
            )
        )
        owned_ids = {row[0] for row in es_result.all()}

        missing = []
        for skill in critical_skills:
            if skill.id not in owned_ids:
                missing.append({
                    "skill_id": skill.id,
                    "skill_name": skill.name,
                    "category": skill.category,
                    "future_demand": round(skill.future_demand_score, 1),
                })

        return sorted(
            missing, key=lambda x: x["future_demand"], reverse=True
        )
