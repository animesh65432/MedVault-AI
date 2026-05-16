from fastapi import FastAPI 
from exceptions.handlers import app_exception_handler
from exceptions.custom_exceptions import AppException
from routers import router as api_router
from middleware.ratelimiter import rate_limiter
from starlette.middleware.base import BaseHTTPMiddleware
import uvicorn
from db.database import async_engine, Base


app = FastAPI()

app.add_middleware(BaseHTTPMiddleware, dispatch=rate_limiter(limit=10, window_ms=60000))

app.add_exception_handler(
    AppException,
    app_exception_handler
)


@app.on_event("startup")
async def startup():
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@app.get("/")
def read_root():
    return {"Hello": "World"}


app.include_router(api_router, prefix="/api/v1")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)