from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import Optional
from uuid import UUID

from app.database.session import get_db
from app.modules.auth.dependencies import get_current_user
from app.modules.auth.models import Profile
from .schemas import (
    ESGPolicyCreate, ESGPolicyUpdate, ESGPolicyResponse, PaginatedPolicyResponse,
    AuditCreate, AuditUpdate, AuditResponse, PaginatedAuditResponse,
    PaginatedAcknowledgementResponse, PaginatedComplianceIssueResponse
)
from .service import GovernanceService

router = APIRouter(prefix="/governance", tags=["governance"])

def get_governance_service(db: Session = Depends(get_db)) -> GovernanceService:
    return GovernanceService(db)

# --- ESG Policies ---
@router.get("/policies", response_model=PaginatedPolicyResponse)
def get_policies(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: Optional[str] = None,
    service: GovernanceService = Depends(get_governance_service),
    current_user: Profile = Depends(get_current_user)
):
    items, total = service.get_policies(skip, limit, search)
    return PaginatedPolicyResponse(items=items, total=total, skip=skip, limit=limit)

@router.get("/policies/{policy_id}", response_model=ESGPolicyResponse)
def get_policy(
    policy_id: UUID,
    service: GovernanceService = Depends(get_governance_service),
    current_user: Profile = Depends(get_current_user)
):
    return service.get_policy_by_id(policy_id)

@router.post("/policies", response_model=ESGPolicyResponse, status_code=status.HTTP_201_CREATED)
def create_policy(
    data: ESGPolicyCreate,
    service: GovernanceService = Depends(get_governance_service),
    current_user: Profile = Depends(get_current_user)
):
    return service.create_policy(data, current_user.id)

@router.put("/policies/{policy_id}", response_model=ESGPolicyResponse)
def update_policy(
    policy_id: UUID,
    data: ESGPolicyUpdate,
    service: GovernanceService = Depends(get_governance_service),
    current_user: Profile = Depends(get_current_user)
):
    return service.update_policy(policy_id, data, current_user.id)

@router.delete("/policies/{policy_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_policy(
    policy_id: UUID,
    service: GovernanceService = Depends(get_governance_service),
    current_user: Profile = Depends(get_current_user)
):
    service.delete_policy(policy_id, current_user.id)

# --- Audits ---
@router.get("/audits", response_model=PaginatedAuditResponse)
def get_audits(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: Optional[str] = None,
    service: GovernanceService = Depends(get_governance_service),
    current_user: Profile = Depends(get_current_user)
):
    items, total = service.get_audits(skip, limit, search)
    return PaginatedAuditResponse(items=items, total=total, skip=skip, limit=limit)

@router.get("/audits/{audit_id}", response_model=AuditResponse)
def get_audit(
    audit_id: UUID,
    service: GovernanceService = Depends(get_governance_service),
    current_user: Profile = Depends(get_current_user)
):
    return service.get_audit_by_id(audit_id)

@router.post("/audits", response_model=AuditResponse, status_code=status.HTTP_201_CREATED)
def create_audit(
    data: AuditCreate,
    service: GovernanceService = Depends(get_governance_service),
    current_user: Profile = Depends(get_current_user)
):
    return service.create_audit(data)

@router.put("/audits/{audit_id}", response_model=AuditResponse)
def update_audit(
    audit_id: UUID,
    data: AuditUpdate,
    service: GovernanceService = Depends(get_governance_service),
    current_user: Profile = Depends(get_current_user)
):
    return service.update_audit(audit_id, data)

@router.delete("/audits/{audit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_audit(
    audit_id: UUID,
    service: GovernanceService = Depends(get_governance_service),
    current_user: Profile = Depends(get_current_user)
):
    service.delete_audit(audit_id)

# --- Policy Acknowledgements ---
@router.get("/acknowledgements", response_model=PaginatedAcknowledgementResponse)
def get_acknowledgements(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: Optional[str] = None,
    service: GovernanceService = Depends(get_governance_service),
    current_user: Profile = Depends(get_current_user)
):
    items, total = service.get_acknowledgements(skip, limit, search)
    return PaginatedAcknowledgementResponse(items=items, total=total, skip=skip, limit=limit)

# --- Compliance Issues ---
@router.get("/compliance-issues", response_model=PaginatedComplianceIssueResponse)
def get_compliance_issues(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: Optional[str] = None,
    service: GovernanceService = Depends(get_governance_service),
    current_user: Profile = Depends(get_current_user)
):
    items, total = service.get_compliance_issues(skip, limit, search)
    return PaginatedComplianceIssueResponse(items=items, total=total, skip=skip, limit=limit)
