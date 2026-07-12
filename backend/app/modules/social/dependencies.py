from fastapi import Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.modules.social.repository import (
    CsrActivityRepository, EmployeeParticipationRepository,
    DiversityMetricRepository, TrainingRecordRepository
)
from app.modules.social.service import SocialService

def get_csr_activity_repository(db: Session = Depends(get_db)) -> CsrActivityRepository:
    return CsrActivityRepository(db)

def get_employee_participation_repository(db: Session = Depends(get_db)) -> EmployeeParticipationRepository:
    return EmployeeParticipationRepository(db)

def get_diversity_metric_repository(db: Session = Depends(get_db)) -> DiversityMetricRepository:
    return DiversityMetricRepository(db)

def get_training_record_repository(db: Session = Depends(get_db)) -> TrainingRecordRepository:
    return TrainingRecordRepository(db)

def get_social_service(
    activity_repo: CsrActivityRepository = Depends(get_csr_activity_repository),
    participation_repo: EmployeeParticipationRepository = Depends(get_employee_participation_repository),
    diversity_repo: DiversityMetricRepository = Depends(get_diversity_metric_repository),
    training_repo: TrainingRecordRepository = Depends(get_training_record_repository)
) -> SocialService:
    return SocialService(activity_repo, participation_repo, diversity_repo, training_repo)
