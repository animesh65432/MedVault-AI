from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.User import User
from exceptions.custom_exceptions import AppException


async def get_user_by_email(
    email: str,
    db: AsyncSession
):

    try:

        result = await db.execute(
            select(User).where(
                User.email == email
            )
        )

        return result.scalar_one_or_none()

    except Exception as e:

        raise AppException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )


async def create_user(
    user_data: dict,
    db: AsyncSession
):

    try:

        user = User(**user_data)

        db.add(user)

        await db.commit()

        await db.refresh(user)

        return user

    except Exception as e:

        await db.rollback()

        raise AppException(
            status_code=500,
            detail=f"Error creating user: {str(e)}"
        )