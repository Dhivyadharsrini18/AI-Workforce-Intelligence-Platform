"""
Skill Model
============
Skills taxonomy with demand scoring and emerging skill tracking.
"""

import uuid

from sqlalchemy import Boolean, Float, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    name: Mapped[str] = mapped_column(String(150), unique=True, nullable=False, index=True)
    category: Mapped[str] = mapped_column(
        String(50), nullable=False
    )  # technical | soft | domain | leadership
    subcategory: Mapped[str | None] = mapped_column(String(100), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    future_demand_score: Mapped[float] = mapped_column(Float, default=50.0, nullable=False)
    current_demand_score: Mapped[float] = mapped_column(Float, default=50.0, nullable=False)
    growth_rate: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)  # % growth
    is_emerging: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_critical: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # --- Relationships ---
    employee_skills = relationship("EmployeeSkill", back_populates="skill")

    def __repr__(self) -> str:
        return f"<Skill {self.name} ({self.category})>"
