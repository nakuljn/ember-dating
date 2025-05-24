from pydantic import BaseModel
from app.models.user import User


class Token(BaseModel):
    access_token: str
    token_type: str
    user: User


class FirebaseToken(BaseModel):
    token: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: User 