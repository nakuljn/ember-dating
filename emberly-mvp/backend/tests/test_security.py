import pytest
from datetime import timedelta
from jose import jwt
from app.core.security import create_access_token, verify_token
from app.core.config import settings


def test_create_access_token():
    """Test creating a JWT access token."""
    # Create token with user data
    user_data = {"sub": "user123", "email": "user@example.com"}
    token = create_access_token(user_data)
    
    # Verify token
    payload = jwt.decode(
        token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
    )
    
    # Verify payload contains user data
    assert payload["sub"] == user_data["sub"]
    assert payload["email"] == user_data["email"]
    assert "exp" in payload


def test_create_access_token_with_expiration():
    """Test creating a JWT access token with custom expiration."""
    # Create token with user data and custom expiration
    user_data = {"sub": "user123"}
    expires = timedelta(minutes=5)
    token = create_access_token(user_data, expires_delta=expires)
    
    # Verify token
    payload = jwt.decode(
        token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
    )
    
    # Verify payload contains user data and expiration
    assert payload["sub"] == user_data["sub"]
    assert "exp" in payload


def test_verify_token():
    """Test verifying a JWT token."""
    # Create token
    user_data = {"sub": "user123", "email": "user@example.com"}
    token = create_access_token(user_data)
    
    # Verify token
    payload = verify_token(token)
    
    # Verify payload contains user data
    assert payload is not None
    assert payload["sub"] == user_data["sub"]
    assert payload["email"] == user_data["email"]


def test_verify_invalid_token():
    """Test verifying an invalid JWT token."""
    # Invalid token
    token = "invalid.token.here"
    
    # Verify token
    payload = verify_token(token)
    
    # Verify payload is None
    assert payload is None 