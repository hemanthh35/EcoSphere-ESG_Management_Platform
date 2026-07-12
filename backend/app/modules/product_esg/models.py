import uuid
import enum
from datetime import datetime, timezone
from sqlalchemy import Column, String, ForeignKey, Enum, DateTime, Date, Boolean, Text, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database.base import Base


class SustainabilityRating(str, enum.Enum):
    BRONZE = "Bronze"
    SILVER = "Silver"
    GOLD = "Gold"
    PLATINUM = "Platinum"

class ProductStatus(str, enum.Enum):
    ACTIVE = "Active"
    INACTIVE = "Inactive"

class ProductESGProfile(Base):
    __tablename__ = "product_esg_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_code = Column(String(50), unique=True, index=True, nullable=False)
    product_name = Column(String(200), index=True, nullable=False)
    
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id", ondelete="RESTRICT"), index=True, nullable=False)
    department = relationship("Department")
    
    category_id = Column(UUID(as_uuid=True), ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    category = relationship("Category")
    
    description = Column(Text, nullable=True)
    
    carbon_factor = Column(Numeric(10, 4), nullable=True)
    carbon_unit = Column(String(50), default="kgCO₂e/unit", nullable=True)
    
    sustainability_rating = Column(Enum(SustainabilityRating), index=True, nullable=True)
    esg_score = Column(Numeric(5, 2), index=True, nullable=True)
    
    recyclable = Column(Boolean, default=False, nullable=True)
    recycled_content_percentage = Column(Numeric(5, 2), nullable=True)
    renewable_material = Column(Boolean, default=False, nullable=True)
    hazardous_material = Column(Boolean, default=False, nullable=True)
    
    certification = Column(String, nullable=True)
    supplier_name = Column(String, nullable=True)
    
    status = Column(Enum(ProductStatus), default=ProductStatus.ACTIVE, index=True, nullable=False)
    
    is_deleted = Column(Boolean, default=False, nullable=False)
    deleted_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    created_by = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="SET NULL"), nullable=True)
    updated_by = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="SET NULL"), nullable=True)
    
    creator = relationship("Profile", foreign_keys=[created_by])
    updater = relationship("Profile", foreign_keys=[updated_by])
