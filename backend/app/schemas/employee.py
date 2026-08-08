from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field

# Placeholder for nested models to avoid circular imports during schema creation
class DepartmentBase(BaseModel):
    id: str
    name: str
    model_config = ConfigDict(from_attributes=True)

class SkillBase(BaseModel):
    id: str
    name: str
    category: str
    subcategory: Optional[str] = None
    is_critical: bool
    model_config = ConfigDict(from_attributes=True)

class CourseBase(BaseModel):
    id: str
    title: str
    provider: str
    difficulty: str
    category: str
    model_config = ConfigDict(from_attributes=True)

# =====================================================================
# EmployeeSkill Schemas
# =====================================================================

class EmployeeSkillBase(BaseModel):
    skill_id: str
    proficiency_level: int = Field(ge=1, le=5)
    target_level: int = Field(ge=1, le=5)
    assessed_by: Optional[str] = None

class EmployeeSkillResponse(EmployeeSkillBase):
    id: str
    employee_id: str
    assessed_at: date
    skill: Optional[SkillBase] = None
    
    model_config = ConfigDict(from_attributes=True)

# =====================================================================
# Certification Schemas
# =====================================================================

class CertificationBase(BaseModel):
    name: str
    issuer: str
    credential_id: Optional[str] = None
    earned_date: date
    expiry_date: Optional[date] = None
    status: str

class CertificationResponse(CertificationBase):
    id: str
    employee_id: str
    
    model_config = ConfigDict(from_attributes=True)

# =====================================================================
# LearningRecord Schemas
# =====================================================================

class LearningRecordResponse(BaseModel):
    id: str
    employee_id: str
    course_id: str
    progress_pct: float
    status: str
    score: Optional[float] = None
    started_at: Optional[date] = None
    completed_at: Optional[date] = None
    course: Optional[CourseBase] = None
    
    model_config = ConfigDict(from_attributes=True)

# =====================================================================
# Employee Schemas
# =====================================================================

class EmployeeBase(BaseModel):
    department_id: str
    employee_code: str = Field(..., max_length=20)
    first_name: str
    last_name: str
    email: str
    job_title: str
    job_level: str
    experience_years: int = 0
    salary: float = 0.0
    performance_score: float = 0.0
    engagement_score: float = 0.0
    readiness_score: float = 0.0
    attrition_risk: float = 0.0
    hire_date: date
    manager_name: Optional[str] = None
    manager_rating: float = 0.0
    status: str = "active"

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    department_id: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    job_title: Optional[str] = None
    job_level: Optional[str] = None
    experience_years: Optional[int] = None
    salary: Optional[float] = None
    performance_score: Optional[float] = None
    engagement_score: Optional[float] = None
    manager_name: Optional[str] = None
    manager_rating: Optional[float] = None
    status: Optional[str] = None

class EmployeeResponse(EmployeeBase):
    id: str
    user_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    # Optional nested data (when explicitly requested)
    department: Optional[DepartmentBase] = None
    
    model_config = ConfigDict(from_attributes=True)

class EmployeeDetailResponse(EmployeeResponse):
    skills: List[EmployeeSkillResponse] = []
    certifications: List[CertificationResponse] = []
    # learning records can be fetched separately or included
    
    model_config = ConfigDict(from_attributes=True)

class EmployeeListResponse(BaseModel):
    items: List[EmployeeResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
