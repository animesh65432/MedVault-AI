from sqlalchemy import select, func
from models.Medication import Medication
from sqlalchemy.ext.asyncio import AsyncSession

async def count_medicines(db: AsyncSession, user_id: int) -> int:
    stmt = (
        select(func.count(Medication.name.distinct()))
        .where(Medication.user_id == user_id)
    )
    result = await db.execute(stmt)
    return result.scalar_one()