from fastapi import APIRouter, Depends
from Schemas.User import UserCreate

from services.user import (
    get_user_by_email,
    create_user
)

from utils.verify_user_Create_Payload import VerifyUserCreatePayload

from utils.create_token import (
    create_access_token
)

from db.database import (
    async_get_db,
    AsyncSession
)

from exceptions.custom_exceptions import (
    AppException
)

from middleware.auth import auth

UserRouter = APIRouter()


@UserRouter.post("/login")
async def login(
    payload: UserCreate,
    db: AsyncSession = Depends(async_get_db)
):

    user_info = VerifyUserCreatePayload(**payload.dict())
    
    if not user_info:
        raise AppException(
            status_code=401,
            detail="Invalid payload"
        )

    user = await get_user_by_email(
        user_info["email"],
        db
    )

    if not user:

        user = await create_user(
            user_info,
            db
        )

    access_token = create_access_token({
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "profile_image": user.profile_image
    })

    return {
        "success": True,
        "token_type": "bearer",
        "access_token": access_token
    }


@UserRouter.get("/me")
async def get_current_user(
    current_user: dict = Depends(auth)
):
    return {
        "success": True,
        "user": current_user
    }