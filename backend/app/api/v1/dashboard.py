from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.common import StandardResponse
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/employee-distribution", response_model=StandardResponse)
async def get_employee_distribution(db: AsyncSession = Depends(get_db)):
    service = DashboardService(db)
    data = await service.get_employee_distribution()
    return StandardResponse(success=True, data=data)

@router.get("/department-performance", response_model=StandardResponse)
async def get_department_performance(db: AsyncSession = Depends(get_db)):
    service = DashboardService(db)
    data = await service.get_department_performance()
    return StandardResponse(success=True, data=data)

@router.get("/hiring-vs-attrition", response_model=StandardResponse)
async def get_hiring_vs_attrition(db: AsyncSession = Depends(get_db)):
    service = DashboardService(db)
    data = await service.get_hiring_vs_attrition()
    return StandardResponse(success=True, data=data)

@router.get("/revenue-vs-cost", response_model=StandardResponse)
async def get_revenue_vs_cost(db: AsyncSession = Depends(get_db)):
    service = DashboardService(db)
    data = await service.get_revenue_vs_cost()
    return StandardResponse(success=True, data=data)

@router.get("/monthly-productivity", response_model=StandardResponse)
async def get_monthly_productivity(db: AsyncSession = Depends(get_db)):
    service = DashboardService(db)
    data = await service.get_monthly_productivity()
    return StandardResponse(success=True, data=data)

@router.get("/ai-accuracy", response_model=StandardResponse)
async def get_ai_accuracy(db: AsyncSession = Depends(get_db)):
    service = DashboardService(db)
    data = await service.get_ai_accuracy()
    return StandardResponse(success=True, data=data)

@router.get("/workforce-utilization", response_model=StandardResponse)
async def get_workforce_utilization(db: AsyncSession = Depends(get_db)):
    service = DashboardService(db)
    data = await service.get_workforce_utilization()
    return StandardResponse(success=True, data=data)

@router.get("/executive-kpi", response_model=StandardResponse)
async def get_executive_kpi(db: AsyncSession = Depends(get_db)):
    service = DashboardService(db)
    data = await service.get_executive_kpi()
    return StandardResponse(success=True, data=data)

@router.get("/skill-demand-trend", response_model=StandardResponse)
async def get_skill_demand_trend(db: AsyncSession = Depends(get_db)):
    service = DashboardService(db)
    data = await service.get_skill_demand_trend()
    return StandardResponse(success=True, data=data)

@router.get("/workforce-forecast", response_model=StandardResponse)
async def get_workforce_forecast(db: AsyncSession = Depends(get_db)):
    service = DashboardService(db)
    data = await service.get_workforce_forecast()
    return StandardResponse(success=True, data=data)

@router.get("/recruitment-pipeline", response_model=StandardResponse)
async def get_recruitment_pipeline(db: AsyncSession = Depends(get_db)):
    service = DashboardService(db)
    data = await service.get_recruitment_pipeline()
    return StandardResponse(success=True, data=data)
