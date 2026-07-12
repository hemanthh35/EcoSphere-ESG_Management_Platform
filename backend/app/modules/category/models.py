import uuid
from datetime import datetime, UTC
from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.schema import UniqueConstraint

from app.database.base import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    category_code = Column(String(20), unique=True, index=True, nullable=False)
    category_name = Column(String(100), index=True, nullable=False)
    category_type = Column(String(50), index=True, nullable=False) # 'CSR_ACTIVITY' or 'CHALLENGE'
    description = Column(Text, nullable=True)
    color = Column(String(20), nullable=True)
    icon = Column(String(50), nullable=True)
    display_order = Column(Integer, default=0)
    status = Column(String(20), default="ACTIVE", index=True, nullable=False)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)
    created_by = Column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False)
    updated_by = Column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    creator = relationship("Profile", foreign_keys=[created_by])
    updater = relationship("Profile", foreign_keys=[updated_by])

    __table_args__ = (
        UniqueConstraint('category_name', 'category_type', name='uq_category_name_type'),
    )
