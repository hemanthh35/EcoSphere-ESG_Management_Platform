import uuid
import math
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.modules.department.service import DepartmentService
from app.modules.department.schemas import (
    DepartmentCreate,
    DepartmentUpdate,
    DepartmentResponse,
    PaginatedDepartmentResponse,
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

# Placeholder: In production, extract from JWT token
MOCK_USER_ID = uuid.UUID("00000000-0000-0000-0000-000000000001")


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
):
    """Create a new department."""
    try:
        dept = service.create_department(payload, created_by=MOCK_USER_ID)
        return ResponseModel.ok(data=dept, message="Department created successfully.")
    except DepartmentAlreadyExistsError as e:
        raise HTTPException(status_code=409, detail=e.message)
    except (InvalidDepartmentHierarchyError, DepartmentNotFoundError) as e:
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{dept_id}", response_model=ResponseModel[DepartmentResponse])
def get_department(
    dept_id: uuid.UUID,
    service: DepartmentService = Depends(get_service),
):
    """Retrieve a single department by ID."""
    try:
        dept = service.get_department(dept_id)
        return ResponseModel.ok(data=dept)
    except DepartmentNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{dept_id}", response_model=ResponseModel[DepartmentResponse])
def update_department(
    dept_id: uuid.UUID,
    payload: DepartmentUpdate,
    service: DepartmentService = Depends(get_service),
):
    """Update an existing department."""
    try:
        dept = service.update_department(dept_id, payload, updated_by=MOCK_USER_ID)
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
):
    """Soft-delete a department (cannot have children or employees)."""
    try:
        dept = service.delete_department(dept_id, updated_by=MOCK_USER_ID)
        return ResponseModel.ok(data=dept, message="Department deleted successfully.")
    except DepartmentNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)
    except CannotDeleteDepartmentError as e:
        raise HTTPException(status_code=409, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
