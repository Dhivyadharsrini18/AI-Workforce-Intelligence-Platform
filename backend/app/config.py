"""
Application Configuration
=========================
Centralized settings management using Pydantic Settings.
Supports .env files and environment variables.
"""

from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # --- Application ---
    app_name: str = "Workforce Intelligence Platform"
    app_version: str = "1.0.0"
    environment: str = "development"
    debug: bool = True

    # --- Server ---
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000

    # --- Security ---
    secret_key: str = "dev-secret-key-change-in-production-abc123xyz"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    # --- Database ---
    database_url: str = "sqlite+aiosqlite:///./workforce_intelligence.db"

    # --- CORS ---
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    # --- Rate Limiting ---
    rate_limit_per_minute: int = 100

    # --- Logging ---
    log_level: str = "INFO"

    @property
    def cors_origin_list(self) -> List[str]:
        """Parse comma-separated CORS origins into a list."""
        return [origin.strip() for origin in self.cors_origins.split(",")]

    @property
    def is_sqlite(self) -> bool:
        """Check if using SQLite (development fallback)."""
        return "sqlite" in self.database_url.lower()

    @property
    def is_production(self) -> bool:
        """Check if running in production."""
        return self.environment.lower() == "production"


@lru_cache()
def get_settings() -> Settings:
    """Cached settings instance — loaded once per process."""
    return Settings()
