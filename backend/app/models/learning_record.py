"""
LearningRecord Model
====================
Tracks employee course enrollments, progress, and completions.
"""

import uuid
from datetime import date

from sqlalchemy import Date, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class LearningRecord(Base):
    __tablename__ = "learning_records"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    employee_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("employees.id", ondelete="CASCADE"), nullable=False
    )
    course_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("courses.id"), nullable=False
    )
    progress_pct: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    score: Mapped[float | None] = mapped_column(Float, nullable=True)
    status: Mapped[str] = mapped_column(
        String(20), nullable=False, default="not_started"
    )  # not_started | in_progress | completed | dropped
    started_at: Mapped[date | None] = mapped_column(Date, nullable=True)
    completed_at: Mapped[date | None] = mapped_column(Date, nullable=True)

    # --- Relationships ---
    employee = relationship("Employee", back_populates="learning_records")
    course = relationship("Course", back_populates="learning_records")

    def __repr__(self) -> str:
        return f"<LearningRecord emp={self.employee_id} course={self.course_id} {self.status}>"
