import json
from fastapi import APIRouter, Depends
from services.redis import redis_client
from middleware.auth import auth
from fastapi.encoders import jsonable_encoder
from services.Medication import GetAllMedicinesForUser
from db.database import async_get_db, AsyncSession

MedicineRouter = APIRouter()

@MedicineRouter.get("/Get")
async def get_medicines(
    db: AsyncSession = Depends(async_get_db),
    current_user: dict = Depends(auth),
):
    auth_user_id = int(current_user["id"])

    redis_key = f"user:{auth_user_id}:medicines"

    cached_medicines = await redis_client.get(redis_key)

    if cached_medicines:
        return json.loads(cached_medicines)
    
    
    medicines = await GetAllMedicinesForUser(db, auth_user_id)

    serialized_medicines = jsonable_encoder(medicines)
    
    await redis_client.set(
        redis_key,
        json.dumps(serialized_medicines),
        ex=3600
    )

    await redis_client.set(
        redis_key,
        json.dumps(medicines),
        ex=3600
    )
    
    return medicines