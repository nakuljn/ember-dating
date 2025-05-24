from typing import Optional, List, Dict, Any
from datetime import datetime
from app.core.database import mongodb
from app.models.match import Match, MatchCreate, MatchInDB


class MatchRepository:
    """Repository for match operations using MongoDB."""
    
    def __init__(self):
        self.collection_name = "matches"
        self.db = mongodb.get_db()
        self.collection = self.db[self.collection_name] if self.db else None
    
    async def get(self, id: str) -> Optional[Match]:
        """Get a match by ID."""
        if not self.collection:
            return None
        
        doc = await self.collection.find_one({"id": id})
        if doc:
            return Match(**doc)
        return None
    
    async def create(self, match_in: MatchCreate) -> Match:
        """Create a new match."""
        if not self.collection:
            raise Exception("Database not connected")
        
        match = MatchInDB(**match_in.model_dump())
        match_dict = match.model_dump()
        
        await self.collection.insert_one(match_dict)
        return Match(**match_dict)
    
    async def get_matches_for_user(self, user_id: str, skip: int = 0, limit: int = 100) -> List[Match]:
        """Get all matches for a user."""
        if not self.collection:
            return []
        
        cursor = self.collection.find({
            "users": user_id
        }).sort("last_message_at", -1).skip(skip).limit(limit)
        
        return [Match(**doc) async for doc in cursor]
    
    async def update_last_message_time(self, match_id: str, timestamp: datetime = None) -> Optional[Match]:
        """Update the last message time for a match."""
        if not self.collection:
            return None
        
        if timestamp is None:
            timestamp = datetime.utcnow()
        
        result = await self.collection.find_one_and_update(
            {"id": match_id},
            {"$set": {"last_message_at": timestamp}},
            return_document=True
        )
        
        if result:
            return Match(**result)
        return None


# Create a singleton instance
match_repository = MatchRepository() 