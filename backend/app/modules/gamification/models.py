import uuid
from datetime import datetime, date, timezone
from typing import Optional
from sqlalchemy import String, Integer, DateTime, Date, ForeignKey, Text, Enum, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
import enum

from app.database.base import Base

class ChallengeDifficultyEnum(str, enum.Enum):
    EASY = "EASY"
    MEDIUM = "MEDIUM"
    HARD = "HARD"

class ChallengeStatusEnum(str, enum.Enum):
    ACTIVE = "ACTIVE"
    UPCOMING = "UPCOMING"
    COMPLETED = "COMPLETED"
    ARCHIVED = "ARCHIVED"

class ParticipationStatusEnum(str, enum.Enum):
    IN_PROGRESS = "IN_PROGRESS"
    PENDING_APPROVAL = "PENDING_APPROVAL"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class Challenge(Base):
    __tablename__ = "challenges"

    id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    challenge_code: Mapped[str] = mapped_column(String(50), nullable=False, unique=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    
    category_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("categories.id", ondelete="RESTRICT"), nullable=False, index=True)
    category = relationship("Category")
    
    xp_points: Mapped[int] = mapped_column(Integer, nullable=False, default=100)
    difficulty: Mapped[ChallengeDifficultyEnum] = mapped_column(Enum(ChallengeDifficultyEnum), default=ChallengeDifficultyEnum.MEDIUM, nullable=False)
    evidence_required: Mapped[bool] = mapped_column(default=True, nullable=False)
    
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    
    status: Mapped[ChallengeStatusEnum] = mapped_column(Enum(ChallengeStatusEnum), default=ChallengeStatusEnum.ACTIVE, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    created_by: Mapped[Optional[uuid.UUID]] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="SET NULL"), nullable=True)
    updated_by: Mapped[Optional[uuid.UUID]] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="SET NULL"), nullable=True)

class ChallengeParticipation(Base):
    __tablename__ = "challenge_participation"

    id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    challenge_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("challenges.id", ondelete="CASCADE"), nullable=False, index=True)
    challenge = relationship("Challenge")
    
    employee_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    employee = relationship("Profile")
    
    progress: Mapped[float] = mapped_column(Float, default=0.0, nullable=False) # 0 to 100 percentage
    proof_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    
    approval_status: Mapped[ParticipationStatusEnum] = mapped_column(Enum(ParticipationStatusEnum), default=ParticipationStatusEnum.IN_PROGRESS, nullable=False)
    xp_awarded: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

class XpTransaction(Base):
    __tablename__ = "xp_transactions"
    
    id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    employee_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    employee = relationship("Profile")
    
    source_type: Mapped[str] = mapped_column(String(50), nullable=False) # e.g. "CHALLENGE_COMPLETION", "MANUAL_BONUS"
    source_id: Mapped[Optional[uuid.UUID]] = mapped_column(PG_UUID(as_uuid=True), nullable=True)
    
    xp: Mapped[int] = mapped_column(Integer, nullable=False) # can be negative for redemptions
    
    transaction_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
