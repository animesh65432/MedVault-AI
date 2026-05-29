import httpx
from config import config

async def extract_text_from_pdf_url(pdf_url: str) -> str:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.mistral.ai/v1/ocr",
            headers={"Authorization": f"Bearer {config['MISTRAL_API_KEY']}"},
            json={
                "model": "mistral-ocr-latest",
                "document": {
                    "type": "document_url",
                    "document_url": pdf_url  
                }
            }
        )
        pages = response.json()["pages"]
        return "\n\n".join(
            f"--- Page {p['index'] + 1} ---\n{p['markdown']}"
            for p in pages
        )