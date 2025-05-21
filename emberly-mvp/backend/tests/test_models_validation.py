import pytest
from datetime import date, datetime
from pydantic import ValidationError
from app.models.user import UserBase, UserInDB
from app.models.profile import ProfileBase, ProfileInDB, Location
from app.models.match import MatchBase, MatchInDB
from app.models.message import MessageBase, MessageInDB
from uuid import uuid4


def test_user_model_validation():
    """Test user model validation."""
    # Valid user
    user = UserBase(email="test@example.com", auth_provider="google")
    assert user.email == "test@example.com"
    assert user.auth_provider == "google"
    
    # Invalid email
    with pytest.raises(ValidationError):
        UserBase(email="invalid-email", auth_provider="google")
    
    # Missing required field
    with pytest.raises(ValidationError):
        UserBase(email="test@example.com")  # Missing auth_provider
    
    # Test optional fields
    user = UserBase(email="test@example.com", auth_provider="google", phone="+123456789")
    assert user.phone == "+123456789"
    
    # Test inheritance 
    user_in_db = UserInDB(email="test@example.com", auth_provider="google")
    assert user_in_db.email == "test@example.com"
    assert user_in_db.auth_provider == "google"
    assert user_in_db.id is not None  # Auto-generated
    assert isinstance(user_in_db.created_at, datetime)
    assert isinstance(user_in_db.last_active, datetime)


def test_profile_model_validation():
    """Test profile model validation."""
    # Valid location
    location = Location(coordinates=[-73.9857, 40.7484])
    assert location.type == "Point"
    assert location.coordinates == [-73.9857, 40.7484]
    
    # Invalid location - wrong coordinates format
    with pytest.raises(ValidationError):
        Location(coordinates=[-73.9857])  # Missing latitude
    
    # Valid profile
    profile = ProfileBase(
        name="John Doe",
        birthdate=date(1990, 1, 1),
        gender="male",
        interested_in=["female"],
        bio="Test bio",
        photos=["photo1.jpg", "photo2.jpg"],
        location=location
    )
    assert profile.name == "John Doe"
    assert profile.birthdate == date(1990, 1, 1)
    
    # Invalid profile - missing required fields
    with pytest.raises(ValidationError):
        ProfileBase(name="John Doe")  # Missing required fields
    
    # Test inheritance
    profile_in_db = ProfileInDB(
        user_id=str(uuid4()),
        name="John Doe",
        birthdate=date(1990, 1, 1),
        gender="male",
        interested_in=["female"]
    )
    assert profile_in_db.user_id is not None
    assert profile_in_db.likes_given == 0  # Default value
    assert profile_in_db.likes_received == 0  # Default value
    assert profile_in_db.daily_swipe_limit == 8  # Default value
    assert profile_in_db.total_matches == 0  # Default value
    assert isinstance(profile_in_db.last_swipe_reset, datetime)


def test_match_model_validation():
    """Test match model validation."""
    # Valid match
    user_id1 = str(uuid4())
    user_id2 = str(uuid4())
    match = MatchBase(users=[user_id1, user_id2])
    assert match.users == [user_id1, user_id2]
    
    # Invalid match - empty users list
    with pytest.raises(ValidationError):
        MatchBase(users=[])
    
    # Test inheritance
    match_in_db = MatchInDB(users=[user_id1, user_id2])
    assert match_in_db.users == [user_id1, user_id2]
    assert match_in_db.id is not None  # Auto-generated
    assert isinstance(match_in_db.created_at, datetime)
    assert match_in_db.last_message_at is None  # Default value


def test_message_model_validation():
    """Test message model validation."""
    # Valid message
    match_id = str(uuid4())
    sender_id = str(uuid4())
    message = MessageBase(
        match_id=match_id,
        sender_id=sender_id,
        content="Hello, world!"
    )
    assert message.match_id == match_id
    assert message.sender_id == sender_id
    assert message.content == "Hello, world!"
    
    # Invalid message - missing required fields
    with pytest.raises(ValidationError):
        MessageBase(match_id=match_id, sender_id=sender_id)  # Missing content
    
    # Test inheritance
    message_in_db = MessageInDB(
        match_id=match_id,
        sender_id=sender_id,
        content="Hello, world!"
    )
    assert message_in_db.match_id == match_id
    assert message_in_db.sender_id == sender_id
    assert message_in_db.content == "Hello, world!"
    assert message_in_db.id is not None  # Auto-generated
    assert isinstance(message_in_db.sent_at, datetime)
    assert message_in_db.read_at is None  # Default value 