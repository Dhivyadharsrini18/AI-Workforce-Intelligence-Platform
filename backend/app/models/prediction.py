"""
Prediction Model
================
Stores ML model predictions with SHAP explanations and confidence scores.
"""

import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    employee_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("employees.id", ondelete="CASCADE"), nullable=True
    )
    prediction_type: Mapped[str] = mapped_column(
        String(50), nullable=False
    )  # attrition | readiness | skill_demand | promotion | anomaly | cluster
    prediction_data: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON
    result_value: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    confidence: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    model_version: Mapped[str] = mapped_column(String(50), default="v1.0", nullable=False)
    shap_values: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON SHAP data
    explanation: Mapped[str | None] = mapped_column(Text, nullable=True)  # NL explanation
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )

    # --- Relationships ---
    employee = relationship("Employee", back_populates="predictions")

    def __repr__(self) -> str:
        return f"<Prediction {self.prediction_type} conf={self.confidence:.2f}>"
