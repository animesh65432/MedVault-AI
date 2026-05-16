import math
import uuid
from fastapi import Request
from fastapi.responses import JSONResponse
from services.redis import redis_client

def rate_limiter(limit: int, window_ms: int):
    async def middleware(request: Request, call_next):
        ip             = request.client.host
        key            = f"rate-limit:{ip}"
        expire_seconds = math.floor(window_ms / 1000)

        request.state.id = request.headers.get("X-Request-ID", str(uuid.uuid4()))

        try:
            count = await redis_client.get(key)

            if count:
                current = int(count)
                ttl     = await redis_client.ttl(key)

                if ttl == -1:
                    await redis_client.expire(key, expire_seconds)

                if current >= limit:
                    return JSONResponse(
                        status_code=429,
                        headers={
                            "Retry-After":  str(expire_seconds),
                            "X-Request-ID": request.state.id,
                        },
                        content={
                            "message": "Too many requests, please try again later.",
                            "req_id":  request.state.id,
                        },
                    )

                await redis_client.incr(key)

            else:
                await redis_client.set(key, "1", ex=expire_seconds)

        except Exception as e:
            print(f"Redis rate limiter error: {e}")

        response = await call_next(request)
        response.headers["X-Request-ID"] = request.state.id
        return response

    return middleware