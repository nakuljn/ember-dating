from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.models.sql.user import User
from .sql_repository import SQLRepository


class UserRepository(SQLRepository[User]):
    def __init__(self):
        super().__init__(User)
    
    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[User]:
        """Get a user by email."""
        return await self.get_by_field(db, "email", email)
    
    async def get_by_firebase_uid(self, db: AsyncSession, firebase_uid: str) -> Optional[User]:
        """Get a user by Firebase UID."""
        return await self.get_by_field(db, "firebase_uid", firebase_uid)


# Create a singleton instance
user_repository = UserRepository() 