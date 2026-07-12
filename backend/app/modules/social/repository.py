import uuid
from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy import select, and_, or_
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.modules.social.models import CsrActivity, EmployeeParticipation, DiversityMetric, TrainingRecord
from app.modules.social.schemas import (
    CsrActivityCreate, CsrActivityUpdate,
    EmployeeParticipationCreate, EmployeeParticipationUpdate,
    DiversityMetricCreate, DiversityMetricUpdate,
    TrainingRecordCreate, TrainingRecordUpdate
)

class CsrActivityRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_all(self) -> List[CsrActivity]:
        stmt = select(CsrActivity).where(CsrActivity.deleted_at.is_(None)).order_by(CsrActivity.created_at.desc())
        return list(self.session.scalars(stmt).all())

    def get_by_id(self, activity_id: uuid.UUID) -> Optional[CsrActivity]:
        stmt = select(CsrActivity).where(
            CsrActivity.id == activity_id,
            CsrActivity.deleted_at.is_(None)
        )
        return self.session.scalars(stmt).first()

    def create(self, activity: CsrActivityCreate, created_by: uuid.UUID) -> CsrActivity:
        db_activity = CsrActivity(
            **activity.model_dump(),
            created_by=created_by,
            updated_by=created_by
        )
        self.session.add(db_activity)
        self.session.commit()
        self.session.refresh(db_activity)
        return db_activity

    def update(self, activity_id: uuid.UUID, activity_update: CsrActivityUpdate, updated_by: uuid.UUID) -> Optional[CsrActivity]:
        db_activity = self.get_by_id(activity_id)
        if not db_activity:
            return None
        
        update_data = activity_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_activity, key, value)
            
        db_activity.updated_by = updated_by
        db_activity.updated_at = datetime.now(timezone.utc)
        
        self.session.commit()
        self.session.refresh(db_activity)
        return db_activity

    def delete(self, activity_id: uuid.UUID, deleted_by: uuid.UUID) -> bool:
        db_activity = self.get_by_id(activity_id)
        if not db_activity:
            return False
            
        db_activity.deleted_at = datetime.now(timezone.utc)
        db_activity.updated_by = deleted_by
        self.session.commit()
        return True

class EmployeeParticipationRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_activity(self, activity_id: uuid.UUID) -> List[EmployeeParticipation]:
        stmt = select(EmployeeParticipation).where(EmployeeParticipation.activity_id == activity_id)
        return list(self.session.scalars(stmt).all())

    def get_by_employee(self, employee_id: uuid.UUID) -> List[EmployeeParticipation]:
        stmt = select(EmployeeParticipation).where(EmployeeParticipation.employee_id == employee_id)
        return list(self.session.scalars(stmt).all())

    def get_by_employee_and_activity(self, employee_id: uuid.UUID, activity_id: uuid.UUID) -> Optional[EmployeeParticipation]:
        stmt = select(EmployeeParticipation).where(
            EmployeeParticipation.employee_id == employee_id,
            EmployeeParticipation.activity_id == activity_id
        )
        return self.session.scalars(stmt).first()

    def create(self, participation: EmployeeParticipationCreate, employee_id: uuid.UUID) -> EmployeeParticipation:
        db_participation = EmployeeParticipation(
            employee_id=employee_id,
            **participation.model_dump()
        )
        self.session.add(db_participation)
        self.session.commit()
        self.session.refresh(db_participation)
        return db_participation

    def update(self, participation_id: uuid.UUID, update_data: EmployeeParticipationUpdate) -> Optional[EmployeeParticipation]:
        db_participation = self.session.get(EmployeeParticipation, participation_id)
        if not db_participation:
            return None
            
        data_dict = update_data.model_dump(exclude_unset=True)
        for key, value in data_dict.items():
            setattr(db_participation, key, value)
            
        db_participation.updated_at = datetime.now(timezone.utc)
        self.session.commit()
        self.session.refresh(db_participation)
        return db_participation

class DiversityMetricRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_all(self) -> List[DiversityMetric]:
        stmt = select(DiversityMetric).order_by(DiversityMetric.reporting_period.desc())
        return list(self.session.scalars(stmt).all())

    def create(self, metric: DiversityMetricCreate) -> DiversityMetric:
        db_metric = DiversityMetric(**metric.model_dump())
        self.session.add(db_metric)
        self.session.commit()
        self.session.refresh(db_metric)
        return db_metric

class TrainingRecordRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_employee(self, employee_id: uuid.UUID) -> List[TrainingRecord]:
        stmt = select(TrainingRecord).where(TrainingRecord.employee_id == employee_id)
        return list(self.session.scalars(stmt).all())

    def get_all(self) -> List[TrainingRecord]:
        stmt = select(TrainingRecord)
        return list(self.session.scalars(stmt).all())

    def create(self, record: TrainingRecordCreate) -> TrainingRecord:
        db_record = TrainingRecord(**record.model_dump())
        self.session.add(db_record)
        self.session.commit()
        self.session.refresh(db_record)
        return db_record

    def update(self, record_id: uuid.UUID, update_data: TrainingRecordUpdate) -> Optional[TrainingRecord]:
        db_record = self.session.get(TrainingRecord, record_id)
        if not db_record:
            return None
            
        data_dict = update_data.model_dump(exclude_unset=True)
        for key, value in data_dict.items():
            setattr(db_record, key, value)
            
        db_record.updated_at = datetime.now(timezone.utc)
        self.session.commit()
        self.session.refresh(db_record)
        return db_record
