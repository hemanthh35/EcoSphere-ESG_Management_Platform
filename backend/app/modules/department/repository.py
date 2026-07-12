import uuid
import structlog
from datetime import datetime, UTC
from typing import Optional, Tuple, List
from sqlalchemy import asc, desc, func, or_
from sqlalchemy.orm import Session

from app.modules.department.models import Department
from app.core.constants import DepartmentSortField, SortOrder

log = structlog.get_logger()

SORT_FIELD_MAP = {
    DepartmentSortField.NAME: Department.name,
    DepartmentSortField.CODE: Department.code,
    DepartmentSortField.STATUS: Department.status,
    DepartmentSortField.CREATED_AT: Department.created_at,
    DepartmentSortField.UPDATED_AT: Department.updated_at,
}


class DepartmentRepository:
    def __init__(self, db: Session):
        self.db = db

    def _active_query(self):
        return self.db.query(Department).filter(Department.deleted_at.is_(None))

    def create(
        self,
        name: str,
        code: str,
        created_by: uuid.UUID,
        description: Optional[str] = None,
        parent_department_id: Optional[uuid.UUID] = None,
        department_head_id: Optional[uuid.UUID] = None,
        employee_count: int = 0,
        status: str = "ACTIVE",
    ) -> Department:
        dept = Department(
            name=name,
            code=code,
            description=description,
            parent_department_id=parent_department_id,
            department_head_id=department_head_id,
            employee_count=employee_count,
            status=status,
            created_by=created_by,
            updated_by=created_by,
        )
        self.db.add(dept)
        self.db.commit()
        self.db.refresh(dept)
        log.info("department.created", id=str(dept.id), code=dept.code)
        return dept

    def get_by_id(self, dept_id: uuid.UUID) -> Optional[Department]:
        return self._active_query().filter(Department.id == dept_id).first()

    def get_by_code(self, code: str) -> Optional[Department]:
        return self._active_query().filter(Department.code == code).first()

    def list_active(
        self,
        skip: int = 0,
        limit: int = 20,
        search: Optional[str] = None,
        status: Optional[str] = None,
        parent_id: Optional[uuid.UUID] = None,
        sort_by: DepartmentSortField = DepartmentSortField.CREATED_AT,
        sort_order: SortOrder = SortOrder.DESC,
    ) -> Tuple[List[Department], int]:
        query = self._active_query()

        if search:
            pattern = f"%{search}%"
            query = query.filter(
                or_(
                    Department.name.ilike(pattern),
                    Department.code.ilike(pattern),
                    Department.description.ilike(pattern),
                )
            )

        if status:
            query = query.filter(Department.status == status)

        if parent_id is not None:
            query = query.filter(Department.parent_department_id == parent_id)

        total = query.with_entities(func.count()).scalar()

        sort_col = SORT_FIELD_MAP.get(sort_by, Department.created_at)
        order_fn = asc if sort_order == SortOrder.ASC else desc
        query = query.order_by(order_fn(sort_col))

        items = query.offset(skip).limit(limit).all()
        return items, total

    def update(self, dept_id: uuid.UUID, updated_by: uuid.UUID, **kwargs) -> Optional[Department]:
        dept = self.get_by_id(dept_id)
        if not dept:
            return None
        for field, value in kwargs.items():
            if value is not None or field in ("parent_department_id", "department_head_id", "description"):
                setattr(dept, field, value)
        dept.updated_by = updated_by
        dept.updated_at = datetime.now(UTC)
        self.db.commit()
        self.db.refresh(dept)
        log.info("department.updated", id=str(dept_id))
        return dept

    def soft_delete(self, dept_id: uuid.UUID, updated_by: uuid.UUID) -> Optional[Department]:
        dept = self.get_by_id(dept_id)
        if not dept:
            return None
        dept.deleted_at = datetime.now(UTC)
        dept.updated_by = updated_by
        dept.updated_at = datetime.now(UTC)
        self.db.commit()
        self.db.refresh(dept)
        log.info("department.deleted", id=str(dept_id))
        return dept

    def has_children(self, dept_id: uuid.UUID) -> bool:
        return (
            self._active_query()
            .filter(Department.parent_department_id == dept_id)
            .count()
            > 0
        )

    def has_employees(self, dept_id: uuid.UUID) -> bool:
        dept = self.get_by_id(dept_id)
        return dept is not None and dept.employee_count > 0

    def check_name_exists(self, name: str, exclude_id: Optional[uuid.UUID] = None) -> bool:
        query = self._active_query().filter(Department.name == name)
        if exclude_id:
            query = query.filter(Department.id != exclude_id)
        return query.count() > 0

    def check_code_exists(self, code: str, exclude_id: Optional[uuid.UUID] = None) -> bool:
        query = self._active_query().filter(Department.code == code)
        if exclude_id:
            query = query.filter(Department.id != exclude_id)
        return query.count() > 0
