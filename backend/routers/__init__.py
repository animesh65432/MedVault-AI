from .users import UserRouter
from .docs import Docsrouter
from fastapi import APIRouter

router = APIRouter()

router.include_router(UserRouter, prefix="/users", tags=["users"])
router.include_router(Docsrouter, prefix="/docs", tags=["docs"])

