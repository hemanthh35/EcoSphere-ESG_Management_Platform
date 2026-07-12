import uuid
from datetime import datetime, date, timezone
from typing import Optional
from sqlalchemy import String, Integer, Float, DateTime, Date, ForeignKey, CheckConstraint, Index, Text, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
import enum

from app.database.base import Base

class FactorStatusEnum(str, enum.Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"
    ARCHIVED = "ARCHIVED"

class TransactionStatusEnum(str, enum.Enum):
    DRAFT = "DRAFT"
    LOGGED = "LOGGED"
    VERIFIED = "VERIFIED"

class GoalStatusEnum(str, enum.Enum):
    ACTIVE = "ACTIVE"
    ON_TRACK = "ON_TRACK"
    AT_RISK = "AT_RISK"
    COMPLETED = "COMPLETED"
    MISSED = "MISSED"

class EmissionFactor(Base):
    __tablename__ = "emission_factors"

    id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    factor_code: Mapped[str] = mapped_column(String(50), nullable=False, unique=True, index=True)
    factor_name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    source: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    unit: Mapped[str] = mapped_column(String(50), nullable=False)
    
    co2e_factor: Mapped[float] = mapped_column(Float, nullable=False)
    
    effective_from: Mapped[date] = mapped_column(Date, nullable=False)
    effective_to: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    
    status: Mapped[FactorStatusEnum] = mapped_column(Enum(FactorStatusEnum), default=FactorStatusEnum.ACTIVE, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    created_by: Mapped[Optional[uuid.UUID]] = mapped_column(PG_UUID(as_uuid=True), nullable=True)
    updated_by: Mapped[Optional[uuid.UUID]] = mapped_column(PG_UUID(as_uuid=True), nullable=True)

    __table_args__ = (
        CheckConstraint("co2e_factor >= 0", name="check_positive_co2e_factor"),
    )

class CarbonTransaction(Base):
    __tablename__ = "carbon_transactions"

    id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    transaction_number: Mapped[str] = mapped_column(String(50), nullable=False, unique=True, index=True)
    
    department_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("departments.id", ondelete="RESTRICT"), nullable=False, index=True)
    department = relationship("Department")

    product_esg_profile_id: Mapped[Optional[uuid.UUID]] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("product_esg_profiles.id", ondelete="SET NULL"), nullable=True, index=True)
    product_esg_profile = relationship("ProductESGProfile")

    emission_factor_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("emission_factors.id", ondelete="RESTRICT"), nullable=False)
    emission_factor = relationship("EmissionFactor")

    quantity: Mapped[float] = mapped_column(Float, nullable=False)
    unit: Mapped[str] = mapped_column(String(50), nullable=False)
    calculated_emission: Mapped[float] = mapped_column(Float, nullable=False) # quantity * co2e_factor
    
    transaction_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[TransactionStatusEnum] = mapped_column(Enum(TransactionStatusEnum), default=TransactionStatusEnum.LOGGED, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    
    __table_args__ = (
        CheckConstraint("quantity >= 0", name="check_positive_quantity"),
        CheckConstraint("calculated_emission >= 0", name="check_positive_calculated_emission"),
    )

class EnvironmentalGoal(Base):
    __tablename__ = "environmental_goals"

    id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    goal_name: Mapped[str] = mapped_column(String(255), nullable=False)
    
    department_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("departments.id", ondelete="CASCADE"), nullable=False, index=True)
    department = relationship("Department")

    target_co2: Mapped[float] = mapped_column(Float, nullable=False)
    current_co2: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    progress_percentage: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    
    deadline: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[GoalStatusEnum] = mapped_column(Enum(GoalStatusEnum), default=GoalStatusEnum.ACTIVE, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    __table_args__ = (
        CheckConstraint("target_co2 >= 0", name="check_positive_target_co2"),
        CheckConstraint("current_co2 >= 0", name="check_positive_current_co2"),
        CheckConstraint("progress_percentage >= 0 AND progress_percentage <= 100", name="check_valid_progress_percentage"),
    )
