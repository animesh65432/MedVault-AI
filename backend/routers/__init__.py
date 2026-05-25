from .users import UserRouter
from .docs import Docsrouter
from .chat import ChatRouter
from .medicine import MedicineRouter
from fastapi import APIRouter

router = APIRouter()

router.include_router(UserRouter, prefix="/users", tags=["users"])

router.include_router(Docsrouter, prefix="/docs", tags=["docs"])

router.include_router(ChatRouter, prefix="/chat", tags=["chat"])

router.include_router(MedicineRouter, prefix="/medicine", tags=["medicine"])

