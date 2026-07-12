import uuid
from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, Field

from app.modules.environmental.models import FactorStatusEnum, TransactionStatusEnum, GoalStatusEnum

# --- Emission Factor Schemas ---

class EmissionFactorBase(BaseModel):
    factor_code: str = Field(..., max_length=50)
    factor_name: str = Field(..., max_length=255)
    source: str = Field(..., max_length=255)
    category: str = Field(..., max_length=100)
    unit: str = Field(..., max_length=50)
    co2e_factor: float = Field(..., ge=0)
    effective_from: date
    effective_to: Optional[date] = None
    status: FactorStatusEnum = FactorStatusEnum.ACTIVE

class EmissionFactorCreate(EmissionFactorBase):
    pass

class EmissionFactorUpdate(BaseModel):
    factor_code: Optional[str] = Field(None, max_length=50)
    factor_name: Optional[str] = Field(None, max_length=255)
    source: Optional[str] = Field(None, max_length=255)
    category: Optional[str] = Field(None, max_length=100)
    unit: Optional[str] = Field(None, max_length=50)
    co2e_factor: Optional[float] = Field(None, ge=0)
    effective_from: Optional[date] = None
    effective_to: Optional[date] = None
    status: Optional[FactorStatusEnum] = None

class EmissionFactorResponse(EmissionFactorBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# --- Carbon Transaction Schemas ---

class CarbonTransactionBase(BaseModel):
    transaction_number: str = Field(..., max_length=50)
    department_id: uuid.UUID
    product_esg_profile_id: Optional[uuid.UUID] = None
    emission_factor_id: uuid.UUID
    quantity: float = Field(..., gt=0)
    unit: str = Field(..., max_length=50)
    transaction_date: date
    notes: Optional[str] = None
    status: TransactionStatusEnum = TransactionStatusEnum.LOGGED

class CarbonTransactionCreate(CarbonTransactionBase):
    # The client does not provide calculated_emission, the backend calculates it.
    pass

class CarbonTransactionUpdate(BaseModel):
    department_id: Optional[uuid.UUID] = None
    product_esg_profile_id: Optional[uuid.UUID] = None
    emission_factor_id: Optional[uuid.UUID] = None
    quantity: Optional[float] = Field(None, gt=0)
    unit: Optional[str] = Field(None, max_length=50)
    transaction_date: Optional[date] = None
    notes: Optional[str] = None
    status: Optional[TransactionStatusEnum] = None

class CarbonTransactionResponse(CarbonTransactionBase):
    id: uuid.UUID
    calculated_emission: float
    created_at: datetime
    updated_at: datetime

    # Denormalized fields for UI convenience
    department_name: Optional[str] = None
    emission_factor_name: Optional[str] = None
    product_name: Optional[str] = None

    class Config:
        from_attributes = True

# --- Environmental Goal Schemas ---

class EnvironmentalGoalBase(BaseModel):
    goal_name: str = Field(..., max_length=255)
    department_id: uuid.UUID
    target_co2: float = Field(..., gt=0)
    deadline: date
    status: GoalStatusEnum = GoalStatusEnum.ACTIVE

class EnvironmentalGoalCreate(EnvironmentalGoalBase):
    # current_co2 and progress_percentage are tracked internally
    pass

class EnvironmentalGoalUpdate(BaseModel):
    goal_name: Optional[str] = Field(None, max_length=255)
    department_id: Optional[uuid.UUID] = None
    target_co2: Optional[float] = Field(None, gt=0)
    deadline: Optional[date] = None
    status: Optional[GoalStatusEnum] = None

class EnvironmentalGoalResponse(EnvironmentalGoalBase):
    id: uuid.UUID
    current_co2: float
    progress_percentage: float
    created_at: datetime
    updated_at: datetime
    
    # Denormalized field
    department_name: Optional[str] = None

    class Config:
        from_attributes = True

# --- Paginated Responses ---

class PaginatedEmissionFactors(BaseModel):
    items: List[EmissionFactorResponse]
    total: int

class PaginatedCarbonTransactions(BaseModel):
    items: List[CarbonTransactionResponse]
    total: int

class PaginatedEnvironmentalGoals(BaseModel):
    items: List[EnvironmentalGoalResponse]
    total: int
