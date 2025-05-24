from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, Field, field_validator
from uuid import uuid4


class Location(BaseModel):
    type: str = "Point"
    coordinates: List[float] = Field(..., description="[longitude, latitude]")
    
    @field_validator('coordinates')
    @classmethod
    def validate_coordinates(cls, v):
        if len(v) != 2:
            raise ValueError('coordinates must contain exactly 2 values [longitude, latitude]')
        return v


class ProfileBase(BaseModel):
    name: str
    birthdate: date
    gender: str
    interested_in: List[str]
    bio: Optional[str] = None
    photos: List[str] = Field(default_factory=list, description="List of S3 photo URLs")
    location: Optional[Location] = None


class ProfileCreate(ProfileBase):
    user_id: str


class ProfileInDB(ProfileBase):
    user_id: str
    likes_given: int = 0
    likes_received: int = 0
    daily_swipe_limit: int = 8
    total_matches: int = 0
    last_swipe_reset: datetime = Field(default_factory=datetime.utcnow)


class Profile(ProfileInDB):
    model_config = {
        "json_schema_extra": {
            "example": {
                "user_id": "f0e4f84a-5134-4c44-b9c9-e2c3e4b6a16b",
                "name": "John Doe",
                "birthdate": "1990-01-01",
                "gender": "male",
                "interested_in": ["female"],
                "bio": "Software developer who loves hiking and photography",
                "photos": [
                    "https://emberly-user-photos.s3.amazonaws.com/profile1.jpg",
                    "https://emberly-user-photos.s3.amazonaws.com/profile2.jpg"
                ],
                "location": {
                    "type": "Point",
                    "coordinates": [-73.9857, 40.7484]
                },
                "likes_given": 5,
                "likes_received": 8,
                "daily_swipe_limit": 8,
                "total_matches": 3,
                "last_swipe_reset": "2023-05-01T00:00:00Z"
            }
        }
    } 