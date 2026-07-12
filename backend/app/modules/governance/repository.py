from typing import List, Tuple, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import select, func, or_
from datetime import datetime, timezone

from .models import ESGPolicy, PolicyAcknowledgement, Audit, ComplianceIssue
from .schemas import (
    ESGPolicyCreate, ESGPolicyUpdate,
    PolicyAcknowledgementCreate, PolicyAcknowledgementUpdate,
    AuditCreate, AuditUpdate,
    ComplianceIssueCreate, ComplianceIssueUpdate
)

class GovernanceRepository:
    def __init__(self, session: Session):
        self.session = session

    # --- ESG Policies ---
    def get_policies(self, skip: int = 0, limit: int = 100, search: Optional[str] = None) -> Tuple[List[ESGPolicy], int]:
        query = select(ESGPolicy).where(ESGPolicy.is_deleted == False)
        
        if search:
            query = query.where(
                or_(
                    ESGPolicy.title.ilike(f"%{search}%"),
                    ESGPolicy.policy_code.ilike(f"%{search}%")
                )
            )

        total = self.session.scalar(select(func.count()).select_from(query.subquery())) or 0
        items = self.session.scalars(query.offset(skip).limit(limit)).all()
        return list(items), total

    def get_policy_by_id(self, policy_id: UUID) -> Optional[ESGPolicy]:
        return self.session.scalar(
            select(ESGPolicy).where(ESGPolicy.id == policy_id, ESGPolicy.is_deleted == False)
        )

    def create_policy(self, data: ESGPolicyCreate, user_id: Optional[UUID] = None) -> ESGPolicy:
        policy = ESGPolicy(**data.model_dump())
        policy.created_by = user_id
        policy.updated_by = user_id
        self.session.add(policy)
        self.session.flush()
        return policy

    def update_policy(self, policy: ESGPolicy, data: ESGPolicyUpdate, user_id: Optional[UUID] = None) -> ESGPolicy:
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(policy, key, value)
        policy.updated_by = user_id
        self.session.flush()
        return policy

    def delete_policy(self, policy: ESGPolicy, user_id: Optional[UUID] = None) -> None:
        policy.is_deleted = True
        policy.deleted_at = datetime.now(timezone.utc)
        policy.updated_by = user_id
        self.session.flush()

    # --- Audits ---
    def get_audits(self, skip: int = 0, limit: int = 100, search: Optional[str] = None) -> Tuple[List[Audit], int]:
        query = select(Audit)
        if search:
            query = query.where(
                or_(
                    Audit.title.ilike(f"%{search}%"),
                    Audit.audit_code.ilike(f"%{search}%")
                )
            )

        total = self.session.scalar(select(func.count()).select_from(query.subquery())) or 0
        items = self.session.scalars(query.offset(skip).limit(limit)).all()
        return list(items), total

    def get_audit_by_id(self, audit_id: UUID) -> Optional[Audit]:
        return self.session.get(Audit, audit_id)

    def create_audit(self, data: AuditCreate) -> Audit:
        audit = Audit(**data.model_dump())
        self.session.add(audit)
        self.session.flush()
        return audit

    def update_audit(self, audit: Audit, data: AuditUpdate) -> Audit:
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(audit, key, value)
        self.session.flush()
        return audit

    def delete_audit(self, audit: Audit) -> None:
        self.session.delete(audit)
        self.session.flush()
