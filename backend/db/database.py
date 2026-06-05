import ssl
from collections.abc import AsyncGenerator
from sqlalchemy.ext.asyncio import (
    async_sessionmaker,
    create_async_engine,
    AsyncSession
)
from sqlalchemy.orm import DeclarativeBase, MappedAsDataclass
from config import config


class Base(DeclarativeBase, MappedAsDataclass):
    pass


ssl_context = ssl.create_default_context()
ssl_context.check_hostname = True
ssl_context.verify_mode = ssl.CERT_REQUIRED

async_engine = create_async_engine(
    config["DATABASE_URL"],
    echo=False,
    future=True,
    pool_pre_ping=True,
    pool_recycle=300,
    pool_size=5,
    max_overflow=10,
    connect_args={
        "ssl": ssl_context,          
        "server_settings": {
            "application_name": "medvault"
        },
        "timeout": 30               
    }
)

local_session = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False
)


async def async_get_db() -> AsyncGenerator[AsyncSession, None]:
    async with local_session() as db:
        try:
            yield db
            await db.commit()
        except Exception:
            await db.rollback()
            raise