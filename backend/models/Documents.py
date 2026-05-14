from sqlalchemy import (
    String,
    Integer,
    DateTime,
    JSON,
    ForeignKey,
    Text,
    UniqueConstraint
)

from typing import TYPE_CHECKING
from datetime import datetime

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from pgvector.sqlalchemy import Vector
from db.database import Base


if TYPE_CHECKING:
    from .User import User


class Document(Base):
    __tablename__ = "documents"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "file_hash"
        ),
    )

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
        init=False
    )

    title: Mapped[str] = mapped_column(
        String,
        nullable=True
    )

    content: Mapped[str] = mapped_column(
        Text
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        index=True
    )

    source_link: Mapped[str] = mapped_column(
        String,
        nullable=True
    )
    file_hash: Mapped[str] = mapped_column(
        String,
        nullable=False,
        index=True
    )

    embedding: Mapped[list[float]] = mapped_column(
        Vector(1024),
        nullable=True
    )
    doc_type: Mapped[str] = mapped_column(
        String,
        nullable=True,
        index=True
    )
    
    document_metadata: Mapped[dict] = mapped_column(
        JSON,
        nullable=True
    )
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.utcnow()
    )

    owner: Mapped["User"] = relationship(
        "User",
        back_populates="documents",
        init=False
    )