from typing import Optional
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.modules.auth.models import Profile, RoleEnum
from app.modules.auth.schemas import ProfileUpdate

class AuthRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_user_by_id(self, user_id: str) -> Optional[Profile]:
        return self.db.query(Profile).filter(Profile.id == user_id).first()

    def get_user_by_email(self, email: str) -> Optional[Profile]:
        return self.db.query(Profile).filter(Profile.email == email).first()

    def create_user(self, profile: Profile) -> Profile:
        self.db.add(profile)
        self.db.commit()
        self.db.refresh(profile)
        return profile

    def update_profile(self, user_id: str, data: ProfileUpdate) -> Optional[Profile]:
        profile = self.get_user_by_id(user_id)
        if not profile:
            return None
        
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(profile, key, value)
        
        self.db.commit()
        self.db.refresh(profile)
        return profile

    def update_last_login(self, user_id: str) -> Optional[Profile]:
        profile = self.get_user_by_id(user_id)
        if profile:
            profile.last_login = datetime.now(timezone.utc)
            self.db.commit()
            self.db.refresh(profile)
        return profile

    def get_role(self, user_id: str) -> Optional[RoleEnum]:
        profile = self.get_user_by_id(user_id)
        return profile.role if profile else None
