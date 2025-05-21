from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from uuid import uuid4


class MessageBase(BaseModel):
    match_id: str
    sender_id: str
    content: str


class MessageCreate(MessageBase):
    pass


class MessageInDB(MessageBase):
    id: str = Field(default_factory=lambda: str(uuid4()))
    sent_at: datetime = Field(default_factory=datetime.utcnow)
    read_at: Optional[datetime] = None


class Message(MessageInDB):
    class Config:
        schema_extra = {
            "example": {
                "id": "a1b2c3d4-5678-90ab-cdef-ghijklmnopqr",
                "match_id": "e5d4c3b2-a109-8765-4321-0fedcba987654",
                "sender_id": "f0e4f84a-5134-4c44-b9c9-e2c3e4b6a16b",
                "content": "Hey, how's it going?",
                "sent_at": "2023-05-01T12:00:00Z",
                "read_at": "2023-05-01T12:01:00Z"
            }
        } 