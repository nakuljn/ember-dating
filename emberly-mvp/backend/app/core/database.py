from motor.motor_asyncio import AsyncIOMotorClient as MotorClient
from pymongo.errors import ConnectionFailure
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class Database:
    client = None
    db = None
    
    @classmethod
    async def connect_to_database(cls):
        """Connect to MongoDB database."""
        try:
            cls.client = MotorClient(settings.MONGODB_URI)
            cls.db = cls.client[settings.MONGODB_DB_NAME]
            
            # Verify connection is working
            await cls.client.admin.command('ping')
            logger.info(f"Connected to MongoDB at {settings.MONGODB_URI}")
            
            return cls.db
        except ConnectionFailure as e:
            logger.error(f"Could not connect to MongoDB: {e}")
            raise
    
    @classmethod
    async def close_database_connection(cls):
        """Close database connection."""
        if cls.client:
            cls.client.close()
            logger.info("Closed connection to MongoDB")
    
    @classmethod
    def get_db(cls):
        """Return database instance."""
        return cls.db

mongodb = Database() 