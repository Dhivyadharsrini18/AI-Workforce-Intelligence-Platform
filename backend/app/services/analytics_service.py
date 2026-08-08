import math
from typing import Dict, Any, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from collections import defaultdict

from app.models.department import Department
from app.models.employee import Employee
from app.models.skill import Skill
from app.models.employee_skill import EmployeeSkill
from app.services.ml_service import ml_service

class AnalyticsService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_dashboard_kpis(self) -> Dict[str, Any]:
        """Aggregate data for Module 1 KPI cards."""
        # Total Skills
        res_skills = await self.db.execute(select(Skill))
        skills = res_skills.scalars().all()
        total_skills = len(skills)
        
        # Emerging Skills
        emerging_skills = len([s for s in skills if s.is_emerging])
        
        # AI Readiness Index (mocked aggregation)
        res_emps = await self.db.execute(select(Employee))
        employees = res_emps.scalars().all()
        if employees:
            ai_readiness = sum(e.readiness_score for e in employees) / len(employees)
        else:
            ai_readiness = 0.0

        return {
            "total_skills": total_skills,
            "emerging_skills": emerging_skills,
            "ai_readiness_index": round(ai_readiness, 1),
            "future_demand_score": 85.4 # Mocked overall demand score
        }

    async def get_skill_gaps(self) -> List[Dict[str, Any]]:
        """Calculate skill gaps across the workforce."""
        res = await self.db.execute(
            select(EmployeeSkill, Skill)
            .join(Skill)
        )
        records = res.all()
        
        # Aggregate gaps by skill
        skill_gaps = defaultdict(lambda: {"target": 0, "current": 0, "count": 0, "name": ""})
        for emp_skill, skill in records:
            gap = skill_gaps[skill.id]
            gap["name"] = skill.name
            gap["target"] += emp_skill.target_level
            gap["current"] += emp_skill.proficiency_level
            gap["count"] += 1
            
        result = []
        for s_id, data in skill_gaps.items():
            if data["count"] > 0:
                avg_target = data["target"] / data["count"]
                avg_current = data["current"] / data["count"]
                gap_percentage = max(0, ((avg_target - avg_current) / 5.0) * 100)
                result.append({
                    "skill_id": s_id,
                    "skill_name": data["name"],
                    "gap_percentage": round(gap_percentage, 1),
                    "avg_current": round(avg_current, 1),
                    "avg_target": round(avg_target, 1)
                })
                
        # Sort by largest gap
        return sorted(result, key=lambda x: x["gap_percentage"], reverse=True)[:10]

    async def get_department_heatmap(self) -> Dict[str, Any]:
        """Module 5: Skill Heatmap (Departments vs Skills)."""
        res_depts = await self.db.execute(select(Department))
        departments = res_depts.scalars().all()
        
        res_skills = await self.db.execute(select(Skill).limit(10)) # Top 10 skills for heatmap
        skills = res_skills.scalars().all()
        
        # Mock actual aggregations for the heatmap cell values
        matrix = []
        for dept in departments:
            row = {"department": dept.name}
            for skill in skills:
                # Mock skill strength 0-100
                row[skill.name] = round(min(100, max(0, (dept.budget / 1000000) * 10 + skill.current_demand_score / 2)), 1)
            matrix.append(row)
            
        return {
            "columns": [s.name for s in skills],
            "data": matrix
        }

    async def generate_ai_insights(self) -> List[str]:
        """Module 9: AI Insights Engine (NLP)."""
        # In a real app, this would feed data into an LLM. Here we use rules for generation.
        gaps = await self.get_skill_gaps()
        insights = []
        
        if gaps:
            top_gap = gaps[0]
            insights.append(f"The organization requires approximately {top_gap['gap_percentage']}% more expertise in {top_gap['skill_name']} over the next 12 months.")
            
        # Get emerging skills
        res_skills = await self.db.execute(select(Skill).where(Skill.is_emerging == True).order_by(Skill.growth_rate.desc()))
        emerging = res_skills.scalars().first()
        if emerging:
            insights.append(f"{emerging.name} demand is projected to increase by {round(emerging.growth_rate, 1)}%.")
            
        insights.append("The Engineering department has the largest AI skill gap compared to baseline readiness.")
        
        return insights
