import uuid
from datetime import datetime

from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(50), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    avatar = Column(Text, nullable=True)  # base64 data URL, kept small (<800KB) by the frontend
    created_at = Column(DateTime, default=datetime.utcnow)

    designs = relationship("Design", back_populates="owner", cascade="all, delete-orphan")


class Design(Base):
    __tablename__ = "designs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    category = Column(String(20), nullable=False)  # 'trace' or 'freedraw'
    label = Column(String(255), nullable=True)
    level = Column(String(20), nullable=True)  # 'beginner' | 'intermediate' | 'advanced' | None
    image_data = Column(Text, nullable=False)  # base64 PNG data URL
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="designs")
