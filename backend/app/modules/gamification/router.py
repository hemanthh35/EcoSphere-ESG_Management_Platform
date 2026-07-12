from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import Optional, List
from uuid import UUID

from app.database.session import get_db
from app.modules.auth.dependencies import get_current_user
from app.modules.auth.models import Profile
from .schemas import (
    ChallengeCreate, ChallengeUpdate, ChallengeResponse, PaginatedChallengeResponse,
    LeaderboardEntry
)
from .service import GamificationService

router = APIRouter(prefix="/gamification", tags=["gamification"])

def get_gamification_service(db: Session = Depends(get_db)) -> GamificationService:
    return GamificationService(db)

# --- Challenges ---
@router.get("/challenges", response_model=PaginatedChallengeResponse)
def get_challenges(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: Optional[str] = None,
    service: GamificationService = Depends(get_gamification_service),
    current_user: Profile = Depends(get_current_user)
):
    items, total = service.get_challenges(skip, limit, search)
    return PaginatedChallengeResponse(items=items, total=total, skip=skip, limit=limit)

@router.get("/challenges/{challenge_id}", response_model=ChallengeResponse)
def get_challenge(
    challenge_id: UUID,
    service: GamificationService = Depends(get_gamification_service),
    current_user: Profile = Depends(get_current_user)
):
    return service.get_challenge_by_id(challenge_id)

@router.post("/challenges", response_model=ChallengeResponse, status_code=status.HTTP_201_CREATED)
def create_challenge(
    data: ChallengeCreate,
    service: GamificationService = Depends(get_gamification_service),
    current_user: Profile = Depends(get_current_user)
):
    return service.create_challenge(data, current_user.id)

@router.put("/challenges/{challenge_id}", response_model=ChallengeResponse)
def update_challenge(
    challenge_id: UUID,
    data: ChallengeUpdate,
    service: GamificationService = Depends(get_gamification_service),
    current_user: Profile = Depends(get_current_user)
):
    return service.update_challenge(challenge_id, data, current_user.id)

@router.delete("/challenges/{challenge_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_challenge(
    challenge_id: UUID,
    service: GamificationService = Depends(get_gamification_service),
    current_user: Profile = Depends(get_current_user)
):
    service.delete_challenge(challenge_id)

# --- Leaderboard ---
@router.get("/leaderboard", response_model=List[LeaderboardEntry])
def get_leaderboard(
    limit: int = Query(50, ge=1, le=500),
    service: GamificationService = Depends(get_gamification_service),
    current_user: Profile = Depends(get_current_user)
):
    return service.get_leaderboard(limit)
