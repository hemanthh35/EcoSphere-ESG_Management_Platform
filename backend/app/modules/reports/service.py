from typing import List, Optional
from uuid import UUID
from datetime import date
from sqlalchemy.orm import Session

from .repository import ReportsRepository
from .models import ReportTemplate, ExportAuditLog

class ReportsService:
    def __init__(self, session: Session):
        self.repo = ReportsRepository(session)
        self.session = session

    def get_environmental_report(self, department_id: Optional[UUID], start_date: Optional[date], end_date: Optional[date]) -> dict:
        return self.repo.get_environmental_data(department_id, start_date, end_date)

    def get_social_report(self, department_id: Optional[UUID], start_date: Optional[date], end_date: Optional[date]) -> dict:
        return self.repo.get_social_data(department_id, start_date, end_date)

    def get_governance_report(self, department_id: Optional[UUID], start_date: Optional[date], end_date: Optional[date]) -> dict:
        return self.repo.get_governance_data(department_id, start_date, end_date)

    def get_esg_summary_report(self, department_id: Optional[UUID]) -> dict:
        return self.repo.get_esg_summary_data(department_id)

    def create_template(self, name: str, description: Optional[str], config: dict, user_id: UUID) -> ReportTemplate:
        template = self.repo.create_template(name, description, config, user_id)
        self.session.commit()
        return template

    def get_templates(self) -> List[ReportTemplate]:
        return self.repo.get_templates()

    def log_export(self, report_type: str, export_format: str, user_id: UUID) -> ExportAuditLog:
        log = self.repo.log_export(report_type, export_format, user_id)
        self.session.commit()
        return log
