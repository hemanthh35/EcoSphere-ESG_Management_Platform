import uuid
import math
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.modules.auth.dependencies import get_current_user, RoleChecker
from app.modules.auth.models import Profile, RoleEnum
from app.modules.department.service import DepartmentService
from app.modules.department.schemas import (
    DepartmentCreate,
    DepartmentUpdate,
    DepartmentResponse,
    PaginatedDepartmentResponse,
    DepartmentTreeResponse,
    DepartmentDropdownResponse,
    DepartmentStatisticsResponse,
    DepartmentEmployeeResponse,
)
from app.shared.response_models import ResponseModel
from app.core.exceptions import (
    DepartmentNotFoundError,
    DepartmentAlreadyExistsError,
    InvalidDepartmentHierarchyError,
    CannotDeleteDepartmentError,
)
from app.core.constants import DepartmentSortField, SortOrder

router = APIRouter(prefix="/api/v1/departments", tags=["Departments"])


def get_service(db: Session = Depends(get_db)) -> DepartmentService:
    return DepartmentService(db)


@router.get("", response_model=ResponseModel[PaginatedDepartmentResponse])
def list_departments(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    parent_id: Optional[uuid.UUID] = Query(None),
    sort_by: DepartmentSortField = Query(DepartmentSortField.CREATED_AT),
    sort_order: SortOrder = Query(SortOrder.DESC),
    service: DepartmentService = Depends(get_service),
    current_user: Profile = Depends(get_current_user),
):
    """List departments with pagination, filtering, and searching."""
    try:
        items, total = service.list_departments(
            skip=skip,
            limit=limit,
            search=search,
            status=status,
            parent_id=parent_id,
            sort_by=sort_by,
            sort_order=sort_order,
        )
        page = (skip // limit) + 1
        total_pages = math.ceil(total / limit) if limit else 1
        return ResponseModel.ok(
            data=PaginatedDepartmentResponse(
                items=items,
                total=total,
                page=page,
                page_size=limit,
                total_pages=total_pages,
            )
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("", response_model=ResponseModel[DepartmentResponse], status_code=status.HTTP_201_CREATED)
def create_department(
    payload: DepartmentCreate,
    service: DepartmentService = Depends(get_service),
    current_user: Profile = Depends(RoleChecker([RoleEnum.ADMIN, RoleEnum.ESG_MANAGER])),
):
    """Create a new department."""
    try:
        dept = service.create_department(payload, created_by=current_user.id)
        return ResponseModel.ok(data=dept, message="Department created successfully.")
    except DepartmentAlreadyExistsError as e:
        raise HTTPException(status_code=409, detail=e.message)
    except (InvalidDepartmentHierarchyError, DepartmentNotFoundError) as e:
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tree", response_model=ResponseModel[list[DepartmentTreeResponse]])
def get_department_tree(
    service: DepartmentService = Depends(get_service),
    current_user: Profile = Depends(get_current_user),
):
    """Retrieve the full department hierarchy tree."""
    try:
        tree = service.get_department_tree()
        return ResponseModel.ok(data=tree)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/dropdown", response_model=ResponseModel[list[DepartmentDropdownResponse]])
def get_department_dropdown(
    service: DepartmentService = Depends(get_service),
    current_user: Profile = Depends(get_current_user),
):
    """Retrieve active departments for dropdown selection."""
    try:
        data = service.get_dropdown_list()
        return ResponseModel.ok(data=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/statistics", response_model=ResponseModel[DepartmentStatisticsResponse])
def get_department_statistics(
    service: DepartmentService = Depends(get_service),
    current_user: Profile = Depends(get_current_user),
):
    """Retrieve department summary statistics."""
    try:
        stats = service.get_statistics()
        return ResponseModel.ok(data=stats)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{dept_id}", response_model=ResponseModel[DepartmentResponse])
def get_department(
    dept_id: uuid.UUID,
    service: DepartmentService = Depends(get_service),
    current_user: Profile = Depends(get_current_user),
):
    """Retrieve a single department by ID."""
    try:
        dept = service.get_department(dept_id)
        return ResponseModel.ok(data=dept)
    except DepartmentNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{dept_id}/employees", response_model=ResponseModel[list[DepartmentEmployeeResponse]])
def get_department_employees(
    dept_id: uuid.UUID,
    service: DepartmentService = Depends(get_service),
    current_user: Profile = Depends(get_current_user),
):
    """Retrieve all employees belonging to a department."""
    try:
        employees = service.get_employees(dept_id)
        return ResponseModel.ok(data=employees)
    except DepartmentNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{dept_id}/children", response_model=ResponseModel[list[DepartmentResponse]])
def get_department_children(
    dept_id: uuid.UUID,
    service: DepartmentService = Depends(get_service),
    current_user: Profile = Depends(get_current_user),
):
    """Retrieve all direct child departments."""
    try:
        children = service.get_children(dept_id)
        return ResponseModel.ok(data=children)
    except DepartmentNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@router.put("/{dept_id}", response_model=ResponseModel[DepartmentResponse])
def update_department(
    dept_id: uuid.UUID,
    payload: DepartmentUpdate,
    service: DepartmentService = Depends(get_service),
    current_user: Profile = Depends(RoleChecker([RoleEnum.ADMIN, RoleEnum.ESG_MANAGER])),
):
    """Update an existing department."""
    try:
        dept = service.update_department(dept_id, payload, updated_by=current_user.id)
        return ResponseModel.ok(data=dept, message="Department updated successfully.")
    except DepartmentNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)
    except DepartmentAlreadyExistsError as e:
        raise HTTPException(status_code=409, detail=e.message)
    except InvalidDepartmentHierarchyError as e:
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{dept_id}", response_model=ResponseModel[DepartmentResponse])
def delete_department(
    dept_id: uuid.UUID,
    service: DepartmentService = Depends(get_service),
    current_user: Profile = Depends(RoleChecker([RoleEnum.ADMIN])),
):
    """Soft-delete a department (cannot have children or employees)."""
    try:
        dept = service.delete_department(dept_id, updated_by=current_user.id)
        return ResponseModel.ok(data=dept, message="Department deleted successfully.")
    except DepartmentNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)
    except CannotDeleteDepartmentError as e:
        raise HTTPException(status_code=409, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
