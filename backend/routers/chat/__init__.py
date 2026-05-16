import json

from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from fastapi.responses import StreamingResponse

from services.docs import SearchDocuments

from utils.generate_embedding import (
    generate_embedding
)

from db.database import (
    async_get_db,
    AsyncSession
)

from utils.make_chat import (
    generate_chat_response_stream
)

from middleware.auth import auth


ChatRouter = APIRouter()


@ChatRouter.post("/send")
async def chat(
    query: str,
    db: AsyncSession = Depends(async_get_db),
    current_user: dict = Depends(auth)
):

    if not query or len(query.strip()) == 0:
        raise HTTPException(
            status_code=400,
            detail="Query parameter is required"
        )

    query_embedding = await generate_embedding(
        query,
        task="retrieval.query"
    )

    results = await SearchDocuments(
        db=db,
        user_id=current_user["id"],
        query_embedding=query_embedding,
        limit=3,
        max_distance=0.7
    )

    if not results:

        async def empty_stream():

            yield json.dumps({
                "type": "content",
                "data": "No relevant medical records found."
            }) + "\n"

            yield json.dumps({
                "type": "done"
            }) + "\n"

        return StreamingResponse(
            empty_stream(),
            media_type="text/event-stream"
        )

    context = "\n\n---\n\n".join([
        f"""
        Document: {doc['title']}

        Content:
        {doc['content']}
        """
        for doc in results
    ])

    async def stream_generator():

        # STREAM AI RESPONSE
        async for chunk in generate_chat_response_stream(
            query,
            context
        ):

            yield json.dumps({
                "type": "content",
                "data": chunk
            }) + "\n"

        # SEND SOURCES AT END
        yield json.dumps({
            "type": "sources",
            "data": [
                {
                    "id": doc["id"],
                    "title": doc["title"],
                    "doc_type": doc["doc_type"],
                    "source_link": doc.get("source_link")
                }
                for doc in results
            ]
        }) + "\n"

       
        yield json.dumps({
            "type": "done"
        }) + "\n"

    return StreamingResponse(
        stream_generator(),
        media_type="application/json"
    )