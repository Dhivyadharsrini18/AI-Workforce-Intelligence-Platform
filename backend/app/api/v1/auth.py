from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services.auth_service import AuthService
from app.schemas.auth import (
    LoginRequest, 
    RegisterRequest, 
    AuthResponse, 
    UserResponse, 
    TokenResponse, 
    MessageResponse
)
from app.schemas.common import StandardResponse

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=StandardResponse[AuthResponse])
async def register(request: RegisterRequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    try:
        user = await service.register(
            email=request.email,
            password=request.password,
            first_name=request.first_name,
            last_name=request.last_name,
            role=request.role
        )
        
        # After register, we also login the user to return tokens
        logged_in_user, tokens = await service.login(email=request.email, password=request.password)
        
        user_response = UserResponse.model_validate(logged_in_user)
        token_response = TokenResponse(**tokens)
        auth_response = AuthResponse(user=user_response, tokens=token_response)
        
        return StandardResponse(success=True, data=auth_response)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/login", response_model=StandardResponse[AuthResponse])
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    try:
        user, tokens = await service.login(email=request.email, password=request.password)
        user_response = UserResponse.model_validate(user)
        token_response = TokenResponse(**tokens)
        auth_response = AuthResponse(user=user_response, tokens=token_response)
        
        return StandardResponse(success=True, data=auth_response)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
