import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict

# --- CSR Activity ---
class CsrActivityBase(BaseModel):
    title: str = Field(..., max_length=255)
    activity_code: str = Field(..., max_length=50)
    category_id: Optional[uuid.UUID] = None
    department_id: Optional[uuid.UUID] = None
    description: Optional[str] = None
    start_date: datetime
    end_date: datetime
    location: Optional[str] = None
    max_participants: Optional[int] = None
    status: str = Field(default="PLANNED", max_length=20)

class CsrActivityCreate(CsrActivityBase):
    pass

class CsrActivityUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    category_id: Optional[uuid.UUID] = None
    department_id: Optional[uuid.UUID] = None
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    location: Optional[str] = None
    max_participants: Optional[int] = None
    status: Optional[str] = Field(None, max_length=20)

class CsrActivityResponse(CsrActivityBase):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    created_by: uuid.UUID
    updated_by: uuid.UUID
    created_at: datetime
    updated_at: datetime


# --- Employee Participation ---
class EmployeeParticipationBase(BaseModel):
    employee_id: uuid.UUID
    activity_id: uuid.UUID
    proof_url: Optional[str] = None
    approval_status: str = Field(default="PENDING", max_length=20)
    points_earned: int = 0
    completion_date: Optional[datetime] = None

class EmployeeParticipationCreate(BaseModel):
    activity_id: uuid.UUID

class EmployeeParticipationUpdate(BaseModel):
    proof_url: Optional[str] = None
    approval_status: Optional[str] = Field(None, max_length=20)
    points_earned: Optional[int] = None
    completion_date: Optional[datetime] = None

class EmployeeParticipationResponse(EmployeeParticipationBase):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


# --- Diversity Metric ---
class DiversityMetricBase(BaseModel):
    department_id: uuid.UUID
    metric_name: str = Field(..., max_length=100)
    metric_value: float
    reporting_period: str = Field(..., max_length=50)

class DiversityMetricCreate(DiversityMetricBase):
    pass

class DiversityMetricUpdate(BaseModel):
    metric_name: Optional[str] = Field(None, max_length=100)
    metric_value: Optional[float] = None
    reporting_period: Optional[str] = Field(None, max_length=50)

class DiversityMetricResponse(DiversityMetricBase):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


# --- Training Record ---
class TrainingRecordBase(BaseModel):
    employee_id: uuid.UUID
    training_name: str = Field(..., max_length=255)
    completion_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    status: str = Field(default="ASSIGNED", max_length=20)
    certificate_url: Optional[str] = None

class TrainingRecordCreate(TrainingRecordBase):
    pass

class TrainingRecordUpdate(BaseModel):
    training_name: Optional[str] = Field(None, max_length=255)
    completion_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    status: Optional[str] = Field(None, max_length=20)
    certificate_url: Optional[str] = None

class TrainingRecordResponse(TrainingRecordBase):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
