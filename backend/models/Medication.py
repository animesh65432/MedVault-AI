from sqlalchemy import (
    String,
    Integer,
    ForeignKey,
    DateTime
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from datetime import datetime

from db.database import Base


class Medication(Base):
    __tablename__ = "medications"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
        init=False
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE"
        ),
        index=True
    )

    document_id: Mapped[int] = mapped_column(
        ForeignKey(
            "documents.id",
            ondelete="CASCADE"
        ),
        index=True
    )

    name: Mapped[str] = mapped_column(
        String,
        index=True
    )

    dosage: Mapped[str] = mapped_column(
        String,
        nullable=True
    )

    frequency: Mapped[str] = mapped_column(
        String,
        nullable=True
    )

    duration: Mapped[str] = mapped_column(
        String,
        nullable=True
    )

    timing: Mapped[str] = mapped_column(
        String,
        nullable=True
    )
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default_factory=datetime.utcnow,
        init=False
    )

    document = relationship(
        "Document",
        back_populates="medications"
    )
    
    user = relationship(
        "User",
        back_populates="medications"
    )

