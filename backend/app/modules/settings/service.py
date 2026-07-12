from uuid import UUID
from sqlalchemy.orm import Session
from .repository import SettingsRepository
from .schemas import ESGConfigurationUpdate, NotificationSettingUpdate
from .models import ESGConfiguration, NotificationSetting

class SettingsService:
    def __init__(self, session: Session):
        self.repo = SettingsRepository(session)
        self.session = session

    def get_esg_config(self) -> ESGConfiguration:
        config = self.repo.get_esg_config()
        self.session.commit()
        return config

    def update_esg_config(self, data: ESGConfigurationUpdate) -> ESGConfiguration:
        config = self.repo.update_esg_config(data.model_dump())
        self.session.commit()
        return config

    def get_notification_settings(self, profile_id: UUID) -> NotificationSetting:
        setting = self.repo.get_notification_settings(profile_id)
        self.session.commit()
        return setting

    def update_notification_settings(self, profile_id: UUID, data: NotificationSettingUpdate) -> NotificationSetting:
        setting = self.repo.update_notification_settings(profile_id, data.model_dump())
        self.session.commit()
        return setting
