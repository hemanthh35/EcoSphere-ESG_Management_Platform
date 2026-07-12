import uuid
from sqlalchemy.orm import Session
from app.modules.auth.models import Profile, StatusEnum
from app.modules.employee.exceptions import DuplicateEmployeeCode, DuplicateEmail, InvalidManager

def validate_unique_employee_code(db: Session, code: str, exclude_id: uuid.UUID = None):
    if not code:
        return
    query = db.query(Profile).filter(Profile.employee_code == code, Profile.is_deleted == False)
    if exclude_id:
        query = query.filter(Profile.id != exclude_id)
    if query.first():
        raise DuplicateEmployeeCode()

def validate_unique_email(db: Session, email: str, exclude_id: uuid.UUID = None):
    query = db.query(Profile).filter(Profile.email == email, Profile.is_deleted == False)
    if exclude_id:
        query = query.filter(Profile.id != exclude_id)
    if query.first():
        raise DuplicateEmail()

def validate_manager(db: Session, manager_id: uuid.UUID, employee_id: uuid.UUID = None):
    if not manager_id:
        return
    if manager_id == employee_id:
        raise InvalidManager()
    
    manager = db.query(Profile).filter(Profile.id == manager_id, Profile.is_deleted == False).first()
    if not manager or manager.status != StatusEnum.ACTIVE:
        raise InvalidManager()
