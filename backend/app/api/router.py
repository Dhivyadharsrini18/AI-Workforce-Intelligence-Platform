"""
Master API Router
=================
Aggregates all v1 API routers into a single router for the application.
"""

from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.employees import router as employees_router
from app.api.v1.departments import router as departments_router
from app.api.v1.skills import router as skills_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.recommendations import router as recommendations_router
from app.api.v1.forecast import router as forecast_router
from app.api.v1.gaps import router as gaps_router
from app.api.v1.readiness import router as readiness_router
from app.api.v1.promotion import router as promotion_router
from app.api.v1.attrition import router as attrition_router
from app.api.v1.decision import router as decision_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.echarts_analytics import router as echarts_analytics_router

# Master router — all v1 endpoints are prefixed with /api/v1
api_router = APIRouter(prefix="/api/v1")

# --- Register sub-routers ---
api_router.include_router(auth_router)
api_router.include_router(employees_router)
api_router.include_router(departments_router)
api_router.include_router(skills_router)
api_router.include_router(analytics_router)
api_router.include_router(echarts_analytics_router)
api_router.include_router(recommendations_router)
api_router.include_router(forecast_router)
api_router.include_router(gaps_router)
api_router.include_router(readiness_router)
api_router.include_router(promotion_router)
api_router.include_router(attrition_router)
api_router.include_router(decision_router)
api_router.include_router(dashboard_router)

# Future routers (added in subsequent milestones):
# api_router.include_router(predictions_router)
# api_router.include_router(forecasting_router)
# api_router.include_router(reports_router)
# api_router.include_router(analytics_router)
# api_router.include_router(chat_router)
