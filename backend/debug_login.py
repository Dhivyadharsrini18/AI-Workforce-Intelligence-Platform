import asyncio
import orjson
from app.database import async_session_factory
from app.services.auth_service import AuthService
from app.schemas.auth import UserResponse, TokenResponse, AuthResponse
from app.schemas.common import StandardResponse
from fastapi.encoders import jsonable_encoder

async def main():
    async with async_session_factory() as db:
        service = AuthService(db)
        try:
            user, tokens = await service.login('demo@workforce.ai', 'Demo@123')
            user_response = UserResponse.model_validate(user)
            token_response = TokenResponse(**tokens)
            auth_response = AuthResponse(user=user_response, tokens=token_response)
            std_resp = StandardResponse(success=True, data=auth_response)
            
            # Simulate what FastAPI does with ORJSONResponse
            encoded = jsonable_encoder(std_resp)
            json_bytes = orjson.dumps(encoded)
            print(json_bytes.decode())
            print('Login success')
        except Exception as e:
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
