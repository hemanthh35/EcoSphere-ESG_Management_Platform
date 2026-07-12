from app.modules.auth.models import RoleEnum, Profile
from fastapi import HTTPException, status

def check_can_manage_csr(user: Profile):
    if user.role not in [RoleEnum.ADMIN, RoleEnum.ESG_MANAGER]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Admins or ESG Managers can manage CSR activities."
        )

def check_can_approve_evidence(user: Profile):
    if user.role not in [RoleEnum.ADMIN, RoleEnum.ESG_MANAGER, RoleEnum.DEPARTMENT_HEAD]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Admins, ESG Managers, or Department Heads can approve participation evidence."
        )
