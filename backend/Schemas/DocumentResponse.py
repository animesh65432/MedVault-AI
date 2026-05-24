from pydantic import BaseModel
from datetime import datetime
from typing import Any, Optional

class MedicationResponse(BaseModel):
    id: int
    name: str
    model_config = {"from_attributes": True}


class DocumentResponse(BaseModel):
    id: int
    title: str | None
    content: str
    user_id: int
    source_link: str | None
    doc_type: str | None
    document_metadata: dict[str, Any] | None
    created_at: datetime
    medications: list[MedicationResponse] = []

    model_config = {"from_attributes": True}