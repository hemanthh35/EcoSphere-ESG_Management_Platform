from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from supabase import create_client, Client
from app.config import get_settings
from app.modules.auth.schemas import UserLogin, TokenResponse, ProfileUpdate
from app.modules.auth.models import Profile

settings = get_settings()

def get_supabase_client() -> Client:
    # Use SUPABASE_URL and SUPABASE_ANON_KEY to create a client
    url = settings.SUPABASE_URL
    key = settings.SUPABASE_ANON_KEY
    if not url or not key:
        raise HTTPException(
            status_code=500, detail="Supabase configuration is missing"
        )
    return create_client(url, key)

class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.supabase = get_supabase_client()

    def login(self, credentials: UserLogin) -> TokenResponse:
        try:
            # Authenticate with Supabase
            res = self.supabase.auth.sign_in_with_password(
                {"email": credentials.email, "password": credentials.password}
            )
            session = res.session
            if not session:
                raise HTTPException(status_code=401, detail="Invalid credentials")
            
            return TokenResponse(
                access_token=session.access_token,
                refresh_token=session.refresh_token,
                expires_in=session.expires_in
            )
        except Exception as e:
            # Supabase API usually raises an exception on 400 invalid credentials
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )

    def logout(self, token: str):
        # In a stateless JWT backend, logout is often handled client-side.
        # But we can try to notify Supabase if possible.
        try:
            # Note: The python client holds global state. For a stateless API,
            # this might not work perfectly, but we include it for completeness.
            self.supabase.auth.sign_out()
        except Exception:
            pass
        return {"detail": "Logged out successfully"}

    def get_profile(self, user_id: str) -> Profile:
        profile = self.db.query(Profile).filter(Profile.id == user_id).first()
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        return profile

    def update_profile(self, user_id: str, data: ProfileUpdate) -> Profile:
        profile = self.get_profile(user_id)
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(profile, key, value)
        
        self.db.commit()
        self.db.refresh(profile)
        return profile
        
    def refresh_token(self, refresh_token: str) -> TokenResponse:
        try:
            res = self.supabase.auth.refresh_session(refresh_token)
            session = res.session
            if not session:
                raise HTTPException(status_code=401, detail="Invalid refresh token")
                
            return TokenResponse(
                access_token=session.access_token,
                refresh_token=session.refresh_token,
                expires_in=session.expires_in
            )
        except Exception:
            raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
