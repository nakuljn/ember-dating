from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.database import mongodb
from app.core.init_db import init_db

# Import routers here when created
# from app.api.routes import auth, profiles, swipes, likes, matches, chat

app = FastAPI(
    title="Emberly API",
    description="Backend API for Emberly Dating App",
    version="0.1.0",
)

@app.on_event("startup")
async def startup_db_client():
    await mongodb.connect_to_database()
    await init_db()

@app.on_event("shutdown")
async def shutdown_db_client():
    await mongodb.close_database_connection()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; restrict in production
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