from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from .config import settings
import logging

logger = logging.getLogger(__name__)

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

    async def connect_to_database(self):
        """Connect to MongoDB database."""
        try:
            print("Connecting to MongoDB...")
            # Set a shorter server selection timeout for faster feedback
            self.client = AsyncIOMotorClient(
                settings.MONGODB_URI,
                serverSelectionTimeoutMS=5000
            )
            self.db = self.client[settings.MONGODB_DB_NAME]
            
            # Verify connection is working
            await self.client.admin.command('ping')
            logger.info(f"Connected to MongoDB at {settings.MONGODB_URI}")
            
            print("Connected to MongoDB!")
            return self.db
        except (ConnectionFailure, ServerSelectionTimeoutError) as e:
            logger.error(f"Could not connect to MongoDB: {e}")
            print(f"ERROR: Failed to connect to MongoDB: {e}")
            print("Please check your MongoDB connection string and ensure MongoDB is running.")
            if "mongodb+srv" in settings.MONGODB_URI:
                print("For MongoDB Atlas, ensure your IP address is whitelisted in the Atlas console.")
            return None
        except Exception as e:
            logger.error(f"Unexpected error connecting to MongoDB: {e}")
            print(f"ERROR: Unexpected error connecting to MongoDB: {e}")
            return None
    
    async def close_database_connection(self):
        """Close database connection."""
        if self.client:
            print("Closing MongoDB connection...")
            self.client.close()
            logger.info("Closed connection to MongoDB")
            print("MongoDB connection closed!")
    
    def get_db(self):
        """Return database instance."""
        if not self.db:
            print("WARNING: Attempting to use database before connection is established")
        return self.db

mongodb = MongoDB() 