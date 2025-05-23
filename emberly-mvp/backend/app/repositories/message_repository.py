from typing import Optional, List, Dict, Any
from datetime import datetime
from app.core.database import mongodb
from app.models.message import Message, MessageCreate, MessageInDB


class MessageRepository:
    """Repository for message operations using MongoDB."""
    
    def __init__(self):
        self.collection_name = "messages"
        self.db = mongodb.get_db()
        self.collection = self.db[self.collection_name] if self.db else None
    
    async def get(self, id: str) -> Optional[Message]:
        """Get a message by ID."""
        if not self.collection:
            return None
        
        doc = await self.collection.find_one({"id": id})
        if doc:
            return Message(**doc)
        return None
    
    async def create(self, message_in: MessageCreate) -> Message:
        """Create a new message."""
        if not self.collection:
            raise Exception("Database not connected")
        
        message = MessageInDB(**message_in.model_dump())
        message_dict = message.model_dump()
        
        await self.collection.insert_one(message_dict)
        return Message(**message_dict)
    
    async def get_messages_for_match(
        self, 
        match_id: str, 
        skip: int = 0, 
        limit: int = 50
    ) -> List[Message]:
        """Get messages for a match."""
        if not self.collection:
            return []
        
        cursor = self.collection.find({
            "match_id": match_id,
            "is_deleted": False
        }).sort("sent_at", -1).skip(skip).limit(limit)
        
        # Return in chronological order
        messages = [Message(**doc) async for doc in cursor]
        return list(reversed(messages))
    
    async def mark_as_delivered(self, message_id: str) -> Optional[Message]:
        """Mark a message as delivered."""
        if not self.collection:
            return None
        
        result = await self.collection.find_one_and_update(
            {"id": message_id},
            {"$set": {"delivered_at": datetime.utcnow()}},
            return_document=True
        )
        
        if result:
            return Message(**result)
        return None
    
    async def mark_as_read(self, message_id: str) -> Optional[Message]:
        """Mark a message as read."""
        if not self.collection:
            return None
        
        result = await self.collection.find_one_and_update(
            {"id": message_id},
            {"$set": {"read_at": datetime.utcnow()}},
            return_document=True
        )
        
        if result:
            return Message(**result)
        return None
    
    async def mark_as_deleted(self, message_id: str) -> Optional[Message]:
        """Mark a message as deleted."""
        if not self.collection:
            return None
        
        result = await self.collection.find_one_and_update(
            {"id": message_id},
            {"$set": {"is_deleted": True}},
            return_document=True
        )
        
        if result:
            return Message(**result)
        return None


# Create a singleton instance
message_repository = MessageRepository() 