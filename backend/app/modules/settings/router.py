from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.modules.auth.dependencies import get_current_user, RoleChecker
from app.modules.auth.models import Profile, RoleEnum
from .schemas import (
    ESGConfigurationResponse, ESGConfigurationUpdate,
    NotificationSettingResponse, NotificationSettingUpdate
)
from .service import SettingsService

router = APIRouter(prefix="/settings", tags=["Settings"])

def get_settings_service(db: Session = Depends(get_db)) -> SettingsService:
    return SettingsService(db)

@router.get("/esg", response_model=ESGConfigurationResponse)
def get_esg_config(
    service: SettingsService = Depends(get_settings_service),
    current_user: Profile = Depends(get_current_user)
):
    return service.get_esg_config()

@router.put("/esg", response_model=ESGConfigurationResponse)
def update_esg_config(
    data: ESGConfigurationUpdate,
    service: SettingsService = Depends(get_settings_service),
    current_user: Profile = Depends(RoleChecker([RoleEnum.ADMIN]))
):
    return service.update_esg_config(data)

@router.get("/notifications", response_model=NotificationSettingResponse)
def get_notification_settings(
    service: SettingsService = Depends(get_settings_service),
    current_user: Profile = Depends(get_current_user)
):
    return service.get_notification_settings(current_user.id)

@router.put("/notifications", response_model=NotificationSettingResponse)
def update_notification_settings(
    data: NotificationSettingUpdate,
    service: SettingsService = Depends(get_settings_service),
    current_user: Profile = Depends(get_current_user)
):
    return service.update_notification_settings(current_user.id, data)
