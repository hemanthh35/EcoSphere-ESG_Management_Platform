import uuid
import structlog
from typing import Optional, Tuple, List
from sqlalchemy.orm import Session

from app.modules.department.repository import DepartmentRepository
from app.modules.department.schemas import (
    DepartmentCreate,
    DepartmentUpdate,
    DepartmentResponse,
    DepartmentListItem,
)
from app.core.exceptions import (
    DepartmentNotFoundError,
    DepartmentAlreadyExistsError,
    InvalidDepartmentHierarchyError,
    CannotDeleteDepartmentError,
)
from app.core.constants import DepartmentSortField, SortOrder, MAX_HIERARCHY_DEPTH

log = structlog.get_logger()


class DepartmentService:
    def __init__(self, db: Session):
        self.repo = DepartmentRepository(db)

    def _validate_hierarchy(self, dept_id: Optional[uuid.UUID], parent_id: uuid.UUID) -> None:
        """Walk up the hierarchy from parent_id to detect cycles or excessive depth."""
        visited: set[uuid.UUID] = set()
        current_id: Optional[uuid.UUID] = parent_id

        for _ in range(MAX_HIERARCHY_DEPTH):
            if current_id is None:
                return  # Reached root, no cycle
            if dept_id and current_id == dept_id:
                raise InvalidDepartmentHierarchyError("Circular reference detected in department hierarchy.")
            if current_id in visited:
                raise InvalidDepartmentHierarchyError("Circular reference detected in department hierarchy.")
            visited.add(current_id)

            parent = self.repo.get_by_id(current_id)
            if parent is None:
                raise InvalidDepartmentHierarchyError(f"Parent department '{current_id}' does not exist.")
            current_id = parent.parent_department_id

        raise InvalidDepartmentHierarchyError("Department hierarchy exceeds maximum allowed depth of 10 levels.")

    def create_department(
        self, payload: DepartmentCreate, created_by: uuid.UUID
    ) -> DepartmentResponse:
        log.info("service.department.create", code=payload.code)

        if self.repo.check_name_exists(payload.name):
            raise DepartmentAlreadyExistsError("name", payload.name)

        if self.repo.check_code_exists(payload.code):
            raise DepartmentAlreadyExistsError("code", payload.code)

        if payload.parent_department_id:
            self._validate_hierarchy(None, payload.parent_department_id)

        dept = self.repo.create(
            name=payload.name,
            code=payload.code,
            created_by=created_by,
            description=payload.description,
            parent_department_id=payload.parent_department_id,
            department_head_id=payload.department_head_id,
            employee_count=payload.employee_count,
            status=payload.status.value,
        )
        return DepartmentResponse.model_validate(dept)

    def get_department(self, dept_id: uuid.UUID) -> DepartmentResponse:
        dept = self.repo.get_by_id(dept_id)
        if not dept:
            raise DepartmentNotFoundError(str(dept_id))
        return DepartmentResponse.model_validate(dept)

    def list_departments(
        self,
        skip: int = 0,
        limit: int = 20,
        search: Optional[str] = None,
        status: Optional[str] = None,
        parent_id: Optional[uuid.UUID] = None,
        sort_by: DepartmentSortField = DepartmentSortField.CREATED_AT,
        sort_order: SortOrder = SortOrder.DESC,
    ) -> Tuple[List[DepartmentListItem], int]:
        depts, total = self.repo.list_active(
            skip=skip,
            limit=limit,
            search=search,
            status=status,
            parent_id=parent_id,
            sort_by=sort_by,
            sort_order=sort_order,
        )
        return [DepartmentListItem.model_validate(d) for d in depts], total

    def update_department(
        self, dept_id: uuid.UUID, payload: DepartmentUpdate, updated_by: uuid.UUID
    ) -> DepartmentResponse:
        log.info("service.department.update", id=str(dept_id))
        existing = self.repo.get_by_id(dept_id)
        if not existing:
            raise DepartmentNotFoundError(str(dept_id))

        if payload.name and self.repo.check_name_exists(payload.name, exclude_id=dept_id):
            raise DepartmentAlreadyExistsError("name", payload.name)

        if payload.code and self.repo.check_code_exists(payload.code, exclude_id=dept_id):
            raise DepartmentAlreadyExistsError("code", payload.code)

        if payload.parent_department_id:
            self._validate_hierarchy(dept_id, payload.parent_department_id)

        update_data = payload.model_dump(exclude_unset=True)
        if "status" in update_data and update_data["status"]:
            update_data["status"] = update_data["status"].value

        dept = self.repo.update(dept_id, updated_by=updated_by, **update_data)
        return DepartmentResponse.model_validate(dept)

    def delete_department(self, dept_id: uuid.UUID, updated_by: uuid.UUID) -> DepartmentResponse:
        log.info("service.department.delete", id=str(dept_id))
        existing = self.repo.get_by_id(dept_id)
        if not existing:
            raise DepartmentNotFoundError(str(dept_id))

        if self.repo.has_children(dept_id):
            raise CannotDeleteDepartmentError("Department has child departments. Reassign or delete them first.")

        if self.repo.has_employees(dept_id):
            raise CannotDeleteDepartmentError("Department has assigned employees. Reassign them first.")

        dept = self.repo.soft_delete(dept_id, updated_by=updated_by)
        return DepartmentResponse.model_validate(dept)

    def get_department_tree(self) -> List[dict]:
        return self.repo.get_department_tree()

    def get_dropdown_list(self) -> List[dict]:
        return self.repo.get_dropdown_list()

    def get_statistics(self) -> dict:
        return self.repo.get_statistics()

    def get_employees(self, dept_id: uuid.UUID) -> List[dict]:
        existing = self.repo.get_by_id(dept_id)
        if not existing:
            raise DepartmentNotFoundError(str(dept_id))
        employees = self.repo.get_employees(dept_id)
        return [
            {
                "id": emp.id,
                "full_name": emp.full_name,
                "email": emp.email,
                "designation": emp.designation,
                "status": emp.status.value,
            }
            for emp in employees
        ]

    def get_children(self, dept_id: uuid.UUID) -> List[DepartmentResponse]:
        existing = self.repo.get_by_id(dept_id)
        if not existing:
            raise DepartmentNotFoundError(str(dept_id))
        children = self.repo.get_children(dept_id)
        return [DepartmentResponse.model_validate(c) for c in children]
