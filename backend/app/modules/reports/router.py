from fastapi import APIRouter, Depends, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import date
from typing import Optional, List
import csv
import io

from app.database.session import get_db
from app.modules.auth.dependencies import get_current_user
from app.modules.auth.models import Profile
from .schemas import (
    EnvironmentalReportResponse, SocialReportResponse, GovernanceReportResponse,
    ESGSummaryReportResponse, ReportTemplateCreate, ReportTemplateResponse, ExportAuditLogResponse
)
from .service import ReportsService

router = APIRouter(prefix="/reports", tags=["Reports"])

def get_reports_service(db: Session = Depends(get_db)) -> ReportsService:
    return ReportsService(db)

@router.get("/environmental", response_model=EnvironmentalReportResponse)
def get_environmental_report(
    department_id: Optional[UUID] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    service: ReportsService = Depends(get_reports_service),
    current_user: Profile = Depends(get_current_user)
):
    return service.get_environmental_report(department_id, start_date, end_date)

@router.get("/social", response_model=SocialReportResponse)
def get_social_report(
    department_id: Optional[UUID] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    service: ReportsService = Depends(get_reports_service),
    current_user: Profile = Depends(get_current_user)
):
    return service.get_social_report(department_id, start_date, end_date)

@router.get("/governance", response_model=GovernanceReportResponse)
def get_governance_report(
    department_id: Optional[UUID] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    service: ReportsService = Depends(get_reports_service),
    current_user: Profile = Depends(get_current_user)
):
    return service.get_governance_report(department_id, start_date, end_date)

@router.get("/esg-summary", response_model=ESGSummaryReportResponse)
def get_esg_summary_report(
    department_id: Optional[UUID] = None,
    service: ReportsService = Depends(get_reports_service),
    current_user: Profile = Depends(get_current_user)
):
    return service.get_esg_summary_report(department_id)

@router.post("/templates", response_model=ReportTemplateResponse, status_code=status.HTTP_201_CREATED)
def create_template(
    data: ReportTemplateCreate,
    service: ReportsService = Depends(get_reports_service),
    current_user: Profile = Depends(get_current_user)
):
    return service.create_template(data.name, data.description, data.config, current_user.id)

@router.get("/templates", response_model=List[ReportTemplateResponse])
def get_templates(
    service: ReportsService = Depends(get_reports_service),
    current_user: Profile = Depends(get_current_user)
):
    return service.get_templates()

@router.get("/export/csv")
def export_report_csv(
    report_type: str = Query("environmental"),
    department_id: Optional[UUID] = None,
    service: ReportsService = Depends(get_reports_service),
    current_user: Profile = Depends(get_current_user)
):
    service.log_export(report_type, "csv", current_user.id)
    
    # Generate CSV dynamically based on report_type
    output = io.StringIO()
    writer = csv.writer(output)

    if report_type == "environmental":
        data = service.get_environmental_report(department_id, None, None)
        writer.writerow(["Environmental Report Summary"])
        writer.writerow([])
        writer.writerow(["Metric", "Value"])
        writer.writerow(["Total CO2 Reduction (kg)", data["total_co2_reduction"]])
        writer.writerow(["Total Energy Saved (kWh)", data["total_energy_saved"]])
        writer.writerow(["Total Water Conserved (L)", data["total_water_conserved"]])
        writer.writerow(["Total Waste Recycled (kg)", data["total_waste_recycled"]])
    elif report_type == "social":
        data = service.get_social_report(department_id, None, None)
        writer.writerow(["Social Report Summary"])
        writer.writerow([])
        writer.writerow(["Metric", "Value"])
        writer.writerow(["Total CSR Hours", data["total_csr_hours"]])
        writer.writerow(["CSR Participation Count", data["csr_participation_count"]])
        writer.writerow(["Average Diversity Score (%)", data["average_diversity_score"]])
        writer.writerow(["Training Completion Rate (%)", data["training_completion_rate"]])
    elif report_type == "governance":
        data = service.get_governance_report(department_id, None, None)
        writer.writerow(["Governance Report Summary"])
        writer.writerow([])
        writer.writerow(["Metric", "Value"])
        writer.writerow(["Active Policies Count", data["active_policies_count"]])
        writer.writerow(["Total Audits Count", data["total_audits_count"]])
        writer.writerow(["Completed Audits Count", data["completed_audits_count"]])
        writer.writerow(["Open Compliance Issues Count", data["open_compliance_issues_count"]])
    else:
        data = service.get_esg_summary_report(department_id)
        writer.writerow(["ESG Summary Report"])
        writer.writerow([])
        writer.writerow(["Score Type", "Score", "Weight"])
        writer.writerow(["Environmental Score", data["environmental_score"], data["weights"]["environmental"]])
        writer.writerow(["Social Score", data["social_score"], data["weights"]["social"]])
        writer.writerow(["Governance Score", data["governance_score"], data["weights"]["governance"]])
        writer.writerow(["Overall ESG Score", data["overall_esg_score"], 1.0])

    output.seek(0)
    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={report_type}_report.csv"}
    )
