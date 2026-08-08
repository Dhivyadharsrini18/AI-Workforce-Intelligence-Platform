from datetime import datetime
from typing import Any, Dict, List, Optional, Union

from pydantic import BaseModel, Field


# ---------------------------------------------------------
# Forecasting Schemas
# ---------------------------------------------------------
class TimeSeriesPoint(BaseModel):
    date: str
    demand: float
    upper: float
    lower: float
    type: str


class SkillForecast(BaseModel):
    skill_id: str
    skill_name: str
    category: str
    is_emerging: bool
    is_critical: bool
    current_demand: float
    forecast_6m: float
    forecast_12m: float
    forecast_24m: float
    growth_rate: float
    confidence: float
    trend_direction: str
    time_series: Optional[List[TimeSeriesPoint]] = None


class TechnologyTrend(BaseModel):
    rank: int
    skill_id: str
    skill_name: str
    category: str
    subcategory: Optional[str] = None
    current_demand: float
    future_demand: float
    growth_rate: float
    is_emerging: bool
    is_critical: bool
    trend_direction: str


# ---------------------------------------------------------
# Gap Analysis Schemas
# ---------------------------------------------------------
class SkillGap(BaseModel):
    skill_id: str
    skill_name: str
    category: str
    is_critical: bool
    current_level: Optional[float] = None
    target_level: Optional[float] = None
    avg_current: Optional[float] = None
    avg_target: Optional[float] = None
    gap: Optional[float] = None
    gap_pct: float
    priority: Optional[str] = None
    employees_assessed: Optional[int] = None


class MissingSkill(BaseModel):
    skill_id: str
    skill_name: str
    category: str
    future_demand: float


class OrganizationGapOverview(BaseModel):
    total_skills_tracked: int
    average_gap_percentage: float
    critical_gaps_count: int
    top_gaps: List[SkillGap]
    critical_gaps: List[SkillGap]
    skills_at_target: int


class DepartmentGaps(BaseModel):
    department_id: str
    department: str
    employee_count: int
    average_gap: float
    gaps: List[SkillGap]
    missing_skills: List[MissingSkill]


class EmployeeGaps(BaseModel):
    employee_id: str
    employee_name: str
    job_title: str
    skills_assessed: int
    average_gap: float
    readiness_impact: float
    gaps: List[SkillGap]


class DepartmentComparison(BaseModel):
    department_id: str
    department_name: str
    employee_count: int
    average_gap: float
    critical_gaps: int
    skills_tracked: int
    risk_level: str


# ---------------------------------------------------------
# Readiness Schemas
# ---------------------------------------------------------
class SHAPValue(BaseModel):
    feature: str
    value: float
    contribution: float
    direction: str


class ReadinessScore(BaseModel):
    employee_id: str
    employee_name: str
    job_title: str
    readiness_score: float
    confidence: float
    features: Dict[str, float]
    shap_values: List[SHAPValue]
    explanation: str
    trend: str
    recommendation: str


class ReadinessRanking(BaseModel):
    rank: int
    department_id: str
    department_name: str
    average_readiness: float
    employee_count: int
    status: str

# ---------------------------------------------------------
# Phase B1: Advanced Predictions
# ---------------------------------------------------------
class PromotionPrediction(BaseModel):
    employee_id: str
    employee_name: str
    job_title: str
    promotion_probability: float
    leadership_potential: float
    confidence: float
    features: Dict[str, float]
    shap_values: List[SHAPValue]
    explanation: str
    suggested_action: str
    timeline: str

class AttritionPrediction(BaseModel):
    employee_id: str
    employee_name: str
    job_title: str
    attrition_probability: float
    risk_level: str
    confidence: float
    features: Dict[str, float]
    shap_values: List[SHAPValue]
    explanation: str
    recommended_action: str

class HighRiskEmployee(BaseModel):
    employee_id: str
    name: str
    risk: float

class DepartmentAttritionRisk(BaseModel):
    department_id: str
    department: str
    employee_count: int
    average_risk: float
    risk_level: str
    high_risk_count: int
    top_flight_risks: List[HighRiskEmployee]

class DecisionMetrics(BaseModel):
    market_availability: str
    demand_growth: float
    required_headcount: int

class DecisionRecommendation(BaseModel):
    skill_id: str
    skill_name: str
    strategy: str
    priority: str
    confidence: float
    business_impact: str
    estimated_cost: float
    estimated_time_months: int
    roi_percentage: float
    alternative_strategy: str
    metrics: DecisionMetrics
