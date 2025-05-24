from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, field_validator
from uuid import uuid4


class MessageBase(BaseModel):
    match_id: str
    sender_id: str
    content: str
    content_type: str = Field(default="text", description="Type of message content (text, image, etc.)")
    metadata: Optional[Dict[str, Any]] = None


class MessageCreate(MessageBase):
    pass


class MessageInDB(MessageBase):
    id: str = Field(default_factory=lambda: str(uuid4()))
    sent_at: datetime = Field(default_factory=datetime.utcnow)
    delivered_at: Optional[datetime] = None
    read_at: Optional[datetime] = None
    is_deleted: bool = False


class Message(MessageInDB):
    model_config = {
        "json_schema_extra": {
            "example": {
                "id": "a1b2c3d4-5678-90ab-cdef-ghijklmnopqr",
                "match_id": "f0e4f84a-5134-4c44-b9c9-e2c3e4b6a16b",
                "sender_id": "e5d4c3b2-a109-8765-4321-0fedcba987654",
                "content": "Hello, how are you?",
                "content_type": "text",
                "metadata": None,
                "sent_at": "2023-05-01T12:00:00Z",
                "delivered_at": "2023-05-01T12:00:05Z",
                "read_at": "2023-05-01T12:01:00Z",
                "is_deleted": False
            }
        }
    } 