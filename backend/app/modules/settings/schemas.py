from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class ESGConfigurationBase(BaseModel):
    environmental_weight: float = 0.4
    social_weight: float = 0.3
    governance_weight: float = 0.3
    auto_carbon_calculation: bool = True
    evidence_required: bool = True
    auto_badge_award: bool = True

class ESGConfigurationUpdate(BaseModel):
    environmental_weight: float
    social_weight: float
    governance_weight: float
    auto_carbon_calculation: bool
    evidence_required: bool
    auto_badge_award: bool

class ESGConfigurationResponse(ESGConfigurationBase):
    id: UUID
    updated_at: datetime

    class Config:
        from_attributes = True

class NotificationSettingBase(BaseModel):
    email_alerts: bool = True
    compliance_alerts: bool = True
    challenge_updates: bool = True
    badge_milestones: bool = True

class NotificationSettingUpdate(NotificationSettingBase):
    pass

class NotificationSettingResponse(NotificationSettingBase):
    id: UUID
    profile_id: UUID
    updated_at: datetime

    class Config:
        from_attributes = True
