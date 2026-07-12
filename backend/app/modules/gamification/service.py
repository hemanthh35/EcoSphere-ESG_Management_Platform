from typing import Optional, List, Tuple
from uuid import UUID
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from .repository import GamificationRepository
from .schemas import ChallengeCreate, ChallengeUpdate, LeaderboardEntry
from .models import Challenge

class GamificationService:
    def __init__(self, session: Session):
        self.repo = GamificationRepository(session)
        self.session = session

    # --- Challenges ---
    def get_challenges(self, skip: int = 0, limit: int = 100, search: Optional[str] = None) -> Tuple[List[Challenge], int]:
        return self.repo.get_challenges(skip, limit, search)

    def get_challenge_by_id(self, challenge_id: UUID) -> Challenge:
        challenge = self.repo.get_challenge_by_id(challenge_id)
        if not challenge:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Challenge not found")
        return challenge

    def create_challenge(self, data: ChallengeCreate, user_id: Optional[UUID] = None) -> Challenge:
        challenge = self.repo.create_challenge(data, user_id)
        self.session.commit()
        return challenge

    def update_challenge(self, challenge_id: UUID, data: ChallengeUpdate, user_id: Optional[UUID] = None) -> Challenge:
        challenge = self.get_challenge_by_id(challenge_id)
        updated = self.repo.update_challenge(challenge, data, user_id)
        self.session.commit()
        return updated

    def delete_challenge(self, challenge_id: UUID) -> None:
        challenge = self.get_challenge_by_id(challenge_id)
        self.repo.delete_challenge(challenge)
        self.session.commit()

    # --- Leaderboard ---
    def get_leaderboard(self, limit: int = 50) -> List[LeaderboardEntry]:
        results = self.repo.get_leaderboard(limit)
        return [LeaderboardEntry(**r) for r in results]
