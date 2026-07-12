from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import select
from .models import ESGConfiguration, NotificationSetting

class SettingsRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_esg_config(self) -> ESGConfiguration:
        config = self.session.scalar(select(ESGConfiguration))
        if not config:
            # Initialize default configuration if none exists
            config = ESGConfiguration(
                environmental_weight=0.4,
                social_weight=0.3,
                governance_weight=0.3,
                auto_carbon_calculation=True,
                evidence_required=True,
                auto_badge_award=True
            )
            self.session.add(config)
            self.session.flush()
        return config

    def update_esg_config(self, data: dict) -> ESGConfiguration:
        config = self.get_esg_config()
        for key, value in data.items():
            setattr(config, key, value)
        self.session.flush()
        return config

    def get_notification_settings(self, profile_id: UUID) -> NotificationSetting:
        setting = self.session.scalar(
            select(NotificationSetting).where(NotificationSetting.profile_id == profile_id)
        )
        if not setting:
            setting = NotificationSetting(
                profile_id=profile_id,
                email_alerts=True,
                compliance_alerts=True,
                challenge_updates=True,
                badge_milestones=True
            )
            self.session.add(setting)
            self.session.flush()
        return setting

    def update_notification_settings(self, profile_id: UUID, data: dict) -> NotificationSetting:
        setting = self.get_notification_settings(profile_id)
        for key, value in data.items():
            setattr(setting, key, value)
        self.session.flush()
        return setting
