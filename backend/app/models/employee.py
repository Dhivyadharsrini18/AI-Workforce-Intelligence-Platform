"""
Employee Model
==============
Core employee profile with performance, readiness, and attrition metrics.
"""

import uuid
from datetime import date, datetime

from sqlalchemy import Date, DateTime, Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Employee(Base):
    __tablename__ = "employees"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("users.id"), nullable=True, unique=True
    )
    department_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("departments.id"), nullable=False
    )
    employee_code: Mapped[str] = mapped_column(
        String(20), unique=True, nullable=False, index=True
    )  # EMP-XXXXX
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    job_title: Mapped[str] = mapped_column(String(200), nullable=False)
    job_level: Mapped[str] = mapped_column(
        String(20), nullable=False, default="mid"
    )  # junior | mid | senior | lead | director | vp
    experience_years: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    salary: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    performance_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    engagement_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    readiness_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    attrition_risk: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    manager_name: Mapped[str | None] = mapped_column(String(200), nullable=True)
    manager_rating: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    hire_date: Mapped[date] = mapped_column(Date, nullable=False)
    projects_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    status: Mapped[str] = mapped_column(
        String(20), nullable=False, default="active"
    )  # active | inactive | on_leave | terminated
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )

    # --- Relationships ---
    user = relationship("User", back_populates="employee")
    department = relationship("Department", back_populates="employees")
    skills = relationship("EmployeeSkill", back_populates="employee", cascade="all, delete-orphan")
    learning_records = relationship(
        "LearningRecord", back_populates="employee", cascade="all, delete-orphan"
    )
    certifications = relationship(
        "Certification", back_populates="employee", cascade="all, delete-orphan"
    )
    predictions = relationship(
        "Prediction", back_populates="employee", cascade="all, delete-orphan"
    )
    recommendations = relationship(
        "Recommendation", back_populates="employee", cascade="all, delete-orphan"
    )

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"

    def __repr__(self) -> str:
        return f"<Employee {self.employee_code}: {self.full_name}>"
