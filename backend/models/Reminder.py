from sqlalchemy import (
    Boolean,
    String,
    Integer,
    DateTime,
    ForeignKey,
)
from datetime import datetime
from sqlalchemy.orm import (
    mapped_column,
)
from db.database import Base


class Reminder(Base):
    __tablename__ = "reminders"

    id = mapped_column(Integer, primary_key=True)

    user_id = mapped_column(
        ForeignKey("users.id")
    )

    medication_name = mapped_column(String)

    is_active = mapped_column(Boolean, default=True)

    created_at = mapped_column(
        DateTime,
        default=datetime.utcnow
    )