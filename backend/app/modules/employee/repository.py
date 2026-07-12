import uuid
from typing import List, Tuple, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from app.modules.auth.models import Profile, RoleEnum, StatusEnum
from app.modules.department.models import Department

class EmployeeRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_employee(self, emp_id: uuid.UUID) -> Optional[Profile]:
        return self.db.query(Profile).filter(Profile.id == emp_id, Profile.is_deleted == False).first()

    def get_all_employees(
        self, skip: int = 0, limit: int = 20, search: str = None, department_id: uuid.UUID = None, role: RoleEnum = None
    ) -> Tuple[List[Profile], int]:
        query = self.db.query(Profile).filter(Profile.is_deleted == False)

        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    Profile.full_name.ilike(search_term),
                    Profile.email.ilike(search_term),
                    Profile.employee_code.ilike(search_term),
                )
            )

        if department_id:
            query = query.filter(Profile.department_id == department_id)
            
        if role:
            query = query.filter(Profile.role == role)

        total = query.count()
        # Order by newest first
        employees = query.order_by(Profile.created_at.desc()).offset(skip).limit(limit).all()
        return employees, total

    def get_dropdown(self) -> List[Profile]:
        return self.db.query(Profile).filter(Profile.is_deleted == False, Profile.status == StatusEnum.ACTIVE).order_by(Profile.full_name).all()

    def get_manager_list(self) -> List[Profile]:
        return self.db.query(Profile).filter(
            Profile.is_deleted == False, 
            Profile.status == StatusEnum.ACTIVE
        ).order_by(Profile.full_name).all()

    def create_employee(self, profile: Profile) -> Profile:
        self.db.add(profile)
        self.db.commit()
        self.db.refresh(profile)
        return profile

    def update_employee(self, profile: Profile) -> Profile:
        self.db.commit()
        self.db.refresh(profile)
        return profile

    def get_statistics(self) -> dict:
        total = self.db.query(Profile).filter(Profile.is_deleted == False).count()
        active = self.db.query(Profile).filter(Profile.is_deleted == False, Profile.status == StatusEnum.ACTIVE).count()
        inactive = total - active
        
        # Group by department using string representation to handle nulls
        dept_stats = self.db.query(Department.name, func.count(Profile.id))\
            .join(Profile, Profile.department_id == Department.id)\
            .filter(Profile.is_deleted == False)\
            .group_by(Department.name).all()
            
        by_department = {name: count for name, count in dept_stats}
        
        return {
            "total": total,
            "active": active,
            "inactive": inactive,
            "by_department": by_department
        }
