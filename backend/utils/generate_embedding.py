import httpx
from config import config

async def generate_embedding(text: str, task: str = "retrieval.passage"):  # ← add task param
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            "https://api.jina.ai/v1/embeddings",
            headers={
                "Authorization": f"Bearer {config['JINA_API_KEY']}",
                "Content-Type": "application/json"
            },
            json={
                "model": "jina-embeddings-v5-text-small",
                "task": task,                  
                "dimensions": 1024,
                "normalized": True,
                "input": [text]
            }
        )
        response.raise_for_status()
        data = response.json()
        return data["data"][0]["embedding"]