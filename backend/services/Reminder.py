from sqlalchemy import select
from models.Reminder import Reminder
from sqlalchemy.ext.asyncio import AsyncSession

async def GetAllRemindersForUser(db: AsyncSession, user_id: int):
    
    stmt = (
        select(Reminder)
        .where(
            Reminder.user_id == user_id,
            Reminder.is_active == True
        )
    )

    result = await db.execute(stmt)
    
    return result.scalar() or 0