from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, validator
from uuid import uuid4


class MatchBase(BaseModel):
    users: List[str] = Field(..., description="List of user IDs in the match")
    
    @validator('users')
    def validate_users(cls, v):
        if len(v) < 1:
            raise ValueError('users list cannot be empty')
        return v


class MatchCreate(MatchBase):
    pass


class MatchInDB(MatchBase):
    id: str = Field(default_factory=lambda: str(uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_message_at: Optional[datetime] = None


class Match(MatchInDB):
    class Config:
        schema_extra = {
            "example": {
                "id": "a1b2c3d4-5678-90ab-cdef-ghijklmnopqr",
                "users": [
                    "f0e4f84a-5134-4c44-b9c9-e2c3e4b6a16b",
                    "e5d4c3b2-a109-8765-4321-0fedcba987654"
                ],
                "created_at": "2023-05-01T12:00:00Z",
                "last_message_at": "2023-05-01T12:05:00Z"
            }
        } 