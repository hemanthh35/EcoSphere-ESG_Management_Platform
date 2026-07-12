import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, status

from app.modules.employee.schemas import (
    CreateEmployeeRequest,
    UpdateEmployeeRequest,
    EmployeeResponse,
    EmployeeDetailResponse,
    EmployeeDropdownResponse,
    EmployeeStatisticsResponse,
)
from app.modules.employee.service import EmployeeService
from app.database.session import get_db
from app.modules.auth.dependencies import get_current_user
from app.modules.auth.models import Profile, RoleEnum
from sqlalchemy.orm import Session

router = APIRouter(prefix="/employees", tags=["Employees"])

def get_employee_service(db: Session = Depends(get_db)) -> EmployeeService:
    return EmployeeService(db)

@router.get("/dropdown", response_model=List[EmployeeDropdownResponse])
def get_dropdown(
    service: EmployeeService = Depends(get_employee_service),
    current_user: Profile = Depends(get_current_user),
):
    return service.get_dropdown_list()

@router.get("/managers", response_model=List[EmployeeDropdownResponse])
def get_managers(
    service: EmployeeService = Depends(get_employee_service),
    current_user: Profile = Depends(get_current_user),
):
    return service.get_manager_list()

@router.get("/statistics", response_model=EmployeeStatisticsResponse)
def get_statistics(
    service: EmployeeService = Depends(get_employee_service),
    current_user: Profile = Depends(get_current_user),
):
    return service.get_statistics()

@router.get("/{emp_id}", response_model=EmployeeDetailResponse)
def get_employee(
    emp_id: uuid.UUID,
    service: EmployeeService = Depends(get_employee_service),
    current_user: Profile = Depends(get_current_user),
):
    # Depending on requirements, we can return joined data here or format it
    emp = service.get_employee(emp_id)
    # Just basic population for response
    setattr(emp, "department_name", emp.department.name if emp.department else None)
    setattr(emp, "manager_name", emp.manager.full_name if emp.manager else None)
    return emp

@router.get("", response_model=dict) # Returning dict because we need items and total
def list_employees(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    department_id: Optional[uuid.UUID] = Query(None),
    role: Optional[RoleEnum] = Query(None),
    service: EmployeeService = Depends(get_employee_service),
    current_user: Profile = Depends(get_current_user),
):
    items, total = service.get_all_employees(
        skip=skip,
        limit=limit,
        search=search,
        department_id=department_id,
        role=role,
    )
    
    # Map department names 
    for emp in items:
        setattr(emp, "department_name", emp.department.name if emp.department else None)
        
    # Return paginated structure
    return {
        "items": items,
        "total": total
    }

@router.post("", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(
    payload: CreateEmployeeRequest,
    service: EmployeeService = Depends(get_employee_service),
    current_user: Profile = Depends(get_current_user),
):
    emp = service.create_employee(payload, current_user.id)
    setattr(emp, "department_name", emp.department.name if emp.department else None)
    return emp

@router.put("/{emp_id}", response_model=EmployeeResponse)
def update_employee(
    emp_id: uuid.UUID,
    payload: UpdateEmployeeRequest,
    service: EmployeeService = Depends(get_employee_service),
    current_user: Profile = Depends(get_current_user),
):
    emp = service.update_employee(emp_id, payload, current_user.id)
    setattr(emp, "department_name", emp.department.name if emp.department else None)
    return emp

@router.delete("/{emp_id}", response_model=EmployeeResponse)
def delete_employee(
    emp_id: uuid.UUID,
    service: EmployeeService = Depends(get_employee_service),
    current_user: Profile = Depends(get_current_user),
):
    emp = service.delete_employee(emp_id, current_user.id)
    setattr(emp, "department_name", emp.department.name if emp.department else None)
    return emp
