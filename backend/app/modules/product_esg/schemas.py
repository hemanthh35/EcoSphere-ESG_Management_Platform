from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
import uuid
from datetime import datetime
from app.modules.product_esg.models import SustainabilityRating, ProductStatus
from app.core.constants import SortOrder
from enum import Enum

class ProductESGSortField(str, Enum):
    PRODUCT_CODE = "product_code"
    PRODUCT_NAME = "product_name"
    ESG_SCORE = "esg_score"
    CREATED_AT = "created_at"
    UPDATED_AT = "updated_at"

class ProductESGProfileBase(BaseModel):
    product_code: str = Field(..., max_length=50)
    product_name: str = Field(..., max_length=200)
    department_id: uuid.UUID
    category_id: Optional[uuid.UUID] = None
    description: Optional[str] = None
    carbon_factor: Optional[float] = Field(None, ge=0.0)
    carbon_unit: Optional[str] = "kgCO₂e/unit"
    sustainability_rating: Optional[SustainabilityRating] = None
    esg_score: Optional[float] = Field(None, ge=0.0, le=100.0)
    recyclable: Optional[bool] = False
    recycled_content_percentage: Optional[float] = Field(None, ge=0.0, le=100.0)
    renewable_material: Optional[bool] = False
    hazardous_material: Optional[bool] = False
    certification: Optional[str] = None
    supplier_name: Optional[str] = None
    status: ProductStatus = ProductStatus.ACTIVE

    @field_validator('carbon_factor', 'esg_score', 'recycled_content_percentage')
    def validate_decimals(cls, v):
        if v is not None:
            return round(float(v), 4)
        return v

class ProductESGProfileCreate(ProductESGProfileBase):
    pass

class ProductESGProfileUpdate(BaseModel):
    product_code: Optional[str] = Field(None, max_length=50)
    product_name: Optional[str] = Field(None, max_length=200)
    department_id: Optional[uuid.UUID] = None
    category_id: Optional[uuid.UUID] = None
    description: Optional[str] = None
    carbon_factor: Optional[float] = Field(None, ge=0.0)
    carbon_unit: Optional[str] = None
    sustainability_rating: Optional[SustainabilityRating] = None
    esg_score: Optional[float] = Field(None, ge=0.0, le=100.0)
    recyclable: Optional[bool] = None
    recycled_content_percentage: Optional[float] = Field(None, ge=0.0, le=100.0)
    renewable_material: Optional[bool] = None
    hazardous_material: Optional[bool] = None
    certification: Optional[str] = None
    supplier_name: Optional[str] = None
    status: Optional[ProductStatus] = None

class ProductESGProfileResponse(ProductESGProfileBase):
    id: uuid.UUID
    department_name: Optional[str] = None
    category_name: Optional[str] = None
    is_deleted: bool
    created_at: datetime
    updated_at: datetime
    created_by: Optional[uuid.UUID] = None
    updated_by: Optional[uuid.UUID] = None

    model_config = {"from_attributes": True}

class PaginatedProductESGResponse(BaseModel):
    items: List[ProductESGProfileResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

class ProductESGDropdownResponse(BaseModel):
    id: uuid.UUID
    product_code: str
    product_name: str
    esg_score: Optional[float]

    model_config = {"from_attributes": True}

class ProductESGStatisticsResponse(BaseModel):
    total_products: int
    active_products: int
    avg_esg_score: Optional[float]
    avg_carbon_factor: Optional[float]
