"""
Certification Model
===================
Employee professional certifications with expiry tracking.
"""

import uuid
from datetime import date

from sqlalchemy import Date, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Certification(Base):
    __tablename__ = "certifications"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    employee_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("employees.id", ondelete="CASCADE"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(300), nullable=False)
    issuer: Mapped[str] = mapped_column(String(200), nullable=False)
    credential_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    earned_date: Mapped[date] = mapped_column(Date, nullable=False)
    expiry_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    status: Mapped[str] = mapped_column(
        String(20), nullable=False, default="active"
    )  # active | expired | revoked

    # --- Relationships ---
    employee = relationship("Employee", back_populates="certifications")

    def __repr__(self) -> str:
        return f"<Certification {self.name} ({self.issuer})>"
