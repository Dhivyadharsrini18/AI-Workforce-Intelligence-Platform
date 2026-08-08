"""
Learning Service
================
AI-powered learning path recommendation engine.
Matches employee skill gaps to courses from the Course catalogue,
ranks by relevance, estimates readiness improvement, and generates
personalized learning paths.
"""

import json
import random
import uuid
from typing import Any, Dict, List, Optional

from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.course import Course
from app.models.employee import Employee
from app.models.employee_skill import EmployeeSkill
from app.models.recommendation import Recommendation
from app.models.skill import Skill


class LearningService:
    """Course recommendation engine driven by skill gap analysis."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def recommend_for_employee(
        self, emp_id: str, limit: int = 10
    ) -> Dict[str, Any]:
        """Generate personalized learning recommendations for an employee."""
        # 1. Get employee
        emp_result = await self.db.execute(
            select(Employee).where(Employee.id == emp_id)
        )
        emp = emp_result.scalars().first()
        if not emp:
            return {"error": "Employee not found"}

        # 2. Get employee skill gaps
        es_result = await self.db.execute(
            select(EmployeeSkill, Skill)
            .join(Skill)
            .where(EmployeeSkill.employee_id == emp_id)
        )
        records = es_result.all()

        gaps = []
        for emp_skill, skill in records:
            gap = max(0, emp_skill.target_level - emp_skill.proficiency_level)
            if gap > 0:
                gaps.append({
                    "skill": skill,
                    "gap": gap,
                    "current": emp_skill.proficiency_level,
                    "target": emp_skill.target_level,
                })

        # Sort gaps: critical skills first, then by gap size
        gaps.sort(
            key=lambda x: (x["skill"].is_critical, x["gap"]), reverse=True
        )

        # 3. Match gaps to courses
        recommendations = []
        for gap_info in gaps[:limit]:
            skill = gap_info["skill"]
            courses = await self._find_courses_for_skill(
                skill.name, skill.category
            )

            for course in courses[:2]:  # Top 2 courses per gap
                # Compute relevance score (0-100)
                relevance = self._compute_relevance(
                    gap_info["gap"], skill.is_critical,
                    skill.future_demand_score, course.rating
                )
                # Estimate readiness improvement
                readiness_improvement = min(
                    15, gap_info["gap"] * 3.2 * (course.rating / 5.0)
                )
                priority = (
                    "critical" if skill.is_critical and gap_info["gap"] >= 2
                    else "high" if gap_info["gap"] >= 2
                    else "medium" if gap_info["gap"] >= 1
                    else "low"
                )

                recommendations.append({
                    "id": str(uuid.uuid4()),
                    "skill_name": skill.name,
                    "skill_category": skill.category,
                    "is_critical": skill.is_critical,
                    "current_level": gap_info["current"],
                    "target_level": gap_info["target"],
                    "gap": gap_info["gap"],
                    "course_id": course.id,
                    "course_title": course.title,
                    "provider": course.provider,
                    "difficulty": course.difficulty,
                    "duration_hours": course.duration_hours,
                    "rating": course.rating,
                    "relevance_score": round(relevance, 1),
                    "readiness_impact": f"+{round(readiness_improvement, 1)}%",
                    "priority": priority,
                    "career_growth": self._estimate_career_growth(
                        skill, gap_info["gap"]
                    ),
                })

        # Sort by relevance
        recommendations.sort(
            key=lambda x: x["relevance_score"], reverse=True
        )

        total_hours = sum(r["duration_hours"] for r in recommendations)
        avg_impact = (
            sum(
                float(r["readiness_impact"].strip("+%"))
                for r in recommendations
            )
            / len(recommendations)
            if recommendations
            else 0
        )

        return {
            "employee_id": emp_id,
            "employee_name": emp.full_name,
            "total_recommendations": len(recommendations),
            "total_learning_hours": total_hours,
            "estimated_readiness_boost": f"+{round(avg_impact, 1)}%",
            "recommendations": recommendations[:limit],
        }

    async def get_learning_path(self, emp_id: str) -> Dict[str, Any]:
        """Generate a structured learning path with phases."""
        recs_data = await self.recommend_for_employee(emp_id, limit=12)
        if "error" in recs_data:
            return recs_data

        recs = recs_data["recommendations"]

        # Split into phases
        phase1 = [r for r in recs if r["priority"] in ("critical", "high")][:4]
        phase2 = [r for r in recs if r["priority"] == "medium"][:4]
        phase3 = [r for r in recs if r["priority"] == "low"][:4]

        return {
            "employee_id": emp_id,
            "employee_name": recs_data["employee_name"],
            "phases": [
                {
                    "name": "Foundation — Critical Skills",
                    "duration_weeks": max(
                        4,
                        sum(r["duration_hours"] for r in phase1) // 10,
                    ),
                    "courses": phase1,
                },
                {
                    "name": "Growth — Core Competencies",
                    "duration_weeks": max(
                        4,
                        sum(r["duration_hours"] for r in phase2) // 10,
                    ),
                    "courses": phase2,
                },
                {
                    "name": "Mastery — Advanced Topics",
                    "duration_weeks": max(
                        4,
                        sum(r["duration_hours"] for r in phase3) // 10,
                    ),
                    "courses": phase3,
                },
            ],
            "total_duration_weeks": max(
                12, sum(r["duration_hours"] for r in recs) // 10
            ),
        }

    # ------------------------------------------------------------------
    # Internal
    # ------------------------------------------------------------------

    async def _find_courses_for_skill(
        self, skill_name: str, category: str
    ) -> List[Course]:
        """Find courses that cover a specific skill."""
        # Search by skill name in title or skills_covered JSON
        result = await self.db.execute(
            select(Course)
            .where(
                Course.title.ilike(f"%{skill_name}%")
                | Course.category.ilike(f"%{category}%")
                | Course.skills_covered.ilike(f"%{skill_name}%")
            )
            .order_by(desc(Course.rating))
            .limit(5)
        )
        courses = list(result.scalars().all())

        # Fallback: get top-rated courses in same category
        if not courses:
            result = await self.db.execute(
                select(Course)
                .order_by(desc(Course.rating))
                .limit(3)
            )
            courses = list(result.scalars().all())

        return courses

    @staticmethod
    def _compute_relevance(
        gap: int, is_critical: bool, future_demand: float, rating: float
    ) -> float:
        """Compute a relevance score 0-100 for a course recommendation."""
        base = gap * 20  # Max 100 for gap of 5
        critical_boost = 15 if is_critical else 0
        demand_boost = (future_demand / 100) * 10
        quality_boost = (rating / 5.0) * 10
        return min(100, base + critical_boost + demand_boost + quality_boost)

    @staticmethod
    def _estimate_career_growth(skill: Skill, gap: int) -> str:
        """Estimate career growth potential from closing this skill gap."""
        if skill.is_critical and gap >= 2:
            return "High — leadership track"
        elif skill.is_emerging:
            return "High — emerging technology specialist"
        elif gap >= 2:
            return "Medium — cross-functional growth"
        else:
            return "Moderate — skill refinement"
