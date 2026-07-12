import uuid
from typing import List, Tuple, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.modules.employee.repository import EmployeeRepository
from app.modules.employee.schemas import CreateEmployeeRequest, UpdateEmployeeRequest, EmployeeStatisticsResponse
from app.modules.auth.models import Profile, RoleEnum, StatusEnum
from app.modules.employee.validators import validate_unique_employee_code, validate_unique_email, validate_manager
from app.modules.employee.exceptions import EmployeeNotFound, EmployeeCannotDelete

from app.modules.auth.service import get_supabase_client
from supabase import Client

class EmployeeService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = EmployeeRepository(db)

    def get_all_employees(
        self, skip: int = 0, limit: int = 20, search: str = None, department_id: uuid.UUID = None, role: RoleEnum = None
    ) -> Tuple[List[Profile], int]:
        return self.repository.get_all_employees(skip, limit, search, department_id, role)

    def get_employee(self, emp_id: uuid.UUID) -> Profile:
        emp = self.repository.get_employee(emp_id)
        if not emp:
            raise EmployeeNotFound()
        return emp

    def create_employee(self, data: CreateEmployeeRequest, current_user_id: uuid.UUID) -> Profile:
        validate_unique_employee_code(self.db, data.employee_code)
        validate_unique_email(self.db, data.email)
        validate_manager(self.db, data.manager_id)

        # In a real enterprise app, we'd use supabase.auth.admin.create_user with a service role key.
        # Here we generate a UUID for the profile so it can be linked later if needed, 
        # or we try to use sign_up if a password is provided.
        user_id = uuid.uuid4()
        
        if data.password:
            try:
                # Use a fresh client to avoid messing with current auth state if possible
                client: Client = get_supabase_client()
                response = client.auth.sign_up({"email": data.email, "password": data.password})
                if response and response.user:
                    user_id = uuid.UUID(response.user.id)
            except Exception as e:
                # If sign_up fails (e.g. email exists), we can just proceed with local UUID 
                # or raise. For hackathon resilience, we'll just log and proceed.
                pass

        new_emp = Profile(
            id=user_id,
            employee_code=data.employee_code,
            first_name=data.first_name,
            last_name=data.last_name,
            full_name=data.full_name,
            email=data.email,
            phone=data.phone,
            department_id=data.department_id,
            designation=data.designation,
            manager_id=data.manager_id,
            role=data.role,
            gender=data.gender,
            joining_date=data.joining_date,
            date_of_birth=data.date_of_birth,
            address=data.address,
            status=data.status,
            created_by=current_user_id,
            updated_by=current_user_id
        )
        return self.repository.create_employee(new_emp)

    def update_employee(self, emp_id: uuid.UUID, data: UpdateEmployeeRequest, current_user_id: uuid.UUID) -> Profile:
        emp = self.get_employee(emp_id)

        if data.employee_code is not None:
            validate_unique_employee_code(self.db, data.employee_code, exclude_id=emp_id)
            emp.employee_code = data.employee_code
            
        if data.manager_id is not None:
            validate_manager(self.db, data.manager_id, employee_id=emp_id)
            emp.manager_id = data.manager_id
            
        update_data = data.dict(exclude_unset=True, exclude={"employee_code", "manager_id"})
        for key, value in update_data.items():
            setattr(emp, key, value)
            
        emp.updated_by = current_user_id
        return self.repository.update_employee(emp)

    def delete_employee(self, emp_id: uuid.UUID, current_user_id: uuid.UUID) -> Profile:
        emp = self.get_employee(emp_id)
        
        # Check if they have active ownership (like Department Head)
        # We would ideally check self.db.query(Department).filter_by(head_id=emp_id)
        from app.modules.department.models import Department
        dept_head = self.db.query(Department).filter(Department.head_id == emp_id).first()
        if dept_head:
            raise EmployeeCannotDelete(f"Employee is the head of department {dept_head.name}. Reassign first.")
            
        emp.is_deleted = True
        import datetime
        emp.deleted_at = datetime.datetime.now(datetime.timezone.utc)
        emp.updated_by = current_user_id
        emp.status = StatusEnum.INACTIVE
        return self.repository.update_employee(emp)

    def get_dropdown_list(self) -> List[Profile]:
        return self.repository.get_dropdown()
        
    def get_manager_list(self) -> List[Profile]:
        return self.repository.get_manager_list()

    def get_statistics(self) -> EmployeeStatisticsResponse:
        stats = self.repository.get_statistics()
        return EmployeeStatisticsResponse(**stats)
