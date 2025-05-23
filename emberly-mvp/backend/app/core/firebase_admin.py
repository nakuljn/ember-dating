from http.client import HTTPException
import firebase_admin
from firebase_admin import credentials, auth
from pathlib import Path
from ..core.config import settings

def initialize_firebase_admin():
    """Initialize Firebase Admin SDK"""
    try:
        # Check if Firebase Admin is already initialized
        if not firebase_admin._apps:
            # Get the path to the service account file
            cred_path = Path(settings.FIREBASE_ADMIN_CREDENTIALS_PATH)
            
            if not cred_path.exists():
                raise FileNotFoundError(
                    f"Firebase credentials file not found at {cred_path}. "
                    "Please ensure you have placed your Firebase Admin SDK "
                    "service account key file in the correct location."
                )
            
            # Initialize Firebase Admin with service account
            cred = credentials.Certificate(str(cred_path))
            firebase_admin.initialize_app(cred)
            
            print("Firebase Admin SDK initialized successfully")
        else:
            print("Firebase Admin SDK already initialized")
            
    except Exception as e:
        print(f"Error initializing Firebase Admin SDK: {str(e)}")
        raise

def verify_firebase_token(id_token: str) -> dict:
    """
    Verify Firebase ID token and return user info
    
    Args:
        id_token: Firebase ID token to verify
        
    Returns:
        dict: User information from the decoded token
        
    Raises:
        HTTPException: If token is invalid or verification fails
    """
    try:
        # Verify the ID token
        decoded_token = auth.verify_id_token(id_token)
        
        # Extract user information
        user_info = {
            "uid": decoded_token.get("uid"),
            "email": decoded_token.get("email"),
            "email_verified": decoded_token.get("email_verified", False),
            "name": decoded_token.get("name"),
            "picture": decoded_token.get("picture"),
            "auth_time": decoded_token.get("auth_time"),
            "provider_id": decoded_token.get("firebase", {}).get("sign_in_provider")
        }
        
        return user_info
        
    except auth.InvalidIdTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error verifying Firebase token: {str(e)}"
        ) 