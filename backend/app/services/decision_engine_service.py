"""
Decision Engine Service
=======================
AI-powered Hiring vs Upskilling recommendation engine (Module 8).
Recommends build (upskill), buy (hire), borrow (outsource), or delay strategies
based on skill gaps, business urgency, cost, and existing workforce readiness.
"""

from typing import Any, Dict, List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.skill import Skill
from app.services.forecast_service import ForecastService


class DecisionEngineService:
    """Hire vs Upskill Intelligence."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def recommend_strategy(self, skill_id: str, required_headcount: int = 1) -> Dict[str, Any]:
        """Generate strategy recommendation for a specific skill need."""
        skill_result = await self.db.execute(
            select(Skill).where(Skill.id == skill_id)
        )
        skill = skill_result.scalars().first()
        if not skill:
            return {"error": "Skill not found"}

        # Fetch future demand using ForecastService
        forecast_svc = ForecastService(self.db)
        forecast = await forecast_svc.forecast_single_skill(skill_id)

        demand_growth = forecast.growth_rate
        is_critical = skill.is_critical

        # Synthetic constraints based on the skill
        # (In a real app, these would come from market data or internal HR metrics)
        market_availability = "Low" if demand_growth > 20 else "High"
        average_salary_cost = 120000 if is_critical else 85000
        upskill_cost_per_employee = 5000
        upskill_time_months = 6 if is_critical else 3
        hiring_time_months = 4 if market_availability == "Low" else 2

        # Decision Logic
        if demand_growth > 30 and market_availability == "Low":
            strategy = "Upskill (Build)"
            priority = "Critical"
            confidence = 85.0
            reason = f"Extreme market shortage for {skill.name}. Highly cost-effective to upskill internal talent."
            roi = ((average_salary_cost * 0.3) - upskill_cost_per_employee) / upskill_cost_per_employee * 100
            time_to_value = upskill_time_months
            cost = upskill_cost_per_employee * required_headcount
        elif not is_critical and demand_growth < 5:
            strategy = "Outsource (Borrow)"
            priority = "Low"
            confidence = 92.0
            reason = f"Low long-term growth and non-critical status. Better handled via contractors."
            roi = 15.0 # Baseline
            time_to_value = 1 # Fast
            cost = 45000 * required_headcount
        else:
            strategy = "Hire (Buy)"
            priority = "High" if is_critical else "Medium"
            confidence = 78.0
            reason = f"Immediate business need for {skill.name}. Market availability allows for strategic hiring."
            roi = 25.0
            time_to_value = hiring_time_months
            cost = average_salary_cost * required_headcount

        return {
            "skill_id": skill_id,
            "skill_name": skill.name,
            "strategy": strategy,
            "priority": priority,
            "confidence": confidence,
            "business_impact": reason,
            "estimated_cost": cost,
            "estimated_time_months": time_to_value,
            "roi_percentage": round(roi, 1),
            "alternative_strategy": "Hire (Buy)" if strategy == "Upskill (Build)" else "Upskill (Build)",
            "metrics": {
                "market_availability": market_availability,
                "demand_growth": round(demand_growth, 1),
                "required_headcount": required_headcount,
            }
        }
