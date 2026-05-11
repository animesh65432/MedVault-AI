from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from db.database import Base

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(autoincrement=True, primary_key=True, init=False)
    name: Mapped[str] = mapped_column(String(300))
    email: Mapped[str] = mapped_column(String(300), unique=True, index=True)
    profile_image: Mapped[str] = mapped_column(String, default="https://cdn-icons-png.magnific.com/512/1077/1077114.png")
