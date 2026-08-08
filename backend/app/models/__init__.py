"""
ORM Models Package
==================
All SQLAlchemy models for the Workforce Intelligence Platform.
"""

from app.models.user import User
from app.models.department import Department
from app.models.employee import Employee
from app.models.skill import Skill
from app.models.employee_skill import EmployeeSkill
from app.models.course import Course
from app.models.learning_record import LearningRecord
from app.models.certification import Certification
from app.models.prediction import Prediction
from app.models.recommendation import Recommendation
from app.models.report import Report
from app.models.notification import Notification
from app.models.audit_log import AuditLog
from app.models.history_records import AttritionRecord, PromotionRecord, HiringRecord, SalaryHistory

__all__ = [
    "User",
    "Department",
    "Employee",
    "Skill",
    "EmployeeSkill",
    "Course",
    "LearningRecord",
    "Certification",
    "Prediction",
    "Recommendation",
    "Report",
    "Notification",
    "AuditLog",
    "AttritionRecord",
    "PromotionRecord",
    "HiringRecord",
    "SalaryHistory",
]
