import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, status

from app.modules.category.schemas import (
    CategoryCreate,
    CategoryUpdate,
    CategoryResponse,
    CategoryListItem,
    CategoryDropdownResponse,
    CategoryStatisticsResponse,
)
from app.modules.category.service import CategoryService
from app.database.session import get_db
from app.modules.auth.dependencies import get_current_user
from app.modules.auth.models import Profile
from app.core.constants import CategorySortField, SortOrder
from sqlalchemy.orm import Session

router = APIRouter(prefix="/categories", tags=["Categories"])


def get_category_service(db: Session = Depends(get_db)) -> CategoryService:
    return CategoryService(db)


@router.get("/dropdown", response_model=List[CategoryDropdownResponse])
def get_dropdown(
    category_type: Optional[str] = Query(None, description="Filter by CSR_ACTIVITY or CHALLENGE"),
    service: CategoryService = Depends(get_category_service),
    current_user: Profile = Depends(get_current_user),
):
    return service.get_dropdown_list(category_type)


@router.get("/statistics", response_model=CategoryStatisticsResponse)
def get_statistics(
    service: CategoryService = Depends(get_category_service),
    current_user: Profile = Depends(get_current_user),
):
    return service.get_statistics()


@router.get("/{cat_id}", response_model=CategoryResponse)
def get_category(
    cat_id: uuid.UUID,
    service: CategoryService = Depends(get_category_service),
    current_user: Profile = Depends(get_current_user),
):
    return service.get_category(cat_id)


@router.get("", response_model=List[CategoryListItem])
def list_categories(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    category_type: Optional[str] = Query(None),
    sort_by: CategorySortField = Query(CategorySortField.DISPLAY_ORDER),
    sort_order: SortOrder = Query(SortOrder.ASC),
    service: CategoryService = Depends(get_category_service),
    current_user: Profile = Depends(get_current_user),
):
    items, _ = service.list_categories(
        skip=skip,
        limit=limit,
        search=search,
        status=status,
        category_type=category_type,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    return items


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    payload: CategoryCreate,
    service: CategoryService = Depends(get_category_service),
    current_user: Profile = Depends(get_current_user),
):
    # Depending on requirements, we might check if current_user has Admin or ESG Manager permissions
    return service.create_category(payload, current_user.id)


@router.put("/{cat_id}", response_model=CategoryResponse)
def update_category(
    cat_id: uuid.UUID,
    payload: CategoryUpdate,
    service: CategoryService = Depends(get_category_service),
    current_user: Profile = Depends(get_current_user),
):
    return service.update_category(cat_id, payload, current_user.id)


@router.delete("/{cat_id}", response_model=CategoryResponse)
def delete_category(
    cat_id: uuid.UUID,
    service: CategoryService = Depends(get_category_service),
    current_user: Profile = Depends(get_current_user),
):
    return service.delete_category(cat_id, current_user.id)
