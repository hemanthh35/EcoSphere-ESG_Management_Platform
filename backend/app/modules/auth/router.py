from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.modules.auth.schemas import (
    UserLogin, TokenResponse, ProfileResponse, ProfileUpdate, RefreshTokenRequest
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

@router.post("/logout")
def logout(
    auth_service: AuthService = Depends(get_auth_service),
    current_user: Profile = Depends(get_current_user)
):
    # In a stateless JWT setup, the client destroys the token.
    # We return a success message here.
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
