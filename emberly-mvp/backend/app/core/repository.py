from typing import Generic, TypeVar, Type, Optional, List, Dict, Any
from pydantic import BaseModel
from app.core.database import mongodb

ModelType = TypeVar("ModelType", bound=BaseModel)

class BaseRepository:
    """Base class for all repositories with common CRUD operations."""
    
    def __init__(self, collection_name: str, model_class: Type[ModelType]):
        self.collection_name = collection_name
        self.model_class = model_class
        self.db = mongodb.get_db()
        self.collection = self.db[collection_name]
    
    async def get(self, id: str) -> Optional[ModelType]:
        """Get a document by ID."""
        doc = await self.collection.find_one({"id": id})
        if doc:
            return self.model_class(**doc)
        return None
    
    async def get_by_field(self, field: str, value: Any) -> Optional[ModelType]:
        """Get a document by a specific field value."""
        doc = await self.collection.find_one({field: value})
        if doc:
            return self.model_class(**doc)
        return None
    
    async def list(self, query: Dict = None, skip: int = 0, limit: int = 100) -> List[ModelType]:
        """Get multiple documents with optional filtering."""
        query = query or {}
        cursor = self.collection.find(query).skip(skip).limit(limit)
        docs = await cursor.to_list(length=limit)
        return [self.model_class(**doc) for doc in docs]
    
    async def create(self, obj_in: BaseModel) -> ModelType:
        """Create a new document."""
        obj_dict = obj_in.dict()
        await self.collection.insert_one(obj_dict)
        return self.model_class(**obj_dict)
    
    async def update(self, id: str, obj_in: Dict) -> Optional[ModelType]:
        """Update a document."""
        await self.collection.update_one({"id": id}, {"$set": obj_in})
        return await self.get(id)
    
    async def delete(self, id: str) -> bool:
        """Delete a document."""
        result = await self.collection.delete_one({"id": id})
        return result.deleted_count > 0 