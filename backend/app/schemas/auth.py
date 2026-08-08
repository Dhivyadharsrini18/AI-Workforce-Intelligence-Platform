"""
Authentication Schemas
======================
Pydantic models for login, register, token, and password reset flows.
"""

from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


# --- Request Schemas ---
class LoginRequest(BaseModel):
    """Login with email and password."""
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)


class RegisterRequest(BaseModel):
    """Register a new user account."""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    role: str = Field(default="employee", pattern="^(admin|hr_manager|employee)$")


class ForgotPasswordRequest(BaseModel):
    """Request a password reset email."""
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    """Reset password with a valid token."""
    token: str
    new_password: str = Field(..., min_length=8, max_length=128)


class RefreshTokenRequest(BaseModel):
    """Refresh an expired access token."""
    refresh_token: str


class ChangePasswordRequest(BaseModel):
    """Change password for authenticated user."""
    current_password: str = Field(..., min_length=6)
    new_password: str = Field(..., min_length=8, max_length=128)


# --- Response Schemas ---
class TokenResponse(BaseModel):
    """JWT token pair response."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds


class UserResponse(BaseModel):
    """User profile response (excludes password_hash)."""
    id: str
    email: str
    first_name: str
    last_name: str
    role: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class AuthResponse(BaseModel):
    """Combined auth response with tokens and user profile."""
    user: UserResponse
    tokens: TokenResponse


class MessageResponse(BaseModel):
    """Generic message response."""
    message: str
    success: bool = True
