from typing import List, Callable
from fastapi import Depends
from app.modules.auth.dependencies import get_current_user
from app.modules.auth.models import Profile, RoleEnum
from app.modules.auth.exceptions import UnauthorizedException

def role_required(allowed_roles: List[RoleEnum]) -> Callable:
    """
    Dependency to verify that the current user has one of the allowed roles.
    """
    def role_verifier(current_user: Profile = Depends(get_current_user)) -> Profile:
        if current_user.role not in allowed_roles:
            raise UnauthorizedException(detail=f"Role '{current_user.role.value}' is not authorized to access this resource")
        return current_user
    return role_verifier

def require_admin(current_user: Profile = Depends(get_current_user)) -> Profile:
    if current_user.role != RoleEnum.ADMIN:
        raise UnauthorizedException(detail="Admin access required")
    return current_user

def require_esg_manager(current_user: Profile = Depends(get_current_user)) -> Profile:
    allowed = [RoleEnum.ADMIN, RoleEnum.ESG_MANAGER]
    if current_user.role not in allowed:
        raise UnauthorizedException(detail="ESG Manager access required")
    return current_user

# Note: More granular permission guards (e.g., Can Manage Departments, Can Create CSR)
# can be added here once a permissions table/system is implemented, 
# or mapped statically to roles.
