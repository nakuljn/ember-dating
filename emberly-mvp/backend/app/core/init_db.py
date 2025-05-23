import logging
from .database import mongodb

logger = logging.getLogger(__name__)


async def create_indexes():
    """Create MongoDB indexes."""
    db = mongodb.get_db()
    if db is None:
        logger.error("Cannot create indexes: Database connection not established")
        return
    
    try:
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
    except Exception as e:
        logger.error(f"Error creating database indexes: {e}")


async def init_db():
    """Initialize database with required collections and indexes."""
    db = mongodb.db
    if db is None:
        logger.error("Cannot initialize database: Database connection not established")
        print("Cannot initialize database: Database connection not established")
        return
    
    try:
        # Create collections if they don't exist
        collections = ["users", "profiles", "swipes", "matches", "chats"]
        existing_collections = await db.list_collection_names()
        
        for collection in collections:
            if collection not in existing_collections:
                await db.create_collection(collection)
                print(f"Created collection: {collection}")
        
        # Create indexes
        await db.users.create_index("email", unique=True)
        await db.profiles.create_index("user_id", unique=True)
        await db.swipes.create_index([("user_id", 1), ("target_id", 1)], unique=True)
        
        print("Database initialized successfully!")
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
        print(f"Error initializing database: {e}") 