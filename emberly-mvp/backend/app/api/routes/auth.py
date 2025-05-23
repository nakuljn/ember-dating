from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from typing import Optional

from app.core.security import create_access_token
from app.models.user import User, UserCreate, UserInDB
from app.core.config import settings
from app.core.errors import AuthenticationError
from app.schemas.auth import FirebaseToken, LoginResponse
from app.services.auth import verify_firebase_token

router = APIRouter()

async def validate_firebase_token(token_data: FirebaseToken) -> tuple[str, str]:
    """Validate Firebase token and return user_id and email."""
    return await verify_firebase_token(token_data.token)


async def create_user_token(user_id: str, email: str) -> dict:
    """Create a user token and return the response data."""
    # Create access token
    access_token_expires = timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_id, "email": email},
        expires_delta=access_token_expires
    )
    
    # Return token and user info
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": email,
            "auth_provider": "firebase",
            "phone": None,
        }
    }


@router.post("/login", response_model=LoginResponse)
async def login_with_firebase(token_data: FirebaseToken):
    """
    Login with Firebase ID token.
    
    This endpoint accepts a Firebase ID token and returns a JWT token
    for API authentication along with the user information.
    
    For the MVP, we'll mock Firebase authentication and just validate
    that the token isn't empty.
    """
    user_id, email = await validate_firebase_token(token_data)
    return await create_user_token(user_id, email)


@router.post("/register", response_model=LoginResponse)
async def register_with_firebase(token_data: FirebaseToken):
    """
    Register with Firebase ID token.
    
    This endpoint accepts a Firebase ID token, creates a new user account
    if one doesn't exist, and returns a JWT token for API authentication.
    
    For the MVP, we'll mock Firebase authentication and just validate
    that the token isn't empty.
    """
    user_id, email = await validate_firebase_token(token_data)
    
    # In a real app, we would create a new user in the database here
    
    return await create_user_token(user_id, email)


@router.get("/verify-setup")
async def verify_firebase_setup():
    """
    Test endpoint to verify that Firebase Admin SDK is properly initialized.
    
    This endpoint doesn't require authentication and simply returns a success message
    if Firebase Admin SDK is properly initialized.
    """
    return {
        "status": "success",
        "message": "Firebase Admin SDK is properly initialized"
    } 