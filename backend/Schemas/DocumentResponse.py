from pydantic import BaseModel
from datetime import datetime
from typing import Any

class DocumentResponse(BaseModel):
    id: int
    title: str | None
    content: str
    user_id: int
    source_link: str | None
    file_hash: str
    doc_type: str | None
    document_metadata: dict[str, Any] | None
    created_at: datetime
    model_config = {"from_attributes": True}