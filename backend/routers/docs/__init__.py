import hashlib
import json
from datetime import datetime
from fastapi import APIRouter, Depends, UploadFile, HTTPException
from db.database import async_get_db, AsyncSession
from middleware.auth import auth
from utils.upload_photo import upload_photo
from utils.checkItisMediCineOrNot import checkItisMediCineOrNot
from utils.EXtractText import extract_text_from_image
from utils.MakeDocument import make_medical_record
from Schemas.DocumentResponse import DocumentResponse
from services.docs import (
    GetDocumentById, create_document,
    CheckIfPhotoAlreadyExists, GetAllDocumentsForUser, SearchDocuments,count_user_documents
)
from services.Reminder import GetAllRemindersForUser
from utils.generate_embedding import generate_embedding
from services.redis import redis_client
from utils.build_embedding_text import build_embedding_text
from utils.json_serializer import json_serializer
from services.Medication import count_medicines

Docsrouter = APIRouter()

CACHE_TTL = 3600


def dumps(data) -> str:
    return json.dumps(data, default=json_serializer)


@Docsrouter.post("/generate-docs")
async def generate_docs(
    file: UploadFile,
    db: AsyncSession = Depends(async_get_db),
    current_user: dict = Depends(auth),
):
    content = await file.read()
    file_hash = hashlib.sha256(content).hexdigest()
    file.file.seek(0)

    if await CheckIfPhotoAlreadyExists(db, file_hash):
        raise HTTPException(status_code=409, detail="Document already exists")

    image_url = await upload_photo(file)
    if not image_url:
        raise HTTPException(status_code=500, detail="Upload failed")

    extracted_text = await extract_text_from_image(image_url)
    if not extracted_text or not extracted_text.strip():
        raise HTTPException(status_code=500, detail="Failed to extract text from image")

    is_medical = await checkItisMediCineOrNot(extracted_text)
    if is_medical.strip() != "True":
        raise HTTPException(status_code=400, detail="The uploaded document does not appear to be a medical record.")

    medical_record = await make_medical_record(extracted_text)

    date_str = medical_record["document_metadata"].get("date", "")
    document_date = datetime.strptime(date_str, "%d-%m-%Y") if date_str else datetime.now()

    embedding_text = build_embedding_text(medical_record)
    embedding = await generate_embedding(embedding_text, task="retrieval.passage")

    record = await create_document(db, {
        "title": medical_record["title"],
        "content": extracted_text,
        "user_id": current_user["id"],
        "file_hash": file_hash,
        "source_link": image_url,
        "doc_type": medical_record["doc_type"],
        "document_metadata": medical_record["document_metadata"],
        "embedding": embedding,
        "date": document_date,
    })

    await redis_client.delete(f"user:{current_user['id']}:documents")

    return {
        "is_medical": is_medical,
        "record": {
            "id": record.id,
            "title": record.title,
            "content": record.content,
            "doc_type": record.doc_type,
            "source_link": record.source_link,
            "document_metadata": record.document_metadata,
            "created_at": record.created_at,
            "user_id": record.user_id,
            "date": document_date,
        },
    }


@Docsrouter.get("/GetAll", response_model=list[DocumentResponse])
async def GetAllDocs(
    db: AsyncSession = Depends(async_get_db),
    current_user: dict = Depends(auth),
):
    auth_user_id = current_user["id"]
    redis_key = f"user:{auth_user_id}:documents"

    cached_docs = await redis_client.get(redis_key)
    if cached_docs:
        return json.loads(cached_docs)

    documents = await GetAllDocumentsForUser(db, auth_user_id)
    serialized_docs = [DocumentResponse.model_validate(doc).model_dump() for doc in documents]

    await redis_client.set(redis_key, dumps(serialized_docs), ex=CACHE_TTL)

    return serialized_docs


@Docsrouter.get("/Get/{doc_id}", response_model=DocumentResponse)
async def GetDocument(
    doc_id: int,
    db: AsyncSession = Depends(async_get_db),
    current_user: dict = Depends(auth),
):
    auth_user_id = int(current_user["id"])
    # redis_key = f"user:{auth_user_id}:document:{doc_id}"

    # cached_doc = await redis_client.get(redis_key)
    # if cached_doc:
    #     return json.loads(cached_doc)

    document = await GetDocumentById(db, doc_id, auth_user_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    # await redis_client.set(
    #     redis_key,
    #     dumps(DocumentResponse.model_validate(document).model_dump()),
    #     ex=CACHE_TTL,
    # )

    return document


@Docsrouter.delete("/delete/{doc_id}")
async def DeleteDocument(
    doc_id: int,
    db: AsyncSession = Depends(async_get_db),
    current_user: dict = Depends(auth),
):
    auth_user_id = int(current_user["id"])

    document = await GetDocumentById(db, doc_id, auth_user_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    await db.delete(document)
    await db.commit()

    await redis_client.delete(f"user:{auth_user_id}:document:{doc_id}")
    await redis_client.delete(f"user:{auth_user_id}:documents")

    return {"success": True, "message": "Document deleted successfully"}


@Docsrouter.get("/search")
async def search_documents(
    query: str,
    db: AsyncSession = Depends(async_get_db),
    current_user: dict = Depends(auth),
):
    if not query or not query.strip():
        raise HTTPException(status_code=400, detail="Query parameter is required")

    query_hash = hashlib.md5(query.strip().lower().encode()).hexdigest()
    redis_key = f"search:user:{current_user['id']}:{query_hash}"

    cached_results = await redis_client.get(redis_key)
    if cached_results:
        return json.loads(cached_results)

    query_embedding = await generate_embedding(query, task="retrieval.query")

    results = await SearchDocuments(db=db, user_id=current_user["id"], query_embedding=query_embedding)

    await redis_client.set(redis_key, dumps(results), ex=CACHE_TTL)

    return results

@Docsrouter.get("/stats")
async def get_document_stats(
    db: AsyncSession = Depends(async_get_db),
    current_user: dict = Depends(auth),
):
    auth_user_id = current_user["id"]
    redis_key = f"user:{auth_user_id}:document:stats"

    cached_stats = await redis_client.get(redis_key)

    if cached_stats:
        return json.loads(cached_stats)

    total_docs = await count_user_documents(db, auth_user_id)
    total_Medicines_Count = await count_medicines(db, auth_user_id)
    total_reminders_count = await GetAllRemindersForUser(db, auth_user_id)

    stats = {
        "total_documents": total_docs,
        "total_medicine_records": total_Medicines_Count,
        "total_reminders": total_reminders_count
    }

    await redis_client.set(redis_key, dumps(stats), ex=CACHE_TTL)

    return stats

