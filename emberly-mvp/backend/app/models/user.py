from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, EmailStr
from uuid import uuid4


class UserBase(BaseModel):
    email: EmailStr
    phone: Optional[str] = None
    auth_provider: str = Field(..., description="Authentication provider (google, apple, phone)")


class UserCreate(UserBase):
    pass


class UserInDB(UserBase):
    id: str = Field(default_factory=lambda: str(uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_active: datetime = Field(default_factory=datetime.utcnow)


class User(UserInDB):
    class Config:
        schema_extra = {
            "example": {
                "id": "f0e4f84a-5134-4c44-b9c9-e2c3e4b6a16b",
                "email": "user@example.com",
                "phone": "+1234567890",
                "auth_provider": "google",
                "created_at": "2023-05-01T12:00:00Z",
                "last_active": "2023-05-01T12:00:00Z"
            }
        } 