from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr
from datetime import datetime
from app.modules.auth.models import RoleEnum

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    refresh_token: Optional[str] = None
    expires_in: Optional[int] = None

class ProfileBase(BaseModel):
    employee_code: Optional[str] = None
    full_name: str
    email: EmailStr
    role: RoleEnum
    department_id: Optional[UUID] = None
    designation: Optional[str] = None
    profile_image: Optional[str] = None
    phone: Optional[str] = None
    status: str = "active"

class ProfileCreate(ProfileBase):
    password: str

class ProfileUpdate(BaseModel):
    employee_code: Optional[str] = None
    full_name: Optional[str] = None
    department_id: Optional[UUID] = None
    designation: Optional[str] = None
    profile_image: Optional[str] = None
    phone: Optional[str] = None

class ProfileResponse(ProfileBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class RefreshTokenRequest(BaseModel):
    refresh_token: str
