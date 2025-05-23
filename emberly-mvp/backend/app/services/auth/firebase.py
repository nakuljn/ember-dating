from firebase_admin import auth
from app.core.errors import AuthenticationError


async def verify_firebase_token(token: str) -> tuple[str, str]:
    """
    Verify a Firebase ID token and extract user information.
    
    Args:
        token: Firebase ID token
        
    Returns:
        Tuple of (user_id, email)
        
    Raises:
        AuthenticationError: If token is invalid
    """
    if not token:
        raise AuthenticationError(detail="Invalid authentication credentials")
    
    try:
        # Verify the Firebase token
        decoded_token = auth.verify_id_token(token)
        
        # Extract user information
        user_id = decoded_token.get("uid")
        email = decoded_token.get("email")
        
        if not user_id:
            raise AuthenticationError(detail="Invalid user information in token")
        
        return user_id, email
        
    except auth.InvalidIdTokenError:
        raise AuthenticationError(detail="Invalid or expired token")
    except Exception as e:
        raise AuthenticationError(detail=f"Error verifying token: {str(e)}") 