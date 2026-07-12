import uuid
from typing import List, Tuple, Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_

from app.modules.environmental.models import EmissionFactor, CarbonTransaction, EnvironmentalGoal, GoalStatusEnum

class EnvironmentalRepository:
    def __init__(self, db: Session):
        self.db = db

    # --- Emission Factors ---
    
    def get_emission_factors(self, skip: int = 0, limit: int = 20, search: Optional[str] = None) -> Tuple[List[EmissionFactor], int]:
        query = self.db.query(EmissionFactor)
        if search:
            query = query.filter(
                or_(
                    EmissionFactor.factor_code.ilike(f"%{search}%"),
                    EmissionFactor.factor_name.ilike(f"%{search}%"),
                    EmissionFactor.category.ilike(f"%{search}%")
                )
            )
        total = query.count()
        items = query.order_by(EmissionFactor.created_at.desc()).offset(skip).limit(limit).all()
        return items, total

    def get_emission_factor_by_id(self, factor_id: uuid.UUID) -> Optional[EmissionFactor]:
        return self.db.query(EmissionFactor).filter(EmissionFactor.id == factor_id).first()

    def get_emission_factor_by_code(self, factor_code: str) -> Optional[EmissionFactor]:
        return self.db.query(EmissionFactor).filter(EmissionFactor.factor_code == factor_code).first()

    def create_emission_factor(self, factor: EmissionFactor) -> EmissionFactor:
        self.db.add(factor)
        self.db.commit()
        self.db.refresh(factor)
        return factor

    def update_emission_factor(self, factor: EmissionFactor) -> EmissionFactor:
        self.db.commit()
        self.db.refresh(factor)
        return factor

    def delete_emission_factor(self, factor: EmissionFactor) -> None:
        self.db.delete(factor)
        self.db.commit()

    # --- Carbon Transactions ---
    
    def get_carbon_transactions(self, skip: int = 0, limit: int = 20, search: Optional[str] = None, department_id: Optional[uuid.UUID] = None) -> Tuple[List[CarbonTransaction], int]:
        query = self.db.query(CarbonTransaction).options(
            joinedload(CarbonTransaction.department),
            joinedload(CarbonTransaction.emission_factor),
            joinedload(CarbonTransaction.product_esg_profile)
        )
        if search:
            query = query.filter(CarbonTransaction.transaction_number.ilike(f"%{search}%"))
        if department_id:
            query = query.filter(CarbonTransaction.department_id == department_id)
            
        total = query.count()
        items = query.order_by(CarbonTransaction.transaction_date.desc()).offset(skip).limit(limit).all()
        return items, total

    def get_carbon_transaction_by_id(self, tx_id: uuid.UUID) -> Optional[CarbonTransaction]:
        return self.db.query(CarbonTransaction).options(
            joinedload(CarbonTransaction.department),
            joinedload(CarbonTransaction.emission_factor),
            joinedload(CarbonTransaction.product_esg_profile)
        ).filter(CarbonTransaction.id == tx_id).first()

    def get_carbon_transaction_by_number(self, tx_number: str) -> Optional[CarbonTransaction]:
        return self.db.query(CarbonTransaction).filter(CarbonTransaction.transaction_number == tx_number).first()

    def create_carbon_transaction(self, tx: CarbonTransaction) -> CarbonTransaction:
        self.db.add(tx)
        self.db.commit()
        self.db.refresh(tx)
        return tx

    def update_carbon_transaction(self, tx: CarbonTransaction) -> CarbonTransaction:
        self.db.commit()
        self.db.refresh(tx)
        return tx

    def delete_carbon_transaction(self, tx: CarbonTransaction) -> None:
        self.db.delete(tx)
        self.db.commit()

    # --- Environmental Goals ---
    
    def get_environmental_goals(self, skip: int = 0, limit: int = 20, department_id: Optional[uuid.UUID] = None) -> Tuple[List[EnvironmentalGoal], int]:
        query = self.db.query(EnvironmentalGoal).options(joinedload(EnvironmentalGoal.department))
        if department_id:
            query = query.filter(EnvironmentalGoal.department_id == department_id)
            
        total = query.count()
        items = query.order_by(EnvironmentalGoal.deadline.asc()).offset(skip).limit(limit).all()
        return items, total

    def get_environmental_goal_by_id(self, goal_id: uuid.UUID) -> Optional[EnvironmentalGoal]:
        return self.db.query(EnvironmentalGoal).options(joinedload(EnvironmentalGoal.department)).filter(EnvironmentalGoal.id == goal_id).first()
        
    def get_active_goals_by_department(self, department_id: uuid.UUID) -> List[EnvironmentalGoal]:
        return self.db.query(EnvironmentalGoal).filter(
            EnvironmentalGoal.department_id == department_id,
            EnvironmentalGoal.status.in_([GoalStatusEnum.ACTIVE, GoalStatusEnum.ON_TRACK, GoalStatusEnum.AT_RISK])
        ).all()

    def create_environmental_goal(self, goal: EnvironmentalGoal) -> EnvironmentalGoal:
        self.db.add(goal)
        self.db.commit()
        self.db.refresh(goal)
        return goal

    def update_environmental_goal(self, goal: EnvironmentalGoal) -> EnvironmentalGoal:
        self.db.commit()
        self.db.refresh(goal)
        return goal

    def delete_environmental_goal(self, goal: EnvironmentalGoal) -> None:
        self.db.delete(goal)
        self.db.commit()
