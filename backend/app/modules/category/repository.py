import uuid
import structlog
from datetime import datetime, UTC
from typing import Optional, Tuple, List
from sqlalchemy import asc, desc, func, or_
from sqlalchemy.orm import Session

from app.modules.category.models import Category
from app.core.constants import CategoryType, CategoryStatus, CategorySortField, SortOrder

log = structlog.get_logger()

SORT_FIELD_MAP = {
    CategorySortField.NAME: Category.category_name,
    CategorySortField.CODE: Category.category_code,
    CategorySortField.TYPE: Category.category_type,
    CategorySortField.STATUS: Category.status,
    CategorySortField.DISPLAY_ORDER: Category.display_order,
    CategorySortField.CREATED_AT: Category.created_at,
    CategorySortField.UPDATED_AT: Category.updated_at,
}


class CategoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def _active_query(self):
        return self.db.query(Category).filter(Category.deleted_at.is_(None))

    def create(
        self,
        category_name: str,
        category_code: str,
        category_type: str,
        created_by: uuid.UUID,
        description: Optional[str] = None,
        color: Optional[str] = None,
        icon: Optional[str] = None,
        display_order: int = 0,
        status: str = "ACTIVE",
    ) -> Category:
        cat = Category(
            category_name=category_name,
            category_code=category_code,
            category_type=category_type,
            description=description,
            color=color,
            icon=icon,
            display_order=display_order,
            status=status,
            created_by=created_by,
            updated_by=created_by,
        )
        self.db.add(cat)
        self.db.commit()
        self.db.refresh(cat)
        log.info("category.created", id=str(cat.id), code=cat.category_code)
        return cat

    def get_by_id(self, cat_id: uuid.UUID) -> Optional[Category]:
        return self._active_query().filter(Category.id == cat_id).first()

    def get_by_code(self, code: str) -> Optional[Category]:
        return self._active_query().filter(Category.category_code == code).first()

    def list_active(
        self,
        skip: int = 0,
        limit: int = 20,
        search: Optional[str] = None,
        status: Optional[str] = None,
        category_type: Optional[str] = None,
        sort_by: CategorySortField = CategorySortField.DISPLAY_ORDER,
        sort_order: SortOrder = SortOrder.ASC,
    ) -> Tuple[List[Category], int]:
        query = self._active_query()

        if search:
            pattern = f"%{search}%"
            query = query.filter(
                or_(
                    Category.category_name.ilike(pattern),
                    Category.category_code.ilike(pattern),
                    Category.description.ilike(pattern),
                )
            )

        if status:
            query = query.filter(Category.status == status)

        if category_type:
            query = query.filter(Category.category_type == category_type)

        total = query.with_entities(func.count()).scalar()

        sort_col = SORT_FIELD_MAP.get(sort_by, Category.display_order)
        order_fn = asc if sort_order == SortOrder.ASC else desc
        query = query.order_by(order_fn(sort_col))

        items = query.offset(skip).limit(limit).all()
        return items, total

    def update(self, cat_id: uuid.UUID, updated_by: uuid.UUID, **kwargs) -> Optional[Category]:
        cat = self.get_by_id(cat_id)
        if not cat:
            return None
        for field, value in kwargs.items():
            if value is not None or field in ("description", "color", "icon"):
                setattr(cat, field, value)
        cat.updated_by = updated_by
        cat.updated_at = datetime.now(UTC)
        self.db.commit()
        self.db.refresh(cat)
        log.info("category.updated", id=str(cat_id))
        return cat

    def soft_delete(self, cat_id: uuid.UUID, updated_by: uuid.UUID) -> Optional[Category]:
        cat = self.get_by_id(cat_id)
        if not cat:
            return None
        cat.deleted_at = datetime.now(UTC)
        cat.updated_by = updated_by
        cat.updated_at = datetime.now(UTC)
        self.db.commit()
        self.db.refresh(cat)
        log.info("category.deleted", id=str(cat_id))
        return cat

    def check_name_exists(self, name: str, cat_type: str, exclude_id: Optional[uuid.UUID] = None) -> bool:
        query = self._active_query().filter(Category.category_name == name, Category.category_type == cat_type)
        if exclude_id:
            query = query.filter(Category.id != exclude_id)
        return query.count() > 0

    def check_code_exists(self, code: str, exclude_id: Optional[uuid.UUID] = None) -> bool:
        query = self._active_query().filter(Category.category_code == code)
        if exclude_id:
            query = query.filter(Category.id != exclude_id)
        return query.count() > 0

    def get_dropdown_list(self, category_type: Optional[str] = None) -> List[dict]:
        """Get minimal category info for dropdowns (active only)."""
        query = self._active_query().filter(Category.status == "ACTIVE")
        if category_type:
            query = query.filter(Category.category_type == category_type)
            
        res = query.order_by(Category.display_order.asc(), Category.category_name.asc()).with_entities(
            Category.id, Category.category_name, Category.category_code, Category.category_type
        ).all()
        return [{"id": r[0], "category_name": r[1], "category_code": r[2], "category_type": r[3]} for r in res]

    def get_statistics(self) -> dict:
        total = self._active_query().count()
        csr = self._active_query().filter(Category.category_type == CategoryType.CSR_ACTIVITY).count()
        challenge = self._active_query().filter(Category.category_type == CategoryType.CHALLENGE).count()
        active = self._active_query().filter(Category.status == "ACTIVE").count()
        
        return {
            "total_categories": total,
            "csr_categories": csr,
            "challenge_categories": challenge,
            "active_categories": active
        }
