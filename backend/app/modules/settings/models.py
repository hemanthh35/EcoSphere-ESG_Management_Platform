import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID

from app.database.base import Base

class ESGConfiguration(Base):
    __tablename__ = "esg_configurations"

    id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    environmental_weight: Mapped[float] = mapped_column(Float, default=0.4, nullable=False)
    social_weight: Mapped[float] = mapped_column(Float, default=0.3, nullable=False)
    governance_weight: Mapped[float] = mapped_column(Float, default=0.3, nullable=False)
    
    auto_carbon_calculation: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    evidence_required: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    auto_badge_award: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

class NotificationSetting(Base):
    __tablename__ = "notification_settings"

    id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    profile = relationship("Profile")

    email_alerts: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    compliance_alerts: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    challenge_updates: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    badge_milestones: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
