from typing import TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from db.database import Base


if TYPE_CHECKING:
    from .Documents import Document


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        autoincrement=True,
        primary_key=True,
        init=False
    )

    name: Mapped[str] = mapped_column(
        String(300)
    )

    email: Mapped[str] = mapped_column(
        String(300),
        unique=True,
        index=True
    )

    profile_image: Mapped[str] = mapped_column(
        String,
        default="https://cdn-icons-png.magnific.com/512/1077/1077114.png"
    )

    documents: Mapped[list["Document"]] = relationship(
        "Document",
        back_populates="owner",
        cascade="all, delete-orphan",
        init=False
    )

    medications = relationship(
        "Medication",
        back_populates="user",
        cascade="all, delete-orphan",
        init=False
    )