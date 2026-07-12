from typing import List
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from app.database.session import get_db
from app.config import get_settings
from app.modules.auth.models import Profile

settings = get_settings()
security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> Profile:
    token = credentials.credentials
    try:
        # Supabase uses HS256 by default for its JWTs
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False}
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")

    profile = db.query(Profile).filter(Profile.id == user_id).first()
    
    if not profile:
        # If the user is registered in Supabase but no profile exists, auto-create a basic one
        # using the claims from the JWT token.
        profile = Profile(
            id=user_id,
            email=payload.get("email", ""),
            full_name=payload.get("user_metadata", {}).get("full_name", "New Employee")
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

    return profile

class RoleChecker:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: Profile = Depends(get_current_user)):
        if current_user.role.value not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation not permitted"
            )
        return current_user
