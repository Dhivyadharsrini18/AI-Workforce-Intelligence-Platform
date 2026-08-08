"""
EmployeeSkill Model
===================
Junction table linking employees to skills with proficiency levels.
"""

import uuid
from datetime import date

from sqlalchemy import Date, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class EmployeeSkill(Base):
    __tablename__ = "employee_skills"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    employee_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("employees.id", ondelete="CASCADE"), nullable=False
    )
    skill_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("skills.id"), nullable=False
    )
    proficiency_level: Mapped[int] = mapped_column(
        Integer, nullable=False, default=1
    )  # 1-5 scale
    target_level: Mapped[int] = mapped_column(
        Integer, nullable=False, default=3
    )  # 1-5 target
    assessed_at: Mapped[date | None] = mapped_column(Date, nullable=True)
    assessed_by: Mapped[str | None] = mapped_column(String(200), nullable=True)

    # --- Relationships ---
    employee = relationship("Employee", back_populates="skills")
    skill = relationship("Skill", back_populates="employee_skills")

    @property
    def gap(self) -> int:
        """Difference between target and current proficiency."""
        return max(0, self.target_level - self.proficiency_level)

    def __repr__(self) -> str:
        return f"<EmployeeSkill emp={self.employee_id} skill={self.skill_id} lvl={self.proficiency_level}>"
