import pytest
import pytest_asyncio
from pymongo.errors import ConnectionFailure
from app.core.database import mongodb
from app.core.config import settings

pytestmark = pytest.mark.asyncio

# Skip tests if MongoDB is not available
try:
    import asyncio
    from motor.motor_asyncio import AsyncIOMotorClient
    client = AsyncIOMotorClient(settings.MONGODB_URI, serverSelectionTimeoutMS=1000)
    asyncio.get_event_loop().run_until_complete(client.admin.command('ping'))
except (ConnectionFailure, Exception):
    pytest.skip("MongoDB not available", allow_module_level=True)


async def test_database_connection(test_db):
    """Test database connection."""
    # Verify test database is working
    await test_db.command("ping")
    
    # Check if we can access a collection
    users = test_db.users
    assert users is not None
    
    # Test collection name
    collections = await test_db.list_collection_names()
    assert len(collections) >= 0  # Empty at start, but valid connection


async def test_database_indexes(test_db):
    """Test database indexes are created."""
    # Get indexes for users collection
    user_indexes = await test_db.users.index_information()
    assert "email_1" in user_indexes
    
    # Get indexes for profiles collection
    profile_indexes = await test_db.profiles.index_information()
    assert "user_id_1" in profile_indexes
    assert "location_2dsphere" in profile_indexes
    
    # Get indexes for matches collection
    match_indexes = await test_db.matches.index_information()
    assert "users_1" in match_indexes
    
    # Get indexes for messages collection
    message_indexes = await test_db.messages.index_information()
    assert "match_id_1" in message_indexes
    assert "match_id_1_sent_at_-1" in message_indexes 