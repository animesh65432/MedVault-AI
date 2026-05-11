from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    token: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: str