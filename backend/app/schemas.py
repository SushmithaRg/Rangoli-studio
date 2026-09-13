import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, constr


class SignupRequest(BaseModel):
    username: constr(min_length=2, max_length=50, strip_whitespace=True)
    password: constr(min_length=4, max_length=100)


class LoginRequest(BaseModel):
    username: str
    password: str


class UserOut(BaseModel):
    id: uuid.UUID
    username: str
    avatar: Optional[str] = None

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class AvatarUpdate(BaseModel):
    avatar: str


class DesignCreate(BaseModel):
    category: constr(pattern="^(trace|freedraw)$")
    label: Optional[str] = None
    level: Optional[str] = None
    image_data: str


class DesignOut(BaseModel):
    id: uuid.UUID
    category: str
    label: Optional[str]
    level: Optional[str]
    image_data: str
    created_at: datetime

    class Config:
        from_attributes = True
