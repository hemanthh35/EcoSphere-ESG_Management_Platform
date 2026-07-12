from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date, datetime
import uuid
from app.modules.auth.models import RoleEnum, StatusEnum, GenderEnum

class EmployeeBase(BaseModel):
    employee_code: Optional[str] = Field(None, max_length=20)
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    full_name: str = Field(..., max_length=200)
    email: EmailStr
    phone: Optional[str] = None
    profile_image: Optional[str] = None
    department_id: Optional[uuid.UUID] = None
    designation: Optional[str] = None
    manager_id: Optional[uuid.UUID] = None
    role: RoleEnum = RoleEnum.EMPLOYEE
    gender: Optional[GenderEnum] = None
    joining_date: Optional[date] = None
    date_of_birth: Optional[date] = None
    address: Optional[str] = None
    status: StatusEnum = StatusEnum.ACTIVE

class CreateEmployeeRequest(EmployeeBase):
    password: Optional[str] = Field(None, description="Auto-generated if not provided")

class UpdateEmployeeRequest(BaseModel):
    employee_code: Optional[str] = Field(None, max_length=20)
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    full_name: Optional[str] = Field(None, max_length=200)
    phone: Optional[str] = None
    profile_image: Optional[str] = None
    department_id: Optional[uuid.UUID] = None
    designation: Optional[str] = None
    manager_id: Optional[uuid.UUID] = None
    role: Optional[RoleEnum] = None
    gender: Optional[GenderEnum] = None
    joining_date: Optional[date] = None
    date_of_birth: Optional[date] = None
    address: Optional[str] = None
    status: Optional[StatusEnum] = None

class EmployeeResponse(EmployeeBase):
    id: uuid.UUID
    department_name: Optional[str] = None
    manager_name: Optional[str] = None
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class EmployeeDetailResponse(EmployeeResponse):
    created_at: datetime
    updated_at: datetime
    
class EmployeeDropdownResponse(BaseModel):
    id: uuid.UUID
    full_name: str
    employee_code: Optional[str] = None
    
    class Config:
        from_attributes = True

class EmployeeStatisticsResponse(BaseModel):
    total: int
    active: int
    inactive: int
    by_department: dict[str, int]
