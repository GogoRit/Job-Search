from motor.motor_asyncio import AsyncIOMotorClient
from motor.motor_asyncio import AsyncIOMotorDatabase
import os
from dotenv import load_dotenv
import logging

load_dotenv()

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    database: AsyncIOMotorDatabase = None

# Create database instance
database = Database()

async def get_database() -> AsyncIOMotorDatabase:
    return database.database

async def connect_to_mongo():
    """Create database connection"""
    try:
        # Get MongoDB URL from environment or use default
        mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
        database_name = os.getenv("DATABASE_NAME", "job_search_assistant")
        
        logger.info(f"Connecting to MongoDB at {mongodb_url}")
        
        database.client = AsyncIOMotorClient(
            mongodb_url,
            maxPoolSize=10,
            minPoolSize=10,
        )
        
        database.database = database.client[database_name]
        
        # Test the connection
        await database.database.command("ping")
        logger.info("Successfully connected to MongoDB")
        
        # Create indexes
        await create_indexes()
        
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Close database connection"""
    if database.client:
        database.client.close()
        logger.info("Disconnected from MongoDB")

async def create_indexes():
    """Create database indexes for better performance"""
    try:
        # Users collection indexes
        await database.database.users.create_index("created_at")
        
        # Resumes collection indexes
        await database.database.resumes.create_index("user_id")
        await database.database.resumes.create_index("created_at")
        
        # Jobs collection indexes
        await database.database.jobs.create_index("user_id")
        await database.database.jobs.create_index("stage")
        await database.database.jobs.create_index("company")
        await database.database.jobs.create_index("created_at")
        
        # Messages collection indexes
        await database.database.messages.create_index("job_id")
        await database.database.messages.create_index("user_id")
        await database.database.messages.create_index("created_at")
        
        logger.info("Database indexes created successfully")
        
    except Exception as e:
        logger.warning(f"Failed to create some indexes: {e}")

# Connection methods for lifespan events
async def connect():
    await connect_to_mongo()

async def disconnect():
    await close_mongo_connection()
