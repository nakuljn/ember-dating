import pytest
import time
from datetime import timedelta, datetime
from jose import jwt
from app.core.security import create_access_token, verify_token
from app.core.config import settings


def test_expired_token():
    """Test that an expired token is properly invalidated."""
    # Create token with a negative expiration (already expired)
    user_data = {"sub": "user123", "email": "user@example.com"}
    
    # Create token manually with past expiration
    from jose import jwt
    from datetime import datetime, timedelta
    
    # Token that expired 1 hour ago
    exp = datetime.utcnow() - timedelta(hours=1)
    to_encode = user_data.copy()
    to_encode.update({"exp": exp})
    
    token = jwt.encode(
        to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM
    )
    
    # Verify token should be invalid
    payload = verify_token(token)
    assert payload is None


def test_tampered_token():
    """Test that a tampered token is properly invalidated."""
    # Create valid token
    user_data = {"sub": "user123", "email": "user@example.com"}
    token = create_access_token(user_data)
    
    # Tamper with the token (change the last character)
    tampered_token = token[:-1] + ("A" if token[-1] != "A" else "B")
    
    # Verify tampered token should be invalid
    payload = verify_token(tampered_token)
    assert payload is None


def test_token_wrong_algorithm():
    """Test that a token signed with wrong algorithm is invalid."""
    # Create token data
    user_data = {"sub": "user123", "email": "user@example.com"}
    exp = datetime.utcnow() + timedelta(minutes=15)
    to_encode = user_data.copy()
    to_encode.update({"exp": exp})
    
    # Sign with different algorithm (HS512 instead of HS256)
    wrong_algo_token = jwt.encode(
        to_encode, settings.JWT_SECRET_KEY, algorithm="HS512"
    )
    
    # Our implementation only accepts the configured algorithm
    payload = verify_token(wrong_algo_token)
    assert payload is None  # Should be None as algorithm is wrong

    # Verify directly with correct algorithm to show it's the algorithm causing the issue
    direct_decode = jwt.decode(
        wrong_algo_token, 
        settings.JWT_SECRET_KEY, 
        algorithms=["HS512"],  # Accept HS512
        options={"verify_exp": True}
    )
    assert direct_decode is not None
    assert direct_decode["sub"] == user_data["sub"]


def test_token_without_expiration():
    """Test handling a token without expiration claim."""
    # Create token data without expiration
    user_data = {"sub": "user123", "email": "user@example.com"}
    
    # Create token manually without exp claim
    token = jwt.encode(
        user_data, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM
    )
    
    # Our verify_token should still validate this token
    # since we don't explicitly check for exp claim
    payload = verify_token(token)
    assert payload is not None
    assert payload["sub"] == user_data["sub"]


def test_token_with_extra_claims():
    """Test token with additional non-standard claims."""
    # Create token with extra claims
    user_data = {
        "sub": "user123",
        "email": "user@example.com",
        "role": "admin",
        "permissions": ["read", "write"],
        "custom_data": {"key": "value"}
    }
    token = create_access_token(user_data)
    
    # Verify token with extra claims
    payload = verify_token(token)
    assert payload is not None
    assert payload["sub"] == user_data["sub"]
    assert payload["role"] == user_data["role"]
    assert payload["permissions"] == user_data["permissions"]
    assert payload["custom_data"] == user_data["custom_data"] 