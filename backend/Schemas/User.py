from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    name: str
    profile_image: str


class UserResponse(BaseModel):
    token: str