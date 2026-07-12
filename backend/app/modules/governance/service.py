from typing import Optional, List, Tuple
from uuid import UUID
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from .repository import GovernanceRepository
from .schemas import (
    ESGPolicyCreate, ESGPolicyUpdate,
    PolicyAcknowledgementCreate, PolicyAcknowledgementUpdate,
    AuditCreate, AuditUpdate,
    ComplianceIssueCreate, ComplianceIssueUpdate
)
from .models import ESGPolicy, PolicyAcknowledgement, Audit, ComplianceIssue

class GovernanceService:
    def __init__(self, session: Session):
        self.repo = GovernanceRepository(session)
        self.session = session

    # --- Policies ---
    def get_policies(self, skip: int = 0, limit: int = 100, search: Optional[str] = None) -> Tuple[List[ESGPolicy], int]:
        return self.repo.get_policies(skip, limit, search)

    def get_policy_by_id(self, policy_id: UUID) -> ESGPolicy:
        policy = self.repo.get_policy_by_id(policy_id)
        if not policy:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ESG Policy not found")
        return policy

    def create_policy(self, data: ESGPolicyCreate, user_id: Optional[UUID] = None) -> ESGPolicy:
        policy = self.repo.create_policy(data, user_id)
        self.session.commit()
        return policy

    def update_policy(self, policy_id: UUID, data: ESGPolicyUpdate, user_id: Optional[UUID] = None) -> ESGPolicy:
        policy = self.get_policy_by_id(policy_id)
        updated_policy = self.repo.update_policy(policy, data, user_id)
        self.session.commit()
        return updated_policy

    def delete_policy(self, policy_id: UUID, user_id: Optional[UUID] = None) -> None:
        policy = self.get_policy_by_id(policy_id)
        self.repo.delete_policy(policy, user_id)
        self.session.commit()

    # --- Audits ---
    def get_audits(self, skip: int = 0, limit: int = 100, search: Optional[str] = None) -> Tuple[List[Audit], int]:
        return self.repo.get_audits(skip, limit, search)

    def get_audit_by_id(self, audit_id: UUID) -> Audit:
        audit = self.repo.get_audit_by_id(audit_id)
        if not audit:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Audit not found")
        return audit

    def create_audit(self, data: AuditCreate) -> Audit:
        audit = self.repo.create_audit(data)
        self.session.commit()
        return audit

    def update_audit(self, audit_id: UUID, data: AuditUpdate) -> Audit:
        audit = self.get_audit_by_id(audit_id)
        updated_audit = self.repo.update_audit(audit, data)
        self.session.commit()
        return updated_audit

    def delete_audit(self, audit_id: UUID) -> None:
        audit = self.get_audit_by_id(audit_id)
        self.repo.delete_audit(audit)
        self.session.commit()
