import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, field_validator
from app.core.constants import CategoryType, CategoryStatus, CategorySortField, SortOrder

class CategoryBase(BaseModel):
    category_name: str = Field(..., min_length=3, max_length=100)
    category_code: str = Field(..., min_length=2, max_length=20)
    category_type: CategoryType
    description: Optional[str] = Field(None, max_length=1000)
    color: Optional[str] = Field(None, max_length=20)
    icon: Optional[str] = Field(None, max_length=50)
    display_order: int = Field(0, ge=0)
    status: CategoryStatus = CategoryStatus.ACTIVE

    @field_validator("category_code")
    @classmethod
    def code_must_be_uppercase(cls, v: str) -> str:
        cleaned = v.strip().upper()
        if not cleaned.replace("-", "").replace("_", "").isalnum():
            raise ValueError("Code must be alphanumeric (hyphens and underscores allowed)")
        return cleaned

    @field_validator("category_name")
    @classmethod
    def name_must_not_be_blank(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Name cannot be blank")
        return v


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    category_name: Optional[str] = Field(None, min_length=3, max_length=100)
    category_code: Optional[str] = Field(None, min_length=2, max_length=20)
    category_type: Optional[CategoryType] = None
    description: Optional[str] = Field(None, max_length=1000)
    color: Optional[str] = Field(None, max_length=20)
    icon: Optional[str] = Field(None, max_length=50)
    display_order: Optional[int] = Field(None, ge=0)
    status: Optional[CategoryStatus] = None

    @field_validator("category_code")
    @classmethod
    def code_must_be_uppercase(cls, v: Optional[str]) -> Optional[str]:
        if v is None: return v
        return v.strip().upper()


class CategoryResponse(BaseModel):
    id: uuid.UUID
    category_name: str
    category_code: str
    category_type: CategoryType
    description: Optional[str]
    color: Optional[str]
    icon: Optional[str]
    display_order: int
    status: CategoryStatus
    created_by: uuid.UUID
    updated_by: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class CategoryListItem(BaseModel):
    id: uuid.UUID
    category_name: str
    category_code: str
    category_type: CategoryType
    color: Optional[str]
    icon: Optional[str]
    display_order: int
    status: CategoryStatus
    created_at: datetime

    model_config = {"from_attributes": True}


class CategoryDropdownResponse(BaseModel):
    id: uuid.UUID
    category_name: str
    category_code: str
    category_type: CategoryType

    model_config = {"from_attributes": True}


class CategoryStatisticsResponse(BaseModel):
    total_categories: int
    csr_categories: int
    challenge_categories: int
    active_categories: int
