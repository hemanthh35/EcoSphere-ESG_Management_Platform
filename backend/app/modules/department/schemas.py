import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, field_validator, model_validator
from app.core.constants import DepartmentStatus, DepartmentSortField, SortOrder


class DepartmentBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=255, description="Department name")
    code: str = Field(..., min_length=2, max_length=50, description="Uppercase department code")
    description: Optional[str] = Field(None, max_length=1000)
    parent_department_id: Optional[uuid.UUID] = None
    department_head_id: Optional[uuid.UUID] = None
    employee_count: int = Field(0, ge=0)
    status: DepartmentStatus = DepartmentStatus.ACTIVE

    @field_validator("code")
    @classmethod
    def code_must_be_uppercase(cls, v: str) -> str:
        cleaned = v.strip().upper()
        if not cleaned.replace("-", "").replace("_", "").isalnum():
            raise ValueError("Code must be alphanumeric (hyphens and underscores allowed)")
        return cleaned

    @field_validator("name")
    @classmethod
    def name_must_not_be_blank(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Name cannot be blank")
        return v


class DepartmentCreate(DepartmentBase):
    """Schema for creating a new department."""

    model_config = {
        "json_schema_extra": {
            "example": {
                "name": "Engineering",
                "code": "ENG",
                "description": "Product engineering and development",
                "status": "ACTIVE",
                "employee_count": 50,
            }
        }
    }


class DepartmentUpdate(BaseModel):
    """Schema for updating a department. All fields are optional."""

    name: Optional[str] = Field(None, min_length=3, max_length=255)
    code: Optional[str] = Field(None, min_length=2, max_length=50)
    description: Optional[str] = Field(None, max_length=1000)
    parent_department_id: Optional[uuid.UUID] = None
    department_head_id: Optional[uuid.UUID] = None
    employee_count: Optional[int] = Field(None, ge=0)
    status: Optional[DepartmentStatus] = None

    @field_validator("code")
    @classmethod
    def code_must_be_uppercase(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        return v.strip().upper()

    @field_validator("name")
    @classmethod
    def name_must_not_be_blank(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        v = v.strip()
        if not v:
            raise ValueError("Name cannot be blank")
        return v


class DepartmentResponse(BaseModel):
    """Full department response schema."""

    id: uuid.UUID
    name: str
    code: str
    description: Optional[str]
    parent_department_id: Optional[uuid.UUID]
    department_head_id: Optional[uuid.UUID]
    employee_count: int
    status: DepartmentStatus
    created_by: uuid.UUID
    updated_by: uuid.UUID
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime]

    model_config = {"from_attributes": True}


class DepartmentListItem(BaseModel):
    """Lightweight schema for department list views."""

    id: uuid.UUID
    name: str
    code: str
    status: DepartmentStatus
    employee_count: int
    parent_department_id: Optional[uuid.UUID]
    department_head_name: Optional[str] = None
    parent_department_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PaginatedDepartmentResponse(BaseModel):
    """Paginated list of departments."""

    items: List[DepartmentListItem]
    total: int
    page: int
    page_size: int
    total_pages: int


class DepartmentQueryParams(BaseModel):
    """Query parameters for listing departments."""

    skip: int = Field(0, ge=0)
    limit: int = Field(20, ge=1, le=100)
    search: Optional[str] = None
    status: Optional[DepartmentStatus] = None
    parent_id: Optional[uuid.UUID] = None
    sort_by: DepartmentSortField = DepartmentSortField.CREATED_AT
    sort_order: SortOrder = SortOrder.DESC


class DepartmentTreeResponse(BaseModel):
    """Recursive schema for department hierarchy tree."""
    id: uuid.UUID
    name: str
    code: str
    status: DepartmentStatus
    employee_count: int
    parent_department_id: Optional[uuid.UUID]
    children: List["DepartmentTreeResponse"] = []

    model_config = {"from_attributes": True}


class DepartmentDropdownResponse(BaseModel):
    """Minimal schema for dropdown lists."""
    id: uuid.UUID
    name: str
    code: str

    model_config = {"from_attributes": True}


class DepartmentStatisticsResponse(BaseModel):
    """Statistics for the department dashboard."""
    total_departments: int
    active_departments: int
    inactive_departments: int
    total_employees: int


class DepartmentEmployeeResponse(BaseModel):
    """Schema for an employee belonging to a department."""
    id: uuid.UUID
    full_name: str
    email: str
    designation: Optional[str]
    status: str

    model_config = {"from_attributes": True}

