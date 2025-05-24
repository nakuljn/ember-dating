from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator
from uuid import uuid4


class SwipeBase(BaseModel):
    user_id: str
    target_id: str
    is_like: bool


class SwipeCreate(SwipeBase):
    pass


class SwipeInDB(SwipeBase):
    id: str = Field(default_factory=lambda: str(uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Swipe(SwipeInDB):
    model_config = {
        "json_schema_extra": {
            "example": {
                "id": "a1b2c3d4-5678-90ab-cdef-ghijklmnopqr",
                "user_id": "f0e4f84a-5134-4c44-b9c9-e2c3e4b6a16b",
                "target_id": "e5d4c3b2-a109-8765-4321-0fedcba987654",
                "is_like": True,
                "created_at": "2023-05-01T12:00:00Z"
            }
        }
    } 