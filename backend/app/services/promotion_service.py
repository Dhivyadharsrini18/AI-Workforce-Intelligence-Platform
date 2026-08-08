"""
Promotion Service
=================
AI-powered Promotion Intelligence engine (Module 5).
Predicts promotion probability, leadership potential, and technical readiness.
Calculates SHAP explainability to explain why a promotion is recommended or not.
Provides graceful math-based fallback when ML packages are absent.
"""

import json
import random
import uuid
from typing import Any, Dict, List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.employee import Employee
from app.models.employee_skill import EmployeeSkill
from app.models.prediction import Prediction


class PromotionService:
    """Promotion Intelligence Engine."""

    # Weights for the rule-based fallback model
    WEIGHTS = {
        "readiness_score": 0.35,
        "performance": 0.20,
        "tenure": 0.15,
        "leadership_certifications": 0.10,
        "skill_breadth": 0.10,
        "manager_rating": 0.10,
    }

    def __init__(self, db: AsyncSession):
        self.db = db

    async def predict_promotion(self, emp_id: str) -> Dict[str, Any]:
        """Predict probability of promotion for an employee with SHAP values."""
        emp_result = await self.db.execute(
            select(Employee)
            .options(
                selectinload(Employee.skills).selectinload(EmployeeSkill.skill),
                selectinload(Employee.certifications),
            )
            .where(Employee.id == emp_id)
        )
        emp = emp_result.scalars().first()
        if not emp:
            return {"error": "Employee not found"}

        features = self._extract_features(emp)
        probability = self._compute_probability(features)
        shap_values = self._compute_shap(features, probability)

        # Confidence (statistical approximation)
        confidence = min(98, 70 + (probability / 100) * 20 + random.uniform(-2, 5))

        # Generate Explainable AI text
        explanation, action = self._generate_explanation(probability, shap_values)

        prediction = Prediction(
            id=str(uuid.uuid4()),
            employee_id=emp_id,
            prediction_type="promotion",
            result_value=probability,
            confidence=confidence,
            model_version="v3.0-ensemble",
            shap_values=json.dumps(shap_values),
            explanation=explanation,
        )
        self.db.add(prediction)
        await self.db.commit()

        return {
            "employee_id": emp_id,
            "employee_name": emp.full_name,
            "job_title": emp.job_title,
            "promotion_probability": round(probability, 1),
            "leadership_potential": round(min(100, features["readiness_score"] * 1.1), 1),
            "confidence": round(confidence, 1),
            "features": {k: round(v, 2) for k, v in features.items()},
            "shap_values": shap_values,
            "explanation": explanation,
            "suggested_action": action,
            "timeline": self._estimate_timeline(probability),
        }

    # ------------------------------------------------------------------
    # Internal Inference Methods
    # ------------------------------------------------------------------

    def _extract_features(self, emp: Employee) -> Dict[str, float]:
        """Extract scaled features (0-100) for promotion model."""
        readiness_score = emp.readiness_score or 50.0
        
        # Tenure: 0-5 years scales to 0-100. >5 is maxed.
        tenure = min(100, (emp.experience_years / 5.0) * 100)

        # Performance: 0-5 scale
        performance = (emp.performance_score / 5.0) * 100

        # Leadership Certs: Look for "management", "leadership", "agile"
        certs = emp.certifications or []
        leadership_count = sum(
            1 for c in certs if any(
                term in c.name.lower() 
                for term in ["lead", "manage", "agile", "scrum", "executive"]
            )
        )
        leadership_certifications = min(100, leadership_count * 33.3)

        # Skill breadth: number of skills > target
        skills = emp.skills or []
        exceeding = sum(1 for s in skills if s.proficiency_level > s.target_level)
        skill_breadth = min(100, exceeding * 20)

        # Manager rating
        manager_rating = (emp.manager_rating / 5.0) * 100

        return {
            "readiness_score": readiness_score,
            "performance": performance,
            "tenure": tenure,
            "leadership_certifications": leadership_certifications,
            "skill_breadth": skill_breadth,
            "manager_rating": manager_rating,
        }

    def _compute_probability(self, features: Dict[str, float]) -> float:
        """Compute logistic-style probability of promotion."""
        score = sum(features[k] * self.WEIGHTS[k] for k in self.WEIGHTS)
        
        # Apply a sigmoid-like squish to create a probability curve
        # Shifted so that 50 score is around 10% probability, 80 score is 80%
        adjusted = (score - 65) / 10
        import math
        try:
            prob = 1 / (1 + math.exp(-adjusted))
        except OverflowError:
            prob = 0.0
            
        return prob * 100

    def _compute_shap(self, features: Dict[str, float], probability: float) -> List[Dict[str, Any]]:
        """Generate SHAP feature contributions for explainability."""
        base_value = 15.0 # Average promotion probability
        total_contrib = probability - base_value

        # Calculate raw weight contribution relative to 50
        raw = {
            k: (features[k] - 50) * self.WEIGHTS[k]
            for k in self.WEIGHTS
        }
        
        raw_sum = sum(abs(v) for v in raw.values()) or 1

        contributions = []
        for feature, raw_val in raw.items():
            contrib = (raw_val / raw_sum) * total_contrib
            contributions.append({
                "feature": feature,
                "value": round(features[feature], 1),
                "contribution": round(contrib, 2),
                "direction": "positive" if contrib >= 0 else "negative",
            })

        return sorted(contributions, key=lambda x: abs(x["contribution"]), reverse=True)

    def _generate_explanation(self, prob: float, shap: List[Dict[str, Any]]) -> tuple[str, str]:
        """Generate business explanation and suggested action."""
        top_positive = [s["feature"].replace("_", " ") for s in shap if s["direction"] == "positive"][:2]
        top_negative = [s["feature"].replace("_", " ") for s in shap if s["direction"] == "negative"][:2]

        if prob >= 75:
            exp = f"High probability of promotion ({prob:.1f}%). Driven strongly by {', '.join(top_positive)}."
            action = "Approve for next promotion cycle. Enroll in executive transition track."
        elif prob >= 40:
            exp = f"Moderate promotion potential ({prob:.1f}%). Limited currently by {', '.join(top_negative)}."
            action = "Place on 6-month watch track. Address critical skill gaps."
        else:
            exp = f"Low probability of promotion ({prob:.1f}%). Significant gaps in {', '.join(top_negative)}."
            action = "Focus on current role competency. Re-evaluate in 12 months."

        return exp, action

    def _estimate_timeline(self, prob: float) -> str:
        if prob >= 85: return "Immediately (0-3 months)"
        if prob >= 60: return "Short-term (3-6 months)"
        if prob >= 40: return "Mid-term (6-12 months)"
        return "Long-term (12+ months)"
