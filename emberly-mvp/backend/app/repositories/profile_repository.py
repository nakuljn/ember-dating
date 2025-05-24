from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List
from uuid import UUID

from app.models.sql.profile import Profile
from app.models.sql.user import User
from .sql_repository import SQLRepository


class ProfileRepository(SQLRepository[Profile]):
    def __init__(self):
        super().__init__(Profile)
    
    async def get_by_user_id(self, db: AsyncSession, user_id: UUID) -> Optional[Profile]:
        """Get a profile by user ID."""
        return await self.get_by_field(db, "user_id", user_id)
    
    async def get_profiles_for_discovery(
        self, 
        db: AsyncSession, 
        gender_preferences: List[str], 
        skip: int = 0, 
        limit: int = 10
    ) -> List[Profile]:
        """Get profiles for discovery based on gender preferences."""
        query = select(Profile).where(Profile.gender.in_(gender_preferences))
        return await self.list(db, query, skip, limit)


# Create a singleton instance
profile_repository = ProfileRepository() 