"""
Authentication Service
======================
Business logic for user authentication, registration, and password management.
"""

import json
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.models.audit_log import AuditLog
from app.models.user import User
from app.utils.security import (
    create_access_token,
    create_refresh_token,
    create_reset_token,
    decode_token,
    hash_password,
    verify_password,
    verify_reset_token,
)

settings = get_settings()


class AuthService:
    """Handles all authentication-related business logic."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def register(
        self,
        email: str,
        password: str,
        first_name: str,
        last_name: str,
        role: str = "employee",
    ) -> User:
        """Register a new user. Raises ValueError if email exists."""
        # Check for existing user
        result = await self.db.execute(select(User).where(User.email == email))
        existing = result.scalar_one_or_none()
        if existing:
            raise ValueError("A user with this email already exists")

        # Create user
        user = User(
            email=email,
            password_hash=hash_password(password),
            first_name=first_name,
            last_name=last_name,
            role=role,
        )
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)

        # Audit log
        await self._log_action(user.id, "register", "user", user.id)

        return user

    async def login(self, email: str, password: str) -> tuple[User, dict]:
        """Authenticate user and return tokens. Raises ValueError on failure."""
        result = await self.db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        if not user or not verify_password(password, user.password_hash):
            raise ValueError("Invalid email or password")

        if not user.is_active:
            raise ValueError("Account is deactivated. Contact your administrator.")

        tokens = self._create_tokens(user)

        # Audit log
        await self._log_action(user.id, "login", "user", user.id)

        return user, tokens

    async def refresh_tokens(self, refresh_token: str) -> dict:
        """Generate new token pair from a valid refresh token."""
        payload = decode_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise ValueError("Invalid or expired refresh token")

        user_id = payload.get("sub")
        result = await self.db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()

        if not user or not user.is_active:
            raise ValueError("User not found or deactivated")

        return self._create_tokens(user)

    async def forgot_password(self, email: str) -> str:
        """Generate password reset token. Returns token (in production, email it)."""
        result = await self.db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        if not user:
            # Don't reveal whether email exists — return generic message
            return "If the email exists, a reset link has been sent."

        reset_token = create_reset_token(email)
        user.reset_token = reset_token
        user.reset_token_expires = datetime.now(timezone.utc)
        await self.db.commit()

        return reset_token  # In production, send via email instead

    async def reset_password(self, token: str, new_password: str) -> bool:
        """Reset password using a valid reset token."""
        email = verify_reset_token(token)
        if not email:
            raise ValueError("Invalid or expired reset token")

        result = await self.db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        if not user:
            raise ValueError("User not found")

        user.password_hash = hash_password(new_password)
        user.reset_token = None
        user.reset_token_expires = None
        await self.db.commit()

        await self._log_action(user.id, "reset_password", "user", user.id)
        return True

    async def change_password(
        self, user: User, current_password: str, new_password: str
    ) -> bool:
        """Change password for an authenticated user."""
        if not verify_password(current_password, user.password_hash):
            raise ValueError("Current password is incorrect")

        user.password_hash = hash_password(new_password)
        await self.db.commit()

        await self._log_action(user.id, "change_password", "user", user.id)
        return True

    async def get_user_by_id(self, user_id: str) -> User | None:
        """Fetch a user by their ID."""
        result = await self.db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()

    def _create_tokens(self, user: User) -> dict:
        """Generate access + refresh token pair for a user."""
        token_data = {"sub": user.id, "email": user.email, "role": user.role}
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": settings.access_token_expire_minutes * 60,
        }

    async def _log_action(
        self,
        user_id: str,
        action: str,
        entity_type: str,
        entity_id: str,
        old_values: dict | None = None,
        new_values: dict | None = None,
    ) -> None:
        """Write an audit log entry."""
        log = AuditLog(
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            old_values=json.dumps(old_values) if old_values else None,
            new_values=json.dumps(new_values) if new_values else None,
        )
        self.db.add(log)
        await self.db.commit()
