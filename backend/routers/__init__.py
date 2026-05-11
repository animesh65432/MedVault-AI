from .users import UserRouter
from fastapi import APIRouter

router = APIRouter()

router.include_router(UserRouter, prefix="/users", tags=["users"])


