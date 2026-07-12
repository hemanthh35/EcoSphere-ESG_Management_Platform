from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime, date
from typing import List, Optional

class ReportFilterParams(BaseModel):
    department_id: Optional[UUID] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class EnvironmentalReportResponse(BaseModel):
    total_co2_reduction: float
    total_energy_saved: float
    total_water_conserved: float
    total_waste_recycled: float
    goals_progress: List[dict]
    monthly_trend: Optional[List[dict]] = None

class SocialReportResponse(BaseModel):
    total_csr_hours: float
    csr_participation_count: int
    average_diversity_score: float
    training_completion_rate: float
    active_csr_initiatives: List[dict]

class GovernanceReportResponse(BaseModel):
    active_policies_count: int
    total_audits_count: int
    completed_audits_count: int
    open_compliance_issues_count: int
    compliance_issues: List[dict]

class ESGSummaryReportResponse(BaseModel):
    overall_esg_score: float
    environmental_score: float
    social_score: float
    governance_score: float
    weights: dict
    department_scores: List[dict]

class ReportTemplateBase(BaseModel):
    name: str = Field(..., max_length=255)
    description: Optional[str] = None
    config: dict = Field(default_factory=dict)

class ReportTemplateCreate(ReportTemplateBase):
    pass

class ReportTemplateResponse(ReportTemplateBase):
    id: UUID
    created_at: datetime
    created_by: UUID

    class Config:
        from_attributes = True

class ExportAuditLogResponse(BaseModel):
    id: UUID
    report_type: str
    export_format: str
    exported_at: datetime
    exported_by: UUID

    class Config:
        from_attributes = True
