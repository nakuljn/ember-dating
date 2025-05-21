import logging
from app.core.database import mongodb

logger = logging.getLogger(__name__)


async def create_indexes():
    """Create MongoDB indexes."""
    db = mongodb.get_db()
    
    # Create indexes for users collection
    await db.users.create_index("email", unique=True)
    
    # Create indexes for profiles collection
    await db.profiles.create_index("user_id", unique=True)
    await db.profiles.create_index([("location", "2dsphere")])
    
    # Create indexes for matches collection
    await db.matches.create_index("users")
    
    # Create indexes for messages collection
    await db.messages.create_index("match_id")
    await db.messages.create_index([("match_id", 1), ("sent_at", -1)])
    
    logger.info("Database indexes created successfully")


async def init_db():
    """Initialize the database."""
    await create_indexes()
    logger.info("Database initialized successfully") 