"""
Database Configuration
======================
Async SQLAlchemy engine, session factory, and base model.
Supports both PostgreSQL (production) and SQLite (development).
"""

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import get_settings

settings = get_settings()

# --- Engine Configuration ---
# SQLite requires special handling for async and foreign keys
engine_kwargs = {}
if settings.is_sqlite:
    engine_kwargs = {
        "connect_args": {"check_same_thread": False},
        "echo": settings.debug,
    }
else:
    engine_kwargs = {
        "echo": settings.debug,
        "pool_size": 20,
        "max_overflow": 10,
        "pool_pre_ping": True,
        "pool_recycle": 300,
    }

engine = create_async_engine(settings.database_url, **engine_kwargs)

# --- Session Factory ---
async_session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


# --- Base Model ---
class Base(DeclarativeBase):
    """Base class for all SQLAlchemy ORM models."""
    pass

# --- Dependency ---
async def get_db():
    async with async_session_factory() as session:
        yield session


# --- Lifecycle Helpers ---
async def init_db() -> None:
    """Create all tables. Used on startup for SQLite development."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def close_db() -> None:
    """Dispose of the engine connection pool."""
    await engine.dispose()
