import uuid
from typing import List, Optional
from datetime import datetime, timezone
from fastapi import HTTPException, status
from app.modules.social.models import CsrActivity, EmployeeParticipation, DiversityMetric, TrainingRecord
from app.modules.social.repository import (
    CsrActivityRepository, EmployeeParticipationRepository,
    DiversityMetricRepository, TrainingRecordRepository
)
from app.modules.social.schemas import (
    CsrActivityCreate, CsrActivityUpdate,
    EmployeeParticipationCreate, EmployeeParticipationUpdate,
    DiversityMetricCreate, TrainingRecordCreate, TrainingRecordUpdate
)

class SocialService:
    def __init__(
        self,
        activity_repo: CsrActivityRepository,
        participation_repo: EmployeeParticipationRepository,
        diversity_repo: DiversityMetricRepository,
        training_repo: TrainingRecordRepository
    ):
        self.activity_repo = activity_repo
        self.participation_repo = participation_repo
        self.diversity_repo = diversity_repo
        self.training_repo = training_repo

    # --- CSR Activities ---
    def create_activity(self, activity: CsrActivityCreate, current_user_id: uuid.UUID) -> CsrActivity:
        # Check code uniqueness
        # (Could query database for activity_code if needed, let's keep it simple or do it in repository/router)
        return self.activity_repo.create(activity, current_user_id)

    def get_all_activities(self) -> List[CsrActivity]:
        return self.activity_repo.get_all()

    def get_activity_by_id(self, activity_id: uuid.UUID) -> CsrActivity:
        activity = self.activity_repo.get_by_id(activity_id)
        if not activity:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="CSR Activity not found")
        return activity

    def update_activity(self, activity_id: uuid.UUID, activity_update: CsrActivityUpdate, current_user_id: uuid.UUID) -> CsrActivity:
        activity = self.activity_repo.update(activity_id, activity_update, current_user_id)
        if not activity:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="CSR Activity not found")
        return activity

    def delete_activity(self, activity_id: uuid.UUID, current_user_id: uuid.UUID) -> bool:
        success = self.activity_repo.delete(activity_id, current_user_id)
        if not success:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="CSR Activity not found")
        return True

    # --- Employee Participation ---
    def join_activity(self, activity_id: uuid.UUID, employee_id: uuid.UUID) -> EmployeeParticipation:
        activity = self.get_activity_by_id(activity_id)
        
        # Check dates
        now = datetime.now(timezone.utc)
        if activity.end_date < now:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Activity has already ended")

        # Check unique participation
        existing = self.participation_repo.get_by_employee_and_activity(employee_id, activity_id)
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Already joined this activity")

        # Check capacity
        if activity.max_participants is not None:
            participants = self.participation_repo.get_by_activity(activity_id)
            if len(participants) >= activity.max_participants:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Activity is at maximum capacity")

        create_data = EmployeeParticipationCreate(activity_id=activity_id)
        return self.participation_repo.create(create_data, employee_id)

    def get_participation_by_activity(self, activity_id: uuid.UUID) -> List[EmployeeParticipation]:
        return self.participation_repo.get_by_activity(activity_id)

    def get_participation_by_employee(self, employee_id: uuid.UUID) -> List[EmployeeParticipation]:
        return self.participation_repo.get_by_employee(employee_id)

    def approve_participation(self, participation_id: uuid.UUID, approval_status: str, points_earned: int) -> EmployeeParticipation:
        if approval_status not in ["APPROVED", "REJECTED"]:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid approval status")
            
        update_data = EmployeeParticipationUpdate(
            approval_status=approval_status,
            points_earned=points_earned if approval_status == "APPROVED" else 0,
            completion_date=datetime.now(timezone.utc) if approval_status == "APPROVED" else None
        )
        
        participation = self.participation_repo.update(participation_id, update_data)
        if not participation:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Participation record not found")
        return participation

    # --- Diversity Metrics ---
    def record_diversity_metric(self, metric: DiversityMetricCreate) -> DiversityMetric:
        return self.diversity_repo.create(metric)

    def get_diversity_metrics(self) -> List[DiversityMetric]:
        return self.diversity_repo.get_all()

    # --- Training Records ---
    def record_training_completion(self, record: TrainingRecordCreate) -> TrainingRecord:
        return self.training_repo.create(record)

    def get_training_records(self) -> List[TrainingRecord]:
        return self.training_repo.get_all()

    def get_employee_training_records(self, employee_id: uuid.UUID) -> List[TrainingRecord]:
        return self.training_repo.get_by_employee(employee_id)

    def update_training_status(self, record_id: uuid.UUID, update_data: TrainingRecordUpdate) -> TrainingRecord:
        record = self.training_repo.update(record_id, update_data)
        if not record:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Training record not found")
        return record
