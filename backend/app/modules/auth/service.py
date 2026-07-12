from sqlalchemy.orm import Session
from fastapi import UploadFile
from supabase import create_client, Client
from app.config import get_settings
from app.modules.auth.schemas import (
    UserLogin, TokenResponse, ProfileUpdate, ForgotPasswordRequest, 
    ResetPasswordRequest, ChangePasswordRequest, UserRegister
)
from app.modules.auth.models import Profile
from app.modules.auth.repository import AuthRepository
from app.modules.auth.exceptions import InvalidCredentialsException, UserNotFoundException

settings = get_settings()

def get_supabase_client() -> Client:
    url = settings.SUPABASE_URL
    key = settings.SUPABASE_ANON_KEY
    if not url or not key:
        raise Exception("Supabase configuration is missing")
    return create_client(url, key)

class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.supabase = get_supabase_client()
        self.repository = AuthRepository(db)

    def login(self, credentials: UserLogin) -> TokenResponse:
        try:
            res = self.supabase.auth.sign_in_with_password(
                {"email": credentials.email, "password": credentials.password}
            )
            session = res.session
            if not session:
                raise InvalidCredentialsException()
            
            # Update last login
            user_id = session.user.id
            self.repository.update_last_login(user_id)

            return TokenResponse(
                access_token=session.access_token,
                refresh_token=session.refresh_token,
                expires_in=session.expires_in
            )
        except Exception:
            raise InvalidCredentialsException()

    def register(self, data: UserRegister) -> Profile:
        try:
            # 1. Register with Supabase
            res = self.supabase.auth.sign_up(
                {"email": data.email, "password": data.password}
            )
            user = res.user
            if not user:
                raise Exception("Failed to create user in Supabase")

            # 2. Create local profile
            from app.modules.auth.models import RoleEnum, StatusEnum
            
            new_profile = Profile(
                id=user.id,
                email=data.email,
                full_name=data.full_name,
                role=RoleEnum.EMPLOYEE,
                status=StatusEnum.ACTIVE
            )
            return self.repository.create_user(new_profile)
        except Exception as e:
            # Re-raise or handle specific Supabase errors (e.g. user exists)
            from fastapi import HTTPException
            raise HTTPException(status_code=400, detail=f"Registration failed: {str(e)}")

    def logout(self, token: str):
        try:
            self.supabase.auth.sign_out()
        except Exception:
            pass
        return {"detail": "Logged out successfully"}

    def get_profile(self, user_id: str) -> Profile:
        profile = self.repository.get_user_by_id(user_id)
        if not profile:
            raise UserNotFoundException()
        return profile

    def update_profile(self, user_id: str, data: ProfileUpdate) -> Profile:
        profile = self.repository.update_profile(user_id, data)
        if not profile:
            raise UserNotFoundException()
        return profile
        
    def refresh_token(self, refresh_token: str) -> TokenResponse:
        try:
            res = self.supabase.auth.refresh_session(refresh_token)
            session = res.session
            if not session:
                raise Exception("Invalid refresh token")
                
            return TokenResponse(
                access_token=session.access_token,
                refresh_token=session.refresh_token,
                expires_in=session.expires_in
            )
        except Exception:
            from fastapi import HTTPException
            raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    def forgot_password(self, data: ForgotPasswordRequest):
        try:
            # Supabase handles sending the password reset email
            self.supabase.auth.reset_password_email(data.email)
            return {"detail": "Password reset email sent"}
        except Exception as e:
            # Avoid leaking if a user exists or not for security
            return {"detail": "If the email is registered, a password reset link has been sent"}

    def reset_password(self, data: ResetPasswordRequest):
        try:
            # In a real setup, we might need the access token from the URL fragment
            # or use the admin API. Supabase standard flow uses the token from the email link.
            # Assuming the token is an access token from the recovery email:
            # supabase.auth.update_user({'password': new_password})
            
            # For this example, we assume `data.token` is the access token provided via magic link
            # We would need to set the session first, then update user:
            # However, for simplicity if using a backend route, it might look like this:
            self.supabase.auth.set_session(data.token, data.token) # Hacky for this example
            self.supabase.auth.update_user({"password": data.new_password})
            return {"detail": "Password has been reset successfully"}
        except Exception as e:
            from fastapi import HTTPException
            raise HTTPException(status_code=400, detail="Failed to reset password. The link might be invalid or expired.")

    def change_password(self, token: str, data: ChangePasswordRequest):
        try:
            # To change password, user must be authenticated.
            # In a real implementation, we would extract the JWT token from the header
            # and set it in supabase client.
            self.supabase.auth.set_session(token, token)
            self.supabase.auth.update_user({"password": data.new_password})
            return {"detail": "Password changed successfully"}
        except Exception as e:
            from fastapi import HTTPException
            raise HTTPException(status_code=400, detail="Failed to change password")
            
    def upload_avatar(self, user_id: str, file: UploadFile) -> Profile:
        # Implementation for uploading avatar. 
        # Typically upload to Supabase Storage and update Profile with the URL.
        # Returning mock URL for now as storage bucket might not be set up yet.
        mock_url = f"https://mock-storage.com/avatars/{user_id}/{file.filename}"
        update_data = ProfileUpdate(profile_image=mock_url)
        return self.update_profile(user_id, update_data)
