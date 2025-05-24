import pytest
from fastapi import HTTPException
from unittest.mock import AsyncMock, patch
from app.core.dependencies import get_current_user, optional_current_user
from app.core.errors import AuthenticationError


@pytest.fixture
def mock_verify_token():
    """Mock the verify_token function."""
    with patch("app.core.dependencies.verify_token") as mock:
        yield mock


@pytest.mark.asyncio
async def test_get_current_user_valid_token(mock_verify_token):
    """Test getting current user with valid token."""
    # Setup mock
    mock_verify_token.return_value = {"sub": "user123"}
    
    # Call the function
    user_id = await get_current_user("valid_token")
    
    # Assert
    mock_verify_token.assert_called_once_with("valid_token")
    assert user_id == "user123"


@pytest.mark.asyncio
async def test_get_current_user_invalid_token(mock_verify_token):
    """Test getting current user with invalid token."""
    # Setup mock
    mock_verify_token.return_value = None
    
    # Call the function and expect exception
    with pytest.raises(AuthenticationError) as exc_info:
        await get_current_user("invalid_token")
    
    # Assert
    mock_verify_token.assert_called_once_with("invalid_token")
    assert "Invalid or expired token" in str(exc_info.value.detail)


@pytest.mark.asyncio
async def test_get_current_user_missing_sub_claim(mock_verify_token):
    """Test getting current user with token missing sub claim."""
    # Setup mock
    mock_verify_token.return_value = {"email": "user@example.com"}  # No 'sub' claim
    
    # Call the function and expect exception
    with pytest.raises(AuthenticationError) as exc_info:
        await get_current_user("invalid_token")
    
    # Assert
    mock_verify_token.assert_called_once_with("invalid_token")
    assert "Invalid token payload" in str(exc_info.value.detail)


@pytest.mark.asyncio
async def test_optional_current_user_valid_token(mock_verify_token):
    """Test optional_current_user with valid token."""
    # Setup mock
    mock_verify_token.return_value = {"sub": "user123"}
    
    # Call the function
    user_id = await optional_current_user("Bearer valid_token")
    
    # Assert
    mock_verify_token.assert_called_once_with("valid_token")
    assert user_id == "user123"


@pytest.mark.asyncio
async def test_optional_current_user_invalid_token(mock_verify_token):
    """Test optional_current_user with invalid token."""
    # Setup mock
    mock_verify_token.return_value = None
    
    # Call the function
    user_id = await optional_current_user("Bearer invalid_token")
    
    # Assert
    mock_verify_token.assert_called_once_with("invalid_token")
    assert user_id is None


@pytest.mark.asyncio
async def test_optional_current_user_no_token():
    """Test optional_current_user with no token."""
    # Call the function
    user_id = await optional_current_user(None)
    
    # Assert
    assert user_id is None


@pytest.mark.asyncio
async def test_optional_current_user_not_bearer_token():
    """Test optional_current_user with non-Bearer token."""
    # Call the function
    user_id = await optional_current_user("Basic invalid_token")
    
    # Assert
    assert user_id is None 