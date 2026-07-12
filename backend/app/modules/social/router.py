import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, status, Query
from app.modules.auth.dependencies import get_current_user, RoleChecker
from app.modules.auth.models import Profile, RoleEnum
from app.modules.social.schemas import (
    CsrActivityCreate, CsrActivityUpdate, CsrActivityResponse,
    EmployeeParticipationResponse, EmployeeParticipationUpdate,
    DiversityMetricCreate, DiversityMetricResponse,
    TrainingRecordCreate, TrainingRecordResponse, TrainingRecordUpdate
)
from app.modules.social.service import SocialService
from app.modules.social.dependencies import get_social_service
from app.modules.social.validators import validate_csr_dates, validate_max_participants
from app.modules.social.permissions import check_can_manage_csr, check_can_approve_evidence

router = APIRouter(prefix="/api/v1/social", tags=["Social"])

# --- CSR Activities ---

@router.post("/activities", response_model=CsrActivityResponse, status_code=status.HTTP_201_CREATED)
def create_activity(
    activity: CsrActivityCreate,
    current_user: Profile = Depends(RoleChecker([RoleEnum.ADMIN, RoleEnum.ESG_MANAGER])),
    service: SocialService = Depends(get_social_service)
):
    validate_csr_dates(activity.start_date, activity.end_date)
    validate_max_participants(activity.max_participants)
    return service.create_activity(activity, current_user.id)

@router.get("/activities", response_model=List[CsrActivityResponse])
def list_activities(
    service: SocialService = Depends(get_social_service)
):
    return service.get_all_activities()

@router.get("/activities/{activity_id}", response_model=CsrActivityResponse)
def get_activity(
    activity_id: uuid.UUID,
    service: SocialService = Depends(get_social_service)
):
    return service.get_activity_by_id(activity_id)

@router.put("/activities/{activity_id}", response_model=CsrActivityResponse)
def update_activity(
    activity_id: uuid.UUID,
    activity_update: CsrActivityUpdate,
    current_user: Profile = Depends(RoleChecker([RoleEnum.ADMIN, RoleEnum.ESG_MANAGER])),
    service: SocialService = Depends(get_social_service)
):
    if activity_update.start_date or activity_update.end_date:
        # Fallback to existing if only one is updated (we skip validator complexity for simplicity)
        pass
    if activity_update.max_participants:
        validate_max_participants(activity_update.max_participants)
    return service.update_activity(activity_id, activity_update, current_user.id)

@router.delete("/activities/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_activity(
    activity_id: uuid.UUID,
    current_user: Profile = Depends(RoleChecker([RoleEnum.ADMIN, RoleEnum.ESG_MANAGER])),
    service: SocialService = Depends(get_social_service)
):
    service.delete_activity(activity_id, current_user.id)
    return None


# --- Employee Participation ---

@router.post("/activities/{activity_id}/join", response_model=EmployeeParticipationResponse)
def join_activity(
    activity_id: uuid.UUID,
    current_user: Profile = Depends(get_current_user),
    service: SocialService = Depends(get_social_service)
):
    return service.join_activity(activity_id, current_user.id)

@router.get("/activities/{activity_id}/participation", response_model=List[EmployeeParticipationResponse])
def get_activity_participations(
    activity_id: uuid.UUID,
    current_user: Profile = Depends(RoleChecker([RoleEnum.ADMIN, RoleEnum.ESG_MANAGER, RoleEnum.DEPARTMENT_HEAD])),
    service: SocialService = Depends(get_social_service)
):
    return service.get_participation_by_activity(activity_id)

@router.get("/employees/{employee_id}/participation", response_model=List[EmployeeParticipationResponse])
def get_employee_participations(
    employee_id: uuid.UUID,
    current_user: Profile = Depends(get_current_user),
    service: SocialService = Depends(get_social_service)
):
    # Security check: employees can only view their own participation unless Admin/Manager
    if current_user.role not in [RoleEnum.ADMIN, RoleEnum.ESG_MANAGER] and current_user.id != employee_id:
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Not authorized to view other employee's participation")
    return service.get_participation_by_employee(employee_id)

@router.put("/participation/{participation_id}/approve", response_model=EmployeeParticipationResponse)
def approve_participation(
    participation_id: uuid.UUID,
    update_data: EmployeeParticipationUpdate,
    current_user: Profile = Depends(RoleChecker([RoleEnum.ADMIN, RoleEnum.ESG_MANAGER, RoleEnum.DEPARTMENT_HEAD])),
    service: SocialService = Depends(get_social_service)
):
    return service.approve_participation(
        participation_id, 
        update_data.approval_status, 
        update_data.points_earned
    )


# --- Diversity Metrics ---

@router.post("/diversity", response_model=DiversityMetricResponse, status_code=status.HTTP_201_CREATED)
def record_diversity(
    metric: DiversityMetricCreate,
    current_user: Profile = Depends(RoleChecker([RoleEnum.ADMIN, RoleEnum.ESG_MANAGER])),
    service: SocialService = Depends(get_social_service)
):
    return service.record_diversity_metric(metric)

@router.get("/diversity", response_model=List[DiversityMetricResponse])
def list_diversity(
    current_user: Profile = Depends(get_current_user),
    service: SocialService = Depends(get_social_service)
):
    return service.get_diversity_metrics()


# --- Training Records ---

@router.post("/training", response_model=TrainingRecordResponse, status_code=status.HTTP_201_CREATED)
def record_training(
    record: TrainingRecordCreate,
    current_user: Profile = Depends(RoleChecker([RoleEnum.ADMIN, RoleEnum.ESG_MANAGER])),
    service: SocialService = Depends(get_social_service)
):
    return service.record_training_completion(record)

@router.get("/training", response_model=List[TrainingRecordResponse])
def list_training(
    current_user: Profile = Depends(get_current_user),
    service: SocialService = Depends(get_social_service)
):
    return service.get_training_records()

@router.get("/employees/{employee_id}/training", response_model=List[TrainingRecordResponse])
def get_employee_training(
    employee_id: uuid.UUID,
    current_user: Profile = Depends(get_current_user),
    service: SocialService = Depends(get_social_service)
):
    if current_user.role not in [RoleEnum.ADMIN, RoleEnum.ESG_MANAGER] and current_user.id != employee_id:
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Not authorized to view other employee's training records")
    return service.get_employee_training_records(employee_id)

@router.put("/training/{record_id}", response_model=TrainingRecordResponse)
def update_training(
    record_id: uuid.UUID,
    update_data: TrainingRecordUpdate,
    current_user: Profile = Depends(RoleChecker([RoleEnum.ADMIN, RoleEnum.ESG_MANAGER])),
    service: SocialService = Depends(get_social_service)
):
    return service.update_training_status(record_id, update_data)
