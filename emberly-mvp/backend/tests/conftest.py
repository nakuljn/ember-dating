import pytest
import asyncio
from typing import Generator, AsyncGenerator
from fastapi.testclient import TestClient
from motor.motor_asyncio import AsyncIOMotorClient
from app.main import app
from app.core.database import mongodb
from app.core.config import settings

# Override the MongoDB URI for tests
settings.MONGODB_URI = "mongodb://localhost:27017/emberly_test"
settings.MONGODB_DB_NAME = "emberly_test"


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for each test case."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
def test_client() -> Generator:
    """Create a FastAPI TestClient instance."""
    with TestClient(app) as client:
        yield client


@pytest.fixture(scope="session")
async def test_db() -> AsyncGenerator:
    """Create a test database and collections."""
    # Connect to the test database
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    
    # Store original db instance and replace with test db
    original_db = mongodb.db
    mongodb.db = db
    
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.profiles.create_index("user_id", unique=True)
    await db.profiles.create_index([("location", "2dsphere")])
    await db.matches.create_index("users")
    await db.messages.create_index("match_id")
    await db.messages.create_index([("match_id", 1), ("sent_at", -1)])
    
    yield db
    
    # Drop test database after tests
    await client.drop_database(settings.MONGODB_DB_NAME)
    
    # Restore original db
    mongodb.db = original_db
    client.close()


@pytest.fixture
async def clean_db(test_db):
    """Clean all collections after each test."""
    yield
    collections = await test_db.list_collection_names()
    for collection in collections:
        await test_db[collection].delete_many({}) 