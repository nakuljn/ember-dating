from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.asyncio import async_sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from .config import settings
import logging

logger = logging.getLogger(__name__)

# Create SQLAlchemy engine and session
engine = create_async_engine(
    settings.POSTGRES_URI,
    echo=settings.ENVIRONMENT == "development",
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    expire_on_commit=False,
    class_=AsyncSession,
)

Base = declarative_base()

async def get_db():
    """Get a database session."""
    db = AsyncSessionLocal()
    try:
        yield db
    finally:
        await db.close()

async def init_postgres():
    """Initialize PostgreSQL database."""
    try:
        # Create all tables
        async with engine.begin() as conn:
            # Only create tables in development mode
            if settings.ENVIRONMENT == "development":
                await conn.run_sync(Base.metadata.create_all)
                logger.info("PostgreSQL tables created successfully")
        
        logger.info(f"Connected to PostgreSQL at {settings.POSTGRES_URI}")
        print("Connected to PostgreSQL!")
        return True
    except Exception as e:
        logger.error(f"Error initializing PostgreSQL: {e}")
        print(f"ERROR: Failed to initialize PostgreSQL: {e}")
        return False 