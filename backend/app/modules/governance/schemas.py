from typing import Optional, List
from datetime import datetime, date
from uuid import UUID
from pydantic import BaseModel, Field

from .models import PolicyStatusEnum, AcknowledgementStatusEnum, AuditStatusEnum, IssueSeverityEnum, IssueStatusEnum

# --- ESG Policy Schemas ---
class ESGPolicyBase(BaseModel):
    policy_code: str = Field(..., max_length=50)
    title: str = Field(..., max_length=255)
    version: str = Field(..., max_length=20)
    department_id: UUID
    description: Optional[str] = None
    effective_date: date
    expiry_date: Optional[date] = None
    attachment_url: Optional[str] = None
    status: PolicyStatusEnum = PolicyStatusEnum.DRAFT

class ESGPolicyCreate(ESGPolicyBase):
    pass

class ESGPolicyUpdate(BaseModel):
    title: Optional[str] = None
    version: Optional[str] = None
    department_id: Optional[UUID] = None
    description: Optional[str] = None
    effective_date: Optional[date] = None
    expiry_date: Optional[date] = None
    attachment_url: Optional[str] = None
    status: Optional[PolicyStatusEnum] = None

class ESGPolicyResponse(ESGPolicyBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    created_by: Optional[UUID] = None
    updated_by: Optional[UUID] = None

    class Config:
        from_attributes = True

# --- Policy Acknowledgement Schemas ---
class PolicyAcknowledgementBase(BaseModel):
    policy_id: UUID
    employee_id: UUID
    status: AcknowledgementStatusEnum = AcknowledgementStatusEnum.PENDING
    remarks: Optional[str] = None

class PolicyAcknowledgementCreate(PolicyAcknowledgementBase):
    pass

class PolicyAcknowledgementUpdate(BaseModel):
    status: Optional[AcknowledgementStatusEnum] = None
    remarks: Optional[str] = None
    acknowledged_at: Optional[datetime] = None

class PolicyAcknowledgementResponse(PolicyAcknowledgementBase):
    id: UUID
    acknowledged_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Audit Schemas ---
class AuditBase(BaseModel):
    audit_code: str = Field(..., max_length=50)
    title: str = Field(..., max_length=255)
    department_id: UUID
    auditor_id: Optional[UUID] = None
    start_date: date
    end_date: Optional[date] = None
    findings: Optional[str] = None
    status: AuditStatusEnum = AuditStatusEnum.PLANNED

class AuditCreate(AuditBase):
    pass

class AuditUpdate(BaseModel):
    title: Optional[str] = None
    department_id: Optional[UUID] = None
    auditor_id: Optional[UUID] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    findings: Optional[str] = None
    status: Optional[AuditStatusEnum] = None

class AuditResponse(AuditBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# --- Compliance Issue Schemas ---
class ComplianceIssueBase(BaseModel):
    title: str = Field(..., max_length=255)
    description: str
    audit_id: UUID
    severity: IssueSeverityEnum = IssueSeverityEnum.MEDIUM
    owner_id: Optional[UUID] = None
    due_date: date
    resolution: Optional[str] = None
    status: IssueStatusEnum = IssueStatusEnum.OPEN

class ComplianceIssueCreate(ComplianceIssueBase):
    pass

class ComplianceIssueUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[IssueSeverityEnum] = None
    owner_id: Optional[UUID] = None
    due_date: Optional[date] = None
    resolution: Optional[str] = None
    status: Optional[IssueStatusEnum] = None

class ComplianceIssueResponse(ComplianceIssueBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# --- Paginated Responses ---
class PaginatedPolicyResponse(BaseModel):
    items: List[ESGPolicyResponse]
    total: int
    skip: int
    limit: int

class PaginatedAuditResponse(BaseModel):
    items: List[AuditResponse]
    total: int
    skip: int
    limit: int
