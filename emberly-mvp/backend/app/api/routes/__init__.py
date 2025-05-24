from fastapi import APIRouter
from .auth import router as auth_router

api_router = APIRouter()

# Include all route modules here
api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"]) 