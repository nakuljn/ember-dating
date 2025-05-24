from typing import Generic, TypeVar, Type, Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from sqlalchemy.sql import Select
from uuid import UUID

from app.core.postgres import Base

ModelType = TypeVar("ModelType", bound=Base)

class SQLRepository(Generic[ModelType]):
    """Base repository for SQL models."""
    
    def __init__(self, model_class: Type[ModelType]):
        self.model_class = model_class
    
    async def get(self, db: AsyncSession, id: UUID) -> Optional[ModelType]:
        """Get a record by ID."""
        query = select(self.model_class).where(self.model_class.id == id)
        result = await db.execute(query)
        return result.scalars().first()
    
    async def get_by_field(self, db: AsyncSession, field: str, value: Any) -> Optional[ModelType]:
        """Get a record by a specific field value."""
        query = select(self.model_class).where(getattr(self.model_class, field) == value)
        result = await db.execute(query)
        return result.scalars().first()
    
    async def list(
        self, 
        db: AsyncSession, 
        query: Select = None,
        skip: int = 0, 
        limit: int = 100
    ) -> List[ModelType]:
        """Get multiple records with optional filtering."""
        if query is None:
            query = select(self.model_class)
        
        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
    
    async def create(self, db: AsyncSession, obj_in: Dict[str, Any]) -> ModelType:
        """Create a new record."""
        db_obj = self.model_class(**obj_in)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj
    
    async def update(
        self, 
        db: AsyncSession, 
        id: UUID, 
        obj_in: Dict[str, Any]
    ) -> Optional[ModelType]:
        """Update a record."""
        query = update(self.model_class).where(self.model_class.id == id).values(**obj_in).returning(self.model_class)
        result = await db.execute(query)
        await db.commit()
        return result.scalars().first()
    
    async def delete(self, db: AsyncSession, id: UUID) -> bool:
        """Delete a record."""
        query = delete(self.model_class).where(self.model_class.id == id)
        result = await db.execute(query)
        await db.commit()
        return result.rowcount > 0 