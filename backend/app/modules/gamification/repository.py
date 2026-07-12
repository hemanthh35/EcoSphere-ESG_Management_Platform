from typing import List, Tuple, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import select, func, or_, desc
from datetime import datetime, timezone

from .models import Challenge, ChallengeParticipation, XpTransaction, ParticipationStatusEnum
from .schemas import ChallengeCreate, ChallengeUpdate, ChallengeParticipationUpdate
from app.modules.auth.models import Profile

class GamificationRepository:
    def __init__(self, session: Session):
        self.session = session

    # --- Challenges ---
    def get_challenges(self, skip: int = 0, limit: int = 100, search: Optional[str] = None) -> Tuple[List[Challenge], int]:
        query = select(Challenge)
        
        if search:
            query = query.where(
                or_(
                    Challenge.title.ilike(f"%{search}%"),
                    Challenge.challenge_code.ilike(f"%{search}%")
                )
            )

        total = self.session.scalar(select(func.count()).select_from(query.subquery())) or 0
        items = self.session.scalars(query.offset(skip).limit(limit)).all()
        return list(items), total

    def get_challenge_by_id(self, challenge_id: UUID) -> Optional[Challenge]:
        return self.session.get(Challenge, challenge_id)

    def create_challenge(self, data: ChallengeCreate, user_id: Optional[UUID] = None) -> Challenge:
        challenge = Challenge(**data.model_dump())
        challenge.created_by = user_id
        challenge.updated_by = user_id
        self.session.add(challenge)
        self.session.flush()
        return challenge

    def update_challenge(self, challenge: Challenge, data: ChallengeUpdate, user_id: Optional[UUID] = None) -> Challenge:
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(challenge, key, value)
        challenge.updated_by = user_id
        self.session.flush()
        return challenge

    def delete_challenge(self, challenge: Challenge) -> None:
        self.session.delete(challenge)
        self.session.flush()

    # --- Leaderboard / XP ---
    def get_leaderboard(self, limit: int = 50) -> List[dict]:
        # Calculate total XP per employee by summing xp_transactions
        stmt = (
            select(
                XpTransaction.employee_id,
                func.sum(XpTransaction.xp).label("total_xp")
            )
            .group_by(XpTransaction.employee_id)
            .subquery()
        )
        
        query = (
            select(Profile, stmt.c.total_xp)
            .join(stmt, Profile.id == stmt.c.employee_id)
            .order_by(desc(stmt.c.total_xp))
            .limit(limit)
        )
        
        results = self.session.execute(query).all()
        
        leaderboard = []
        for rank, (profile, total_xp) in enumerate(results, start=1):
            leaderboard.append({
                "employee_id": profile.id,
                "full_name": profile.full_name,
                "total_xp": total_xp or 0,
                "rank": rank
            })
            
        return leaderboard
