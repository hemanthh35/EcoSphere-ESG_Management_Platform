from fastapi import APIRouter, Depends, UploadFile, File, Header
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.modules.auth.schemas import (
    UserLogin, TokenResponse, ProfileResponse, ProfileUpdate, RefreshTokenRequest,
    ForgotPasswordRequest, ResetPasswordRequest, ChangePasswordRequest, UserRegister
)
from app.modules.auth.service import AuthService
from app.modules.auth.dependencies import get_current_user
from app.modules.auth.models import Profile

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    return AuthService(db)

@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, auth_service: AuthService = Depends(get_auth_service)):
    return auth_service.login(credentials)

@router.post("/register", response_model=ProfileResponse)
def register(data: UserRegister, auth_service: AuthService = Depends(get_auth_service)):
    return auth_service.register(data)

@router.post("/logout")
def logout(
    auth_service: AuthService = Depends(get_auth_service),
    current_user: Profile = Depends(get_current_user)
):
    # In a stateless JWT setup, the client destroys the token.
    return {"detail": "Successfully logged out"}

@router.post("/refresh", response_model=TokenResponse)
def refresh_token(request: RefreshTokenRequest, auth_service: AuthService = Depends(get_auth_service)):
    return auth_service.refresh_token(request.refresh_token)

@router.get("/me", response_model=ProfileResponse)
def get_me(current_user: Profile = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=ProfileResponse)
def update_profile(
    data: ProfileUpdate,
    current_user: Profile = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service)
):
    return auth_service.update_profile(str(current_user.id), data)

@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, auth_service: AuthService = Depends(get_auth_service)):
    return auth_service.forgot_password(data)

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, auth_service: AuthService = Depends(get_auth_service)):
    return auth_service.reset_password(data)

@router.put("/change-password")
def change_password(
    data: ChangePasswordRequest, 
    authorization: str = Header(None),
    auth_service: AuthService = Depends(get_auth_service),
    current_user: Profile = Depends(get_current_user)
):
    # Extract token from header
    token = authorization.replace("Bearer ", "") if authorization else ""
    return auth_service.change_password(token, data)

@router.post("/avatar", response_model=ProfileResponse)
def upload_avatar(
    file: UploadFile = File(...),
    current_user: Profile = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service)
):
    return auth_service.upload_avatar(str(current_user.id), file)
