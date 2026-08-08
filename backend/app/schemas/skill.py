from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class SkillBase(BaseModel):
    name: str = Field(..., max_length=150)
    category: str = Field(..., max_length=50)
    subcategory: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None
    future_demand_score: float = 50.0
    current_demand_score: float = 50.0
    growth_rate: float = 0.0
    is_emerging: bool = False
    is_critical: bool = False


class SkillCreate(SkillBase):
    pass


class SkillUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=150)
    category: Optional[str] = Field(None, max_length=50)
    subcategory: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None
    future_demand_score: Optional[float] = None
    current_demand_score: Optional[float] = None
    growth_rate: Optional[float] = None
    is_emerging: Optional[bool] = None
    is_critical: Optional[bool] = None


class SkillResponse(SkillBase):
    id: str

    class Config:
        from_attributes = True
