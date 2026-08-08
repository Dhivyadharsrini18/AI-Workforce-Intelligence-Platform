"""
Course Model
============
Learning courses from providers like Microsoft Learn, Coursera, AWS, Google, Udemy.
"""

import uuid

from sqlalchemy import Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Course(Base):
    __tablename__ = "courses"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    title: Mapped[str] = mapped_column(String(300), nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    provider: Mapped[str] = mapped_column(
        String(100), nullable=False
    )  # Microsoft Learn | Coursera | AWS | Google | Udemy
    url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    difficulty: Mapped[str] = mapped_column(
        String(20), nullable=False, default="intermediate"
    )  # beginner | intermediate | advanced | expert
    duration_hours: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    rating: Mapped[float] = mapped_column(Float, default=4.0, nullable=False)
    enrolled_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    skills_covered: Mapped[str | None] = mapped_column(
        Text, nullable=True
    )  # JSON array of skill names
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    # --- Relationships ---
    learning_records = relationship("LearningRecord", back_populates="course")
    recommendations = relationship("Recommendation", back_populates="course")

    def __repr__(self) -> str:
        return f"<Course {self.title[:50]} ({self.provider})>"
