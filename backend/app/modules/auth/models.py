import uuid
import enum
from datetime import datetime, timezone
from sqlalchemy import Column, String, ForeignKey, Enum, DateTime, Date, Boolean, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database.base import Base

class RoleEnum(str, enum.Enum):
    ADMIN = "Admin"
    ESG_MANAGER = "ESG Manager"
    DEPARTMENT_HEAD = "Department Head"
    AUDITOR = "Auditor"
    EMPLOYEE = "Employee"

class StatusEnum(str, enum.Enum):
    ACTIVE = "Active"
    INACTIVE = "Inactive"
    SUSPENDED = "Suspended"

class GenderEnum(str, enum.Enum):
    MALE = "Male"
    FEMALE = "Female"
    OTHER = "Other"

class Profile(Base):
    __tablename__ = "profiles"

    # Supabase auth.users ID is a UUID. We use this as our primary key.
    id = Column(UUID(as_uuid=True), primary_key=True)
    employee_code = Column(String(20), unique=True, index=True, nullable=True)
    
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    full_name = Column(String(200), index=True, nullable=False)
    
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=True)
    profile_image = Column(Text, nullable=True)
    
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id", ondelete="SET NULL"), nullable=True)
    department = relationship("Department")
    
    designation = Column(String, nullable=True)
    
    manager_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="SET NULL"), nullable=True)
    manager = relationship("Profile", remote_side=[id], backref="subordinates")
    
    role = Column(Enum(RoleEnum), default=RoleEnum.EMPLOYEE, nullable=False)
    gender = Column(Enum(GenderEnum), nullable=True)
    
    joining_date = Column(Date, nullable=True)
    date_of_birth = Column(Date, nullable=True)
    address = Column(Text, nullable=True)
    
    status = Column(Enum(StatusEnum), default=StatusEnum.ACTIVE, nullable=False)
    last_login = Column(DateTime, nullable=True)
    
    is_deleted = Column(Boolean, default=False, nullable=False)
    deleted_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    created_by = Column(UUID(as_uuid=True), nullable=True)
    updated_by = Column(UUID(as_uuid=True), nullable=True)
