"""
Report Model
============
Generated reports (PDF/Excel) with metadata and download tracking.
"""

import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Report(Base):
    __tablename__ = "reports"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    report_type: Mapped[str] = mapped_column(
        String(50), nullable=False
    )  # department | employee | executive | skills | forecast
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    report_data: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON
    file_path: Mapped[str | None] = mapped_column(String(500), nullable=True)
    file_format: Mapped[str] = mapped_column(
        String(10), nullable=False, default="pdf"
    )  # pdf | excel
    generated_by: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("users.id"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )

    def __repr__(self) -> str:
        return f"<Report {self.title} ({self.report_type})>"
