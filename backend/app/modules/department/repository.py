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
    ) -> Tuple[List[dict], int]:
        from app.modules.auth.models import Profile
        from sqlalchemy.orm import aliased

        ParentDept = aliased(Department)

        query = self.db.query(
            Department,
            Profile.full_name.label("department_head_name"),
            ParentDept.name.label("parent_department_name")
        ).outerjoin(
            Profile, Department.department_head_id == Profile.id
        ).outerjoin(
            ParentDept, Department.parent_department_id == ParentDept.id
        ).filter(Department.deleted_at.is_(None))

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
        
        results = []
        for dept, head_name, parent_name in items:
            dept_dict = {
                "id": dept.id,
                "name": dept.name,
                "code": dept.code,
                "status": dept.status,
                "employee_count": dept.employee_count,
                "parent_department_id": dept.parent_department_id,
                "department_head_name": head_name,
                "parent_department_name": parent_name,
                "created_at": dept.created_at,
                "updated_at": dept.updated_at,
            }
            results.append(dept_dict)

        return results, total

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

    def get_department_tree(self) -> List[dict]:
        """Build a hierarchical tree of departments."""
        departments = self._active_query().all()
        dept_dict = {dept.id: {
            "id": dept.id, "name": dept.name, "code": dept.code, 
            "status": dept.status, "employee_count": dept.employee_count, 
            "parent_department_id": dept.parent_department_id, "children": []
        } for dept in departments}

        tree = []
        for dept in departments:
            node = dept_dict[dept.id]
            if dept.parent_department_id and dept.parent_department_id in dept_dict:
                dept_dict[dept.parent_department_id]["children"].append(node)
            else:
                tree.append(node)
        return tree

    def get_dropdown_list(self) -> List[dict]:
        """Get minimal department info for dropdowns (active only)."""
        res = self._active_query().filter(Department.status == "ACTIVE").with_entities(
            Department.id, Department.name, Department.code
        ).all()
        return [{"id": r[0], "name": r[1], "code": r[2]} for r in res]

    def get_statistics(self) -> dict:
        """Get dashboard statistics for departments."""
        total = self._active_query().count()
        active = self._active_query().filter(Department.status == "ACTIVE").count()
        inactive = self._active_query().filter(Department.status == "INACTIVE").count()
        total_employees = self.db.query(func.sum(Department.employee_count)).filter(Department.deleted_at.is_(None)).scalar() or 0
        return {
            "total_departments": total,
            "active_departments": active,
            "inactive_departments": inactive,
            "total_employees": total_employees
        }

    def get_employees(self, dept_id: uuid.UUID) -> List[dict]:
        """Get employees assigned to this department."""
        from app.modules.auth.models import Profile
        return self.db.query(Profile).filter(Profile.department_id == dept_id).all()

    def get_children(self, dept_id: uuid.UUID) -> List[Department]:
        """Get direct child departments."""
        return self._active_query().filter(Department.parent_department_id == dept_id).all()

