from typing import Optional, List
from datetime import datetime, date
from uuid import UUID
from pydantic import BaseModel, Field

from .models import ChallengeDifficultyEnum, ChallengeStatusEnum, ParticipationStatusEnum

# --- XP Transaction Schemas ---
class XpTransactionBase(BaseModel):
    employee_id: UUID
    source_type: str = Field(..., max_length=50)
    source_id: Optional[UUID] = None
    xp: int
    notes: Optional[str] = None

class XpTransactionResponse(XpTransactionBase):
    id: UUID
    transaction_date: datetime

    class Config:
        from_attributes = True

# --- Challenge Schemas ---
class ChallengeBase(BaseModel):
    challenge_code: str = Field(..., max_length=50)
    title: str = Field(..., max_length=255)
    description: str
    category_id: UUID
    xp_points: int = 100
    difficulty: ChallengeDifficultyEnum = ChallengeDifficultyEnum.MEDIUM
    evidence_required: bool = True
    start_date: date
    end_date: Optional[date] = None
    status: ChallengeStatusEnum = ChallengeStatusEnum.ACTIVE

class ChallengeCreate(ChallengeBase):
    pass

class ChallengeUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[UUID] = None
    xp_points: Optional[int] = None
    difficulty: Optional[ChallengeDifficultyEnum] = None
    evidence_required: Optional[bool] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[ChallengeStatusEnum] = None

class ChallengeResponse(ChallengeBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    created_by: Optional[UUID] = None

    class Config:
        from_attributes = True

# --- Challenge Participation Schemas ---
class ChallengeParticipationBase(BaseModel):
    challenge_id: UUID
    employee_id: UUID
    progress: float = 0.0
    proof_url: Optional[str] = None
    approval_status: ParticipationStatusEnum = ParticipationStatusEnum.IN_PROGRESS
    xp_awarded: int = 0

class ChallengeParticipationCreate(BaseModel):
    challenge_id: UUID

class ChallengeParticipationUpdate(BaseModel):
    progress: Optional[float] = None
    proof_url: Optional[str] = None
    approval_status: Optional[ParticipationStatusEnum] = None

class ChallengeParticipationResponse(ChallengeParticipationBase):
    id: UUID
    completed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- Leaderboard Schemas ---
class LeaderboardEntry(BaseModel):
    employee_id: UUID
    full_name: str
    total_xp: int
    rank: int

    class Config:
        from_attributes = True

# --- Paginated Responses ---
class PaginatedChallengeResponse(BaseModel):
    items: List[ChallengeResponse]
    total: int
    skip: int
    limit: int

class PaginatedParticipationResponse(BaseModel):
    items: List[ChallengeParticipationResponse]
    total: int
    skip: int
    limit: int
