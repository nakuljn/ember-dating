from typing import Optional, List, Dict, Any
from app.core.database import mongodb
from app.models.swipe import Swipe, SwipeCreate, SwipeInDB


class SwipeRepository:
    """Repository for swipe operations using MongoDB."""
    
    def __init__(self):
        self.collection_name = "swipes"
        self.db = mongodb.get_db()
        self.collection = self.db[self.collection_name] if self.db else None
    
    async def get(self, id: str) -> Optional[Swipe]:
        """Get a swipe by ID."""
        if not self.collection:
            return None
        
        doc = await self.collection.find_one({"id": id})
        if doc:
            return Swipe(**doc)
        return None
    
    async def get_by_user_and_target(self, user_id: str, target_id: str) -> Optional[Swipe]:
        """Get a swipe by user ID and target ID."""
        if not self.collection:
            return None
        
        doc = await self.collection.find_one({
            "user_id": user_id,
            "target_id": target_id
        })
        if doc:
            return Swipe(**doc)
        return None
    
    async def create(self, swipe_in: SwipeCreate) -> Swipe:
        """Create a new swipe."""
        if not self.collection:
            raise Exception("Database not connected")
        
        swipe = SwipeInDB(**swipe_in.model_dump())
        swipe_dict = swipe.model_dump()
        
        await self.collection.insert_one(swipe_dict)
        return Swipe(**swipe_dict)
    
    async def get_mutual_likes(self, user_id: str, skip: int = 0, limit: int = 100) -> List[str]:
        """Get list of user IDs who have mutual likes with the given user."""
        if not self.collection:
            return []
        
        # Find users who the current user has liked
        user_likes_cursor = self.collection.find({
            "user_id": user_id,
            "is_like": True
        }, {"target_id": 1}).skip(skip).limit(limit)
        
        user_likes = [doc["target_id"] async for doc in user_likes_cursor]
        
        if not user_likes:
            return []
        
        # Find users who have liked the current user back
        mutual_likes_cursor = self.collection.find({
            "user_id": {"$in": user_likes},
            "target_id": user_id,
            "is_like": True
        }, {"user_id": 1})
        
        return [doc["user_id"] async for doc in mutual_likes_cursor]


# Create a singleton instance
swipe_repository = SwipeRepository() 