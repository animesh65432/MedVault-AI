from upstash_redis.asyncio import Redis
from config import config

redis_client = Redis(
    url="https://knowing-hen-126849.upstash.io", 
    token=config["REDIS_TOKEN"]
)