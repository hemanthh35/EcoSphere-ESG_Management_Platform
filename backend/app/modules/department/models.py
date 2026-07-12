import uuid
from datetime import datetime, UTC
from typing import Optional
from sqlalchemy import String, Integer, DateTime, ForeignKey, CheckConstraint, Index, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from app.database.base import Base


class Department(Base):
    __tablename__ = "departments"

    # Primary Key
    id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    # Core Data
    name: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    code: Mapped[str] = mapped_column(String(50), nullable=False, unique=True, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Hierarchy
    parent_department_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("departments.id", ondelete="RESTRICT"),
        nullable=True,
        index=True,
    )

    # Leadership
    department_head_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        PG_UUID(as_uuid=True),
        nullable=True,
        index=True,
    )

    # Metadata
    employee_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="ACTIVE", nullable=False, index=True)

    # Audit & Soft Delete
    created_by: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), nullable=False)
    updated_by: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )
    deleted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True, index=True)

    # Relationships
    parent_department: Mapped[Optional["Department"]] = relationship(
        "Department",
        remote_side="Department.id",
        foreign_keys=[parent_department_id],
        back_populates="child_departments",
    )
    child_departments: Mapped[list["Department"]] = relationship(
        "Department",
        foreign_keys=[parent_department_id],
        back_populates="parent_department",
    )

    # Table-level constraints & indexes
    __table_args__ = (
        CheckConstraint("parent_department_id != id", name="check_no_self_parent"),
        CheckConstraint("employee_count >= 0", name="check_positive_employee_count"),
        CheckConstraint("status IN ('ACTIVE', 'INACTIVE')", name="check_valid_status"),
        Index("idx_departments_parent_status_deleted", "parent_department_id", "status", "deleted_at"),
    )

    def __repr__(self) -> str:
        return f"<Department(id={self.id}, name='{self.name}', code='{self.code}')>"
