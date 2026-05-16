from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.Documents import Document
from exceptions.custom_exceptions import AppException

async def get_document_by_id(db: AsyncSession, document_id: int) -> Document:
    stmt = select(Document).where(Document.id == document_id)
    result = await db.execute(stmt)
    document = result.scalars().first()
    if not document:
        raise AppException("Document not found", status_code=404)
    return document

async def create_document(db: AsyncSession, document_data: dict) -> Document:
    try:
        new_document = Document(**document_data)
        db.add(new_document)
        await db.commit()
        await db.refresh(new_document)
        return new_document
    except Exception as e:
        await db.rollback()
        raise AppException(status_code=500, detail=f"Error creating document: {str(e)}")


async def CheckIfPhotoAlreadyExists(db: AsyncSession, file_hash: str) -> bool:
    stmt = select(Document).where(Document.file_hash == file_hash)
    result = await db.execute(stmt)
    document = result.scalars().first()
    return document is not None

async def GetAllDocumentsForUser(db: AsyncSession, user_id: int) -> list[Document]:
    stmt = select(Document).where(Document.user_id == user_id)
    result = await db.execute(stmt)
    documents = result.scalars().all()
    return documents

async def GetDocumentById(db: AsyncSession, document_id: int, user_id: int) -> Document:
    stmt = select(Document).where(Document.id == document_id, Document.user_id == user_id)
    result = await db.execute(stmt)
    document = result.scalars().first()
    return document


async def SearchDocuments(
    db: AsyncSession,
    user_id: int,
    query_embedding: list[float],
    limit: int = 10
):
    stmt = (
        select(
            Document.id,
            Document.title,
            Document.content,
            Document.doc_type,
            Document.embedding.cosine_distance(query_embedding).label("distance")
        )
        .where(Document.user_id == user_id)
        .order_by(
            Document.embedding.cosine_distance(query_embedding)
        )
        .limit(limit)
    )

    result = await db.execute(stmt)

    return result.mappings().all()