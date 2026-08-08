"""
Recommendation Model
====================
AI-generated course and certification recommendations for employees.
"""

import uuid

from sqlalchemy import Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Recommendation(Base):
    __tablename__ = "recommendations"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    employee_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("employees.id", ondelete="CASCADE"), nullable=False
    )
    course_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("courses.id"), nullable=True
    )
    relevance_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    priority: Mapped[str] = mapped_column(
        String(20), nullable=False, default="medium"
    )  # low | medium | high | critical
    skill_gap_addressed: Mapped[str | None] = mapped_column(String(200), nullable=True)
    estimated_hours: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    status: Mapped[str] = mapped_column(
        String(20), nullable=False, default="pending"
    )  # pending | accepted | completed | dismissed

    # --- Relationships ---
    employee = relationship("Employee", back_populates="recommendations")
    course = relationship("Course", back_populates="recommendations")

    def __repr__(self) -> str:
        return f"<Recommendation emp={self.employee_id} priority={self.priority}>"
