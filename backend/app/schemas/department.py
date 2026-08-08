from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field

# =====================================================================
# Department Schemas
# =====================================================================

class DepartmentBase(BaseModel):
    name: str = Field(..., max_length=100)
    description: Optional[str] = None
    location: Optional[str] = None
    headcount: int = 0
    budget: float = 0.0

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None
    location: Optional[str] = None
    headcount: Optional[int] = None
    budget: Optional[float] = None

class DepartmentResponse(DepartmentBase):
    id: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
