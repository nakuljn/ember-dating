from fastapi import Depends, Header
from fastapi.security import OAuth2PasswordBearer
from typing import Optional
from app.core.security import verify_token
from app.core.errors import AuthenticationError

# OAuth2 bearer token scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get the current authenticated user from the token."""
    payload = verify_token(token)
    if not payload:
        raise AuthenticationError(detail="Invalid or expired token")
    user_id = payload.get("sub")
    if not user_id:
        raise AuthenticationError(detail="Invalid token payload")
    return user_id

async def optional_current_user(authorization: Optional[str] = Header(None)):
    """Get current user if token is provided, otherwise None."""
    if not authorization:
        return None
    if not authorization.startswith("Bearer "):
        return None
    token = authorization.replace("Bearer ", "")
    payload = verify_token(token)
    if not payload:
        return None
    return payload.get("sub") 