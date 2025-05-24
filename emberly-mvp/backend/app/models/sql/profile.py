from sqlalchemy import Column, String, Integer, Date, DateTime, ForeignKey, func, ARRAY, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import uuid

from app.core.postgres import Base

class Profile(Base):
    """Profile model for PostgreSQL."""
    __tablename__ = "profiles"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True)
    name = Column(String, nullable=False)
    birthdate = Column(Date, nullable=False)
    gender = Column(String, nullable=False)
    interested_in = Column(ARRAY(String), nullable=False)
    bio = Column(Text)
    photos = Column(ARRAY(String), nullable=False, default=[])
    location = Column(JSONB)  # Stores GeoJSON point
    likes_given = Column(Integer, default=0)
    likes_received = Column(Integer, default=0)
    daily_swipe_limit = Column(Integer, default=8)
    total_matches = Column(Integer, default=0)
    last_swipe_reset = Column(DateTime, server_default=func.now())
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationship with User
    user = relationship("User", backref="profile") 