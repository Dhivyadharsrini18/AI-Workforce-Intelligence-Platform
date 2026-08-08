"""
Workforce Intelligence Platform — FastAPI Application
=====================================================
Main entry point for the backend server.
Configures middleware, routes, startup/shutdown events, and OpenAPI docs.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse

from app.api.router import api_router
from app.config import get_settings
from app.database import close_db, init_db

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle: startup and shutdown events."""
    # --- Startup ---
    print(f"Starting {settings.app_name} v{settings.app_version}")
    print(f"Environment: {settings.environment}")
    print(f"Database: {'SQLite' if settings.is_sqlite else 'PostgreSQL'}")

    # Create tables (for SQLite dev mode; PostgreSQL uses Alembic migrations)
    if settings.is_sqlite:
        await init_db()
        print("SQLite tables created")

    yield

    # --- Shutdown ---
    await close_db()
    print("Application shutdown complete")


# --- Application Factory ---
app = FastAPI(
    title=settings.app_name,
    description=(
        "AI-powered workforce analytics platform for skill forecasting, "
        "gap analysis, and strategic workforce planning."
    ),
    version=settings.app_version,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    default_response_class=ORJSONResponse,
    lifespan=lifespan,
)

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routes ---
app.include_router(api_router)


# --- Health Check ---
@app.get("/health", tags=["System"])
async def health_check():
    """System health check endpoint."""
    return {
        "status": "healthy",
        "app": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment,
    }


@app.get("/", tags=["System"])
async def root():
    """Root endpoint with API information."""
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs",
        "health": "/health",
    }
