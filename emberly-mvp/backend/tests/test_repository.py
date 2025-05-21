import pytest
import pytest_asyncio
from pymongo.errors import ConnectionFailure
from app.core.repository import BaseRepository
from app.models.user import User, UserInDB
from app.core.config import settings
from uuid import uuid4

pytestmark = pytest.mark.asyncio

# Skip tests if MongoDB is not available
try:
    import asyncio
    from motor.motor_asyncio import AsyncIOMotorClient
    client = AsyncIOMotorClient(settings.MONGODB_URI, serverSelectionTimeoutMS=1000)
    asyncio.get_event_loop().run_until_complete(client.admin.command('ping'))
except (ConnectionFailure, Exception):
    pytest.skip("MongoDB not available", allow_module_level=True)


class UserRepository(BaseRepository):
    def __init__(self, test_db):
        self.db = test_db
        self.collection = test_db.users
        self.model_class = UserInDB


@pytest.fixture
async def user_repo(test_db):
    """Create a user repository instance."""
    return UserRepository(test_db)


@pytest.fixture
async def test_user():
    """Create a test user."""
    return UserInDB(
        id=str(uuid4()),
        email="test@example.com",
        auth_provider="google"
    )


async def test_create_user(user_repo, test_user, clean_db):
    """Test creating a user in the repository."""
    # Create user
    created_user = await user_repo.create(test_user)
    
    # Verify user was created
    assert created_user.id == test_user.id
    assert created_user.email == test_user.email
    
    # Verify user exists in database
    user_from_db = await user_repo.get(test_user.id)
    assert user_from_db is not None
    assert user_from_db.id == test_user.id


async def test_get_user(user_repo, test_user, clean_db):
    """Test retrieving a user from the repository."""
    # Create user
    await user_repo.create(test_user)
    
    # Get user by ID
    user = await user_repo.get(test_user.id)
    assert user is not None
    assert user.id == test_user.id
    assert user.email == test_user.email
    
    # Get user by field
    user = await user_repo.get_by_field("email", test_user.email)
    assert user is not None
    assert user.id == test_user.id


async def test_update_user(user_repo, test_user, clean_db):
    """Test updating a user in the repository."""
    # Create user
    await user_repo.create(test_user)
    
    # Update user
    updated_user = await user_repo.update(test_user.id, {"phone": "+1234567890"})
    assert updated_user is not None
    assert updated_user.phone == "+1234567890"
    
    # Verify user was updated in database
    user_from_db = await user_repo.get(test_user.id)
    assert user_from_db.phone == "+1234567890"


async def test_delete_user(user_repo, test_user, clean_db):
    """Test deleting a user from the repository."""
    # Create user
    await user_repo.create(test_user)
    
    # Delete user
    result = await user_repo.delete(test_user.id)
    assert result is True
    
    # Verify user was deleted
    user_from_db = await user_repo.get(test_user.id)
    assert user_from_db is None


async def test_list_users(user_repo, test_user, clean_db):
    """Test listing users from the repository."""
    # Create multiple users
    await user_repo.create(test_user)
    await user_repo.create(
        UserInDB(
            id=str(uuid4()),
            email="user2@example.com",
            auth_provider="apple"
        )
    )
    
    # List all users
    users = await user_repo.list()
    assert len(users) == 2
    
    # List users with query
    apple_users = await user_repo.list({"auth_provider": "apple"})
    assert len(apple_users) == 1
    assert apple_users[0].auth_provider == "apple" 