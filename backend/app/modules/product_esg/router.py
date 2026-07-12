import uuid
import math
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.modules.auth.dependencies import get_current_user, RoleChecker
from app.modules.auth.models import Profile, RoleEnum
from app.modules.product_esg.service import ProductESGService
from app.modules.product_esg.schemas import (
    ProductESGProfileCreate,
    ProductESGProfileUpdate,
    ProductESGProfileResponse,
    PaginatedProductESGResponse,
    ProductESGDropdownResponse,
    ProductESGStatisticsResponse,
    ProductESGSortField
)
from app.shared.response_models import ResponseModel
from app.core.exceptions import ResourceNotFoundError
from app.modules.product_esg.exceptions import (
    DuplicateProductCodeError,
    InvalidCarbonFactorError,
    InvalidESGScoreError,
    ProductInUseError
)
from app.core.constants import SortOrder

router = APIRouter(prefix="/api/v1/products", tags=["Product ESG Profiles"])

def get_service(db: Session = Depends(get_db)) -> ProductESGService:
    return ProductESGService(db)

@router.get("", response_model=ResponseModel[PaginatedProductESGResponse])
def list_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    department_id: Optional[uuid.UUID] = Query(None),
    status: Optional[str] = Query(None),
    sustainability_rating: Optional[str] = Query(None),
    sort_by: ProductESGSortField = Query(ProductESGSortField.CREATED_AT),
    sort_order: SortOrder = Query(SortOrder.DESC),
    service: ProductESGService = Depends(get_service),
    current_user: Profile = Depends(get_current_user),
):
    try:
        items, total = service.list_products(
            skip, limit, search, department_id, status, sustainability_rating, sort_by, sort_order
        )
        page = (skip // limit) + 1
        total_pages = math.ceil(total / limit) if limit else 1
        return ResponseModel.ok(
            data=PaginatedProductESGResponse(
                items=[ProductESGProfileResponse.model_validate(item) for item in items],
                total=total,
                page=page,
                page_size=limit,
                total_pages=total_pages
            )
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("", response_model=ResponseModel[ProductESGProfileResponse], status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductESGProfileCreate,
    service: ProductESGService = Depends(get_service),
    current_user: Profile = Depends(RoleChecker([RoleEnum.ADMIN, RoleEnum.ESG_MANAGER])),
):
    try:
        product = service.create_product(payload, created_by=current_user.id)
        return ResponseModel.ok(data=ProductESGProfileResponse.model_validate(product), message="Product ESG profile created successfully.")
    except (DuplicateProductCodeError, InvalidCarbonFactorError, InvalidESGScoreError) as e:
        raise HTTPException(status_code=400, detail=e.message)
    except ResourceNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dropdown", response_model=ResponseModel[List[ProductESGDropdownResponse]])
def get_dropdown(
    service: ProductESGService = Depends(get_service),
    current_user: Profile = Depends(get_current_user),
):
    try:
        data = service.get_dropdown()
        return ResponseModel.ok(data=[ProductESGDropdownResponse.model_validate(item) for item in data])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/statistics", response_model=ResponseModel[ProductESGStatisticsResponse])
def get_statistics(
    service: ProductESGService = Depends(get_service),
    current_user: Profile = Depends(get_current_user),
):
    try:
        data = service.get_statistics()
        return ResponseModel.ok(data=ProductESGStatisticsResponse.model_validate(data))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{product_id}", response_model=ResponseModel[ProductESGProfileResponse])
def get_product(
    product_id: uuid.UUID,
    service: ProductESGService = Depends(get_service),
    current_user: Profile = Depends(get_current_user),
):
    try:
        product = service.get_product(product_id)
        return ResponseModel.ok(data=ProductESGProfileResponse.model_validate(product))
    except ResourceNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{product_id}", response_model=ResponseModel[ProductESGProfileResponse])
def update_product(
    product_id: uuid.UUID,
    payload: ProductESGProfileUpdate,
    service: ProductESGService = Depends(get_service),
    current_user: Profile = Depends(RoleChecker([RoleEnum.ADMIN, RoleEnum.ESG_MANAGER])),
):
    try:
        product = service.update_product(product_id, payload, updated_by=current_user.id)
        return ResponseModel.ok(data=ProductESGProfileResponse.model_validate(product), message="Product ESG profile updated successfully.")
    except (DuplicateProductCodeError, InvalidCarbonFactorError, InvalidESGScoreError) as e:
        raise HTTPException(status_code=400, detail=e.message)
    except ResourceNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{product_id}", response_model=ResponseModel[ProductESGProfileResponse])
def delete_product(
    product_id: uuid.UUID,
    service: ProductESGService = Depends(get_service),
    current_user: Profile = Depends(RoleChecker([RoleEnum.ADMIN])),
):
    try:
        product = service.delete_product(product_id, updated_by=current_user.id)
        return ResponseModel.ok(data=ProductESGProfileResponse.model_validate(product), message="Product ESG profile deleted successfully.")
    except ProductInUseError as e:
        raise HTTPException(status_code=400, detail=e.message)
    except ResourceNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
