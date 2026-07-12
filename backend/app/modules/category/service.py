import uuid
import structlog
from typing import Optional, Tuple, List
from sqlalchemy.orm import Session

from app.modules.category.repository import CategoryRepository
from app.modules.category.schemas import (
    CategoryCreate,
    CategoryUpdate,
    CategoryResponse,
    CategoryListItem,
)
from app.core.exceptions import (
    ResourceNotFoundError,
    ResourceAlreadyExistsError,
    EcoSphereBaseException,
)
from app.core.constants import CategorySortField, SortOrder

log = structlog.get_logger()


class CategoryService:
    def __init__(self, db: Session):
        self.repo = CategoryRepository(db)

    def create_category(
        self, payload: CategoryCreate, created_by: uuid.UUID
    ) -> CategoryResponse:
        log.info("service.category.create", code=payload.category_code)

        if self.repo.check_code_exists(payload.category_code):
            raise ResourceAlreadyExistsError("category_code", payload.category_code)

        if self.repo.check_name_exists(payload.category_name, payload.category_type.value):
            raise ResourceAlreadyExistsError(
                "category_name", f"{payload.category_name} in {payload.category_type.value}"
            )

        cat = self.repo.create(
            category_name=payload.category_name,
            category_code=payload.category_code,
            category_type=payload.category_type.value,
            created_by=created_by,
            description=payload.description,
            color=payload.color,
            icon=payload.icon,
            display_order=payload.display_order,
            status=payload.status.value,
        )
        return CategoryResponse.model_validate(cat)

    def get_category(self, cat_id: uuid.UUID) -> CategoryResponse:
        cat = self.repo.get_by_id(cat_id)
        if not cat:
            raise ResourceNotFoundError(str(cat_id))
        return CategoryResponse.model_validate(cat)

    def list_categories(
        self,
        skip: int = 0,
        limit: int = 20,
        search: Optional[str] = None,
        status: Optional[str] = None,
        category_type: Optional[str] = None,
        sort_by: CategorySortField = CategorySortField.DISPLAY_ORDER,
        sort_order: SortOrder = SortOrder.ASC,
    ) -> Tuple[List[CategoryListItem], int]:
        cats, total = self.repo.list_active(
            skip=skip,
            limit=limit,
            search=search,
            status=status,
            category_type=category_type,
            sort_by=sort_by,
            sort_order=sort_order,
        )
        return [CategoryListItem.model_validate(c) for c in cats], total

    def update_category(
        self, cat_id: uuid.UUID, payload: CategoryUpdate, updated_by: uuid.UUID
    ) -> CategoryResponse:
        log.info("service.category.update", id=str(cat_id))
        existing = self.repo.get_by_id(cat_id)
        if not existing:
            raise ResourceNotFoundError(str(cat_id))

        if payload.category_code and self.repo.check_code_exists(payload.category_code, exclude_id=cat_id):
            raise ResourceAlreadyExistsError("category_code", payload.category_code)

        new_name = payload.category_name or existing.category_name
        new_type = payload.category_type.value if payload.category_type else existing.category_type
        
        if (payload.category_name or payload.category_type) and self.repo.check_name_exists(new_name, new_type, exclude_id=cat_id):
             raise ResourceAlreadyExistsError("category_name", f"{new_name} in {new_type}")

        update_data = payload.model_dump(exclude_unset=True)
        if "status" in update_data and update_data["status"]:
            update_data["status"] = update_data["status"].value
        if "category_type" in update_data and update_data["category_type"]:
            update_data["category_type"] = update_data["category_type"].value

        cat = self.repo.update(cat_id, updated_by=updated_by, **update_data)
        return CategoryResponse.model_validate(cat)

    def delete_category(self, cat_id: uuid.UUID, updated_by: uuid.UUID) -> CategoryResponse:
        log.info("service.category.delete", id=str(cat_id))
        existing = self.repo.get_by_id(cat_id)
        if not existing:
            raise ResourceNotFoundError(str(cat_id))

        # In a real app, you would check if it's used by CSR Activity or Challenge before deleting.
        # However, we don't have those models yet, so we allow it or skip validation for now.
        
        cat = self.repo.soft_delete(cat_id, updated_by=updated_by)
        return CategoryResponse.model_validate(cat)

    def get_dropdown_list(self, category_type: Optional[str] = None) -> List[dict]:
        return self.repo.get_dropdown_list(category_type)

    def get_statistics(self) -> dict:
        return self.repo.get_statistics()
