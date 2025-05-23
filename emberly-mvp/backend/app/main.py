from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .core.config import settings
from .core.firebase_admin import initialize_firebase_admin
from .api.routes import api_router
from contextlib import asynccontextmanager
import sys

from app.core.database import mongodb
from app.core.init_db import init_db
from app.core.postgres import init_postgres

# Import routers here when created
# from app.api.routes import auth, profiles, swipes, likes, matches, chat

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting Emberly API...")
    
    # Initialize PostgreSQL (for structured data)
    postgres_ok = await init_postgres()
    if not postgres_ok:
        print("WARNING: PostgreSQL initialization failed")
    
    # Initialize MongoDB (for chat data)
    mongo_db = await mongodb.connect_to_database()
    if mongo_db is not None:
        try:
            await init_db()
        except Exception as e:
            print(f"Error initializing MongoDB: {e}")
    else:
        print("WARNING: MongoDB initialization failed")
    
    # Initialize Firebase
    try:
        initialize_firebase_admin()
    except Exception as e:
        print(f"Error initializing Firebase Admin SDK: {e}")
    
    print("Emberly API startup complete!")
    yield
    
    # Shutdown
    await mongodb.close_database_connection()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for Emberly Dating App",
    version="0.1.0",
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    lifespan=lifespan
)

# Configure CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include routers
# app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
# app.include_router(profiles.router, prefix="/profile", tags=["Profiles"])
# app.include_router(swipes.router, prefix="/swipe", tags=["Swipes"])
# app.include_router(likes.router, prefix="/likes", tags=["Likes"])
# app.include_router(matches.router, prefix="/matches", tags=["Matches"])
# app.include_router(chat.router, prefix="/chat", tags=["Chat"])

app.include_router(api_router, prefix=settings.API_V1_PREFIX)

@app.get("/", tags=["Root"])
async def root():
    """Health check endpoint."""
    return JSONResponse(
        content={
            "status": "ok",
            "message": "Welcome to Emberly API!",
            "version": "0.1.0",
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 