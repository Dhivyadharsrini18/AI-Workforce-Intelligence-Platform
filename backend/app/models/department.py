"""
Department Model
================
Organizational departments with headcount tracking and budget management.
"""

import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Department(Base):
    __tablename__ = "departments"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    location: Mapped[str | None] = mapped_column(String(200), nullable=True)
    manager_name: Mapped[str | None] = mapped_column(String(200), nullable=True)
    headcount: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    budget: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )

    # --- Relationships ---
    employees = relationship("Employee", back_populates="department")

    def __repr__(self) -> str:
        return f"<Department {self.name}>"
