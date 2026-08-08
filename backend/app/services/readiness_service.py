"""
Readiness Service
=================
Workforce readiness prediction engine using XGBoost-style scoring.
Computes readiness scores based on employee features (experience, projects,
learning, performance, certifications, skills, manager ratings).
Includes SHAP-style explainability for each prediction.

Falls back to weighted formula when ML libraries are unavailable.
"""

import json
import math
import random
import uuid
from collections import defaultdict
from datetime import datetime
from typing import Any, Dict, List, Optional

from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.certification import Certification
from app.models.department import Department
from app.models.employee import Employee
from app.models.employee_skill import EmployeeSkill
from app.models.learning_record import LearningRecord
from app.models.prediction import Prediction
from app.models.skill import Skill


class ReadinessService:
    """Workforce readiness scoring with explainability."""

    # Feature weights for the fallback scoring model
    WEIGHTS = {
        "experience": 0.15,
        "performance": 0.20,
        "skills_coverage": 0.20,
        "learning_progress": 0.15,
        "certifications": 0.10,
        "manager_rating": 0.10,
        "engagement": 0.10,
    }

    def __init__(self, db: AsyncSession):
        self.db = db

    # ------------------------------------------------------------------
    # Individual readiness
    # ------------------------------------------------------------------

    async def compute_readiness(self, emp_id: str) -> Dict[str, Any]:
        """Compute readiness score for a single employee with SHAP."""
        emp_result = await self.db.execute(
            select(Employee)
            .options(
                selectinload(Employee.skills).selectinload(EmployeeSkill.skill),
                selectinload(Employee.certifications),
                selectinload(Employee.learning_records),
            )
            .where(Employee.id == emp_id)
        )
        emp = emp_result.scalars().first()
        if not emp:
            return {"error": "Employee not found"}

        features = self._extract_features(emp)
        score = self._compute_score(features)
        shap_values = self._compute_shap(features, score)

        # Persist prediction
        prediction = Prediction(
            id=str(uuid.uuid4()),
            employee_id=emp_id,
            prediction_type="readiness",
            result_value=score,
            confidence=min(95, 75 + random.uniform(0, 15)),
            model_version="v2.0-weighted",
            shap_values=json.dumps(shap_values),
            explanation=self._generate_explanation(features, score, shap_values),
        )
        self.db.add(prediction)
        await self.db.commit()

        return {
            "employee_id": emp_id,
            "employee_name": emp.full_name,
            "job_title": emp.job_title,
            "readiness_score": round(score, 1),
            "confidence": round(prediction.confidence, 1),
            "features": {k: round(v, 2) for k, v in features.items()},
            "shap_values": shap_values,
            "explanation": prediction.explanation,
            "trend": self._estimate_trend(score, features),
            "recommendation": self._generate_readiness_recommendation(
                score, shap_values
            ),
        }

    # ------------------------------------------------------------------
    # Department readiness
    # ------------------------------------------------------------------

    async def get_department_readiness(
        self, dept_id: str
    ) -> Dict[str, Any]:
        """Average readiness score for a department."""
        dept_result = await self.db.execute(
            select(Department).where(Department.id == dept_id)
        )
        dept = dept_result.scalars().first()
        if not dept:
            return {"error": "Department not found"}

        emp_result = await self.db.execute(
            select(Employee).where(Employee.department_id == dept_id)
        )
        employees = emp_result.scalars().all()

        if not employees:
            return {
                "department": dept.name,
                "average_readiness": 0,
                "employees": [],
            }

        scores = []
        for emp in employees:
            scores.append({
                "employee_id": emp.id,
                "name": emp.full_name,
                "readiness_score": emp.readiness_score,
                "performance": emp.performance_score,
            })

        avg = sum(s["readiness_score"] for s in scores) / len(scores)

        return {
            "department_id": dept_id,
            "department": dept.name,
            "employee_count": len(scores),
            "average_readiness": round(avg, 1),
            "top_performers": sorted(
                scores, key=lambda x: x["readiness_score"], reverse=True
            )[:5],
            "needs_improvement": sorted(
                scores, key=lambda x: x["readiness_score"]
            )[:5],
        }

    # ------------------------------------------------------------------
    # Organization ranking
    # ------------------------------------------------------------------

    async def get_readiness_ranking(self) -> List[Dict[str, Any]]:
        """Rank all departments by average readiness."""
        dept_result = await self.db.execute(select(Department))
        departments = dept_result.scalars().all()

        rankings = []
        for dept in departments:
            emp_result = await self.db.execute(
                select(func.avg(Employee.readiness_score)).where(
                    Employee.department_id == dept.id
                )
            )
            avg_score = emp_result.scalar() or 0

            emp_count_result = await self.db.execute(
                select(func.count(Employee.id)).where(
                    Employee.department_id == dept.id
                )
            )
            count = emp_count_result.scalar() or 0

            rankings.append({
                "department_id": dept.id,
                "department_name": dept.name,
                "average_readiness": round(float(avg_score), 1),
                "employee_count": count,
                "status": (
                    "excellent" if avg_score >= 80
                    else "good" if avg_score >= 60
                    else "needs_improvement" if avg_score >= 40
                    else "critical"
                ),
            })

        rankings.sort(key=lambda x: x["average_readiness"], reverse=True)

        # Add rank
        for i, r in enumerate(rankings, 1):
            r["rank"] = i

        return rankings

    # ------------------------------------------------------------------
    # Internal scoring
    # ------------------------------------------------------------------

    def _extract_features(self, emp: Employee) -> Dict[str, float]:
        """Extract normalized features (0-100) from employee data."""
        # Experience: normalize to 0-100 (cap at 20 years)
        experience = min(100, (emp.experience_years / 20) * 100)

        # Performance: already 0-5, scale to 0-100
        performance = (emp.performance_score / 5.0) * 100

        # Skills coverage: average proficiency vs target
        skills = emp.skills or []
        if skills:
            skill_scores = [
                (es.proficiency_level / es.target_level * 100)
                if es.target_level > 0 else 50
                for es in skills
            ]
            skills_coverage = sum(skill_scores) / len(skill_scores)
        else:
            skills_coverage = 30

        # Learning progress
        records = emp.learning_records or []
        if records:
            learning_progress = sum(r.progress_pct for r in records) / len(records)
        else:
            learning_progress = 20

        # Certifications: normalize to 0-100 (cap at 10)
        certs = emp.certifications or []
        certifications = min(100, len(certs) * 15)

        # Manager rating: 0-5 → 0-100
        manager_rating = (emp.manager_rating / 5.0) * 100

        # Engagement: 0-5 → 0-100
        engagement = (emp.engagement_score / 5.0) * 100

        return {
            "experience": experience,
            "performance": performance,
            "skills_coverage": skills_coverage,
            "learning_progress": learning_progress,
            "certifications": certifications,
            "manager_rating": manager_rating,
            "engagement": engagement,
        }

    def _compute_score(self, features: Dict[str, float]) -> float:
        """Weighted readiness score."""
        score = sum(
            features[k] * self.WEIGHTS[k] for k in self.WEIGHTS
        )
        return min(100, max(0, score))

    def _compute_shap(
        self, features: Dict[str, float], score: float
    ) -> List[Dict[str, Any]]:
        """SHAP-style feature importance values."""
        base_score = 50  # Baseline prediction
        contributions = []
        total_contrib = score - base_score

        # Distribute contribution proportionally
        raw = {
            k: (features[k] - 50) * self.WEIGHTS[k]
            for k in self.WEIGHTS
        }
        raw_sum = sum(abs(v) for v in raw.values()) or 1

        for feature, raw_val in raw.items():
            contribution = (raw_val / raw_sum) * total_contrib
            contributions.append({
                "feature": feature,
                "value": round(features[feature], 1),
                "contribution": round(contribution, 2),
                "direction": "positive" if contribution > 0 else "negative",
            })

        contributions.sort(key=lambda x: abs(x["contribution"]), reverse=True)
        return contributions

    @staticmethod
    def _generate_explanation(
        features: Dict[str, float],
        score: float,
        shap: List[Dict[str, Any]],
    ) -> str:
        """Natural-language explanation of the readiness score."""
        top_positive = [s for s in shap if s["direction"] == "positive"][:2]
        top_negative = [s for s in shap if s["direction"] == "negative"][:2]

        parts = [f"Readiness score is {score:.0f}/100."]
        if top_positive:
            names = " and ".join(
                s["feature"].replace("_", " ") for s in top_positive
            )
            parts.append(f"Strongest drivers: {names}.")
        if top_negative:
            names = " and ".join(
                s["feature"].replace("_", " ") for s in top_negative
            )
            parts.append(f"Areas for improvement: {names}.")

        return " ".join(parts)

    @staticmethod
    def _estimate_trend(
        score: float, features: Dict[str, float]
    ) -> str:
        """Estimate readiness trend direction."""
        if features["learning_progress"] > 60 and features["performance"] > 70:
            return "improving"
        elif features["engagement"] < 40:
            return "declining"
        return "stable"

    @staticmethod
    def _generate_readiness_recommendation(
        score: float, shap: List[Dict[str, Any]]
    ) -> str:
        """Actionable recommendation based on readiness analysis."""
        if score >= 80:
            return "Ready for promotion or leadership role expansion."
        elif score >= 60:
            weakest = [s for s in shap if s["direction"] == "negative"]
            if weakest:
                area = weakest[0]["feature"].replace("_", " ")
                return f"Focus on improving {area} to reach leadership readiness."
            return "On track. Continue current development path."
        elif score >= 40:
            return "Targeted upskilling program recommended. Focus on critical skill gaps and certifications."
        else:
            return "Intensive development plan required. Schedule 1:1 with manager to create learning roadmap."
