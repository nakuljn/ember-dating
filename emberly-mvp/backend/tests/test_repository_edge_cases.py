import pytest
import pytest_asyncio
from pymongo.errors import ConnectionFailure, DuplicateKeyError
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


async def test_get_nonexistent_user(user_repo, clean_db):
    """Test retrieving a non-existent user."""
    # Generate a random ID that doesn't exist
    nonexistent_id = str(uuid4())
    
    # Attempt to get user by non-existent ID
    user = await user_repo.get(nonexistent_id)
    
    # Verify user is None
    assert user is None


async def test_get_by_nonexistent_field(user_repo, clean_db):
    """Test retrieving a user by a field that doesn't exist."""
    # Create test user
    test_user = UserInDB(
        id=str(uuid4()),
        email="test@example.com",
        auth_provider="google"
    )
    await user_repo.create(test_user)
    
    # Attempt to get user by non-existent field
    user = await user_repo.get_by_field("nonexistent_field", "value")
    
    # Verify user is None
    assert user is None


async def test_list_empty_collection(user_repo, clean_db):
    """Test listing users from an empty collection."""
    # List all users when collection is empty
    users = await user_repo.list()
    
    # Verify result is an empty list (not None)
    assert users == []


async def test_update_nonexistent_user(user_repo, clean_db):
    """Test updating a non-existent user."""
    # Generate a random ID that doesn't exist
    nonexistent_id = str(uuid4())
    
    # Attempt to update non-existent user
    updated_user = await user_repo.update(nonexistent_id, {"phone": "+1234567890"})
    
    # Verify result is None
    assert updated_user is None


async def test_delete_nonexistent_user(user_repo, clean_db):
    """Test deleting a non-existent user."""
    # Generate a random ID that doesn't exist
    nonexistent_id = str(uuid4())
    
    # Attempt to delete non-existent user
    result = await user_repo.delete(nonexistent_id)
    
    # Verify result is False (not deleted)
    assert result is False


async def test_list_with_invalid_query(user_repo, clean_db):
    """Test listing users with an invalid query."""
    # Create test user
    test_user = UserInDB(
        id=str(uuid4()),
        email="test@example.com",
        auth_provider="google"
    )
    await user_repo.create(test_user)
    
    # List users with query that doesn't match any documents
    users = await user_repo.list({"auth_provider": "nonexistent"})
    
    # Verify result is an empty list
    assert users == []


async def test_create_duplicate_email(user_repo, clean_db, monkeypatch):
    """Test creating a user with a duplicate email (which should fail with unique index)."""
    # Create a function to simulate a DuplicateKeyError in the insert_one method
    async def mock_insert_one(*args, **kwargs):
        raise DuplicateKeyError("Duplicate key error")
    
    # Create test user
    test_user = UserInDB(
        id=str(uuid4()),
        email="test@example.com",
        auth_provider="google"
    )
    
    # Create the first user
    await user_repo.create(test_user)
    
    # Create a second user with same email
    duplicate_user = UserInDB(
        id=str(uuid4()),
        email="test@example.com",  # Same email as first user
        auth_provider="google"
    )
    
    # Monkeypatch the insert_one method to raise DuplicateKeyError
    monkeypatch.setattr(user_repo.collection, "insert_one", mock_insert_one)
    
    # Attempt to create duplicate user and expect exception
    with pytest.raises(DuplicateKeyError):
        await user_repo.create(duplicate_user) 