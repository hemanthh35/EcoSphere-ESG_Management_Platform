import uuid
from typing import List, Tuple, Optional
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from app.modules.environmental.repository import EnvironmentalRepository
from app.modules.environmental.models import (
    EmissionFactor, CarbonTransaction, EnvironmentalGoal, GoalStatusEnum, FactorStatusEnum
)
from app.modules.environmental.schemas import (
    EmissionFactorCreate, EmissionFactorUpdate,
    CarbonTransactionCreate, CarbonTransactionUpdate,
    EnvironmentalGoalCreate, EnvironmentalGoalUpdate
)
from app.modules.environmental.exceptions import (
    EmissionFactorNotFound, EmissionFactorCodeExists,
    CarbonTransactionNotFound, CarbonTransactionNumberExists,
    EnvironmentalGoalNotFound, InvalidReferenceError
)
from app.modules.department.models import Department
from app.modules.product_esg.models import ProductESGProfile

class EnvironmentalService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = EnvironmentalRepository(db)

    # --- Emission Factors ---
    
    def get_emission_factors(self, skip: int = 0, limit: int = 20, search: Optional[str] = None) -> Tuple[List[EmissionFactor], int]:
        return self.repository.get_emission_factors(skip, limit, search)

    def get_emission_factor(self, factor_id: uuid.UUID) -> EmissionFactor:
        factor = self.repository.get_emission_factor_by_id(factor_id)
        if not factor:
            raise EmissionFactorNotFound()
        return factor

    def create_emission_factor(self, data: EmissionFactorCreate, user_id: uuid.UUID) -> EmissionFactor:
        if self.repository.get_emission_factor_by_code(data.factor_code):
            raise EmissionFactorCodeExists()
            
        new_factor = EmissionFactor(
            **data.dict(),
            created_by=user_id,
            updated_by=user_id
        )
        return self.repository.create_emission_factor(new_factor)

    def update_emission_factor(self, factor_id: uuid.UUID, data: EmissionFactorUpdate, user_id: uuid.UUID) -> EmissionFactor:
        factor = self.get_emission_factor(factor_id)
        
        if data.factor_code and data.factor_code != factor.factor_code:
            if self.repository.get_emission_factor_by_code(data.factor_code):
                raise EmissionFactorCodeExists()
                
        update_data = data.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(factor, key, value)
            
        factor.updated_by = user_id
        return self.repository.update_emission_factor(factor)

    def delete_emission_factor(self, factor_id: uuid.UUID) -> None:
        factor = self.get_emission_factor(factor_id)
        self.repository.delete_emission_factor(factor)

    # --- Carbon Transactions ---

    def _validate_references(self, department_id: Optional[uuid.UUID], product_id: Optional[uuid.UUID], factor_id: Optional[uuid.UUID]) -> None:
        if department_id:
            dept = self.db.query(Department).filter(Department.id == department_id).first()
            if not dept:
                raise InvalidReferenceError(f"Department with ID {department_id} not found")
        if product_id:
            prod = self.db.query(ProductESGProfile).filter(ProductESGProfile.id == product_id).first()
            if not prod:
                raise InvalidReferenceError(f"Product with ID {product_id} not found")
        if factor_id:
            factor = self.db.query(EmissionFactor).filter(EmissionFactor.id == factor_id).first()
            if not factor:
                raise InvalidReferenceError(f"Emission factor with ID {factor_id} not found")
            if factor.status != FactorStatusEnum.ACTIVE:
                raise InvalidReferenceError(f"Emission factor {factor.factor_code} is not active")

    def get_carbon_transactions(self, skip: int = 0, limit: int = 20, search: Optional[str] = None, department_id: Optional[uuid.UUID] = None) -> Tuple[List[CarbonTransaction], int]:
        return self.repository.get_carbon_transactions(skip, limit, search, department_id)

    def get_carbon_transaction(self, tx_id: uuid.UUID) -> CarbonTransaction:
        tx = self.repository.get_carbon_transaction_by_id(tx_id)
        if not tx:
            raise CarbonTransactionNotFound()
        return tx

    def _update_department_goals(self, department_id: uuid.UUID, emission_amount: float) -> None:
        active_goals = self.repository.get_active_goals_by_department(department_id)
        for goal in active_goals:
            goal.current_co2 += emission_amount
            if goal.target_co2 > 0:
                goal.progress_percentage = min(100.0, (goal.current_co2 / goal.target_co2) * 100)
                
            if goal.current_co2 >= goal.target_co2:
                goal.status = GoalStatusEnum.MISSED
            elif goal.progress_percentage > 90:
                goal.status = GoalStatusEnum.AT_RISK
                
            self.repository.update_environmental_goal(goal)

    def create_carbon_transaction(self, data: CarbonTransactionCreate) -> CarbonTransaction:
        if self.repository.get_carbon_transaction_by_number(data.transaction_number):
            raise CarbonTransactionNumberExists()
            
        self._validate_references(data.department_id, data.product_esg_profile_id, data.emission_factor_id)
        
        factor = self.get_emission_factor(data.emission_factor_id)
        calculated_emission = data.quantity * factor.co2e_factor
        
        new_tx = CarbonTransaction(
            **data.dict(),
            calculated_emission=calculated_emission
        )
        
        tx = self.repository.create_carbon_transaction(new_tx)
        
        # Update goal progress
        self._update_department_goals(tx.department_id, calculated_emission)
        
        return self.get_carbon_transaction(tx.id) # return joined

    def update_carbon_transaction(self, tx_id: uuid.UUID, data: CarbonTransactionUpdate) -> CarbonTransaction:
        tx = self.get_carbon_transaction(tx_id)
        
        self._validate_references(data.department_id, data.product_esg_profile_id, data.emission_factor_id)
        
        old_emission = tx.calculated_emission
        
        update_data = data.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(tx, key, value)
            
        # Recalculate emission if quantity or factor changed
        if "quantity" in update_data or "emission_factor_id" in update_data:
            factor = self.get_emission_factor(tx.emission_factor_id)
            tx.calculated_emission = tx.quantity * factor.co2e_factor
            
        updated_tx = self.repository.update_carbon_transaction(tx)
        
        # Adjust goals if emission changed
        if old_emission != updated_tx.calculated_emission:
            diff = updated_tx.calculated_emission - old_emission
            self._update_department_goals(updated_tx.department_id, diff)
            
        return self.get_carbon_transaction(updated_tx.id)

    def delete_carbon_transaction(self, tx_id: uuid.UUID) -> None:
        tx = self.get_carbon_transaction(tx_id)
        emission_to_remove = tx.calculated_emission
        dept_id = tx.department_id
        
        self.repository.delete_carbon_transaction(tx)
        
        # Adjust goals (subtract emission)
        self._update_department_goals(dept_id, -emission_to_remove)

    # --- Environmental Goals ---
    
    def get_environmental_goals(self, skip: int = 0, limit: int = 20, department_id: Optional[uuid.UUID] = None) -> Tuple[List[EnvironmentalGoal], int]:
        return self.repository.get_environmental_goals(skip, limit, department_id)

    def get_environmental_goal(self, goal_id: uuid.UUID) -> EnvironmentalGoal:
        goal = self.repository.get_environmental_goal_by_id(goal_id)
        if not goal:
            raise EnvironmentalGoalNotFound()
        return goal

    def create_environmental_goal(self, data: EnvironmentalGoalCreate) -> EnvironmentalGoal:
        self._validate_references(data.department_id, None, None)
        
        new_goal = EnvironmentalGoal(
            **data.dict(),
            current_co2=0.0,
            progress_percentage=0.0
        )
        return self.repository.create_environmental_goal(new_goal)

    def update_environmental_goal(self, goal_id: uuid.UUID, data: EnvironmentalGoalUpdate) -> EnvironmentalGoal:
        goal = self.get_environmental_goal(goal_id)
        self._validate_references(data.department_id, None, None)
        
        update_data = data.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(goal, key, value)
            
        if "target_co2" in update_data and goal.target_co2 > 0:
            goal.progress_percentage = min(100.0, (goal.current_co2 / goal.target_co2) * 100)
            
        return self.repository.update_environmental_goal(goal)

    def delete_environmental_goal(self, goal_id: uuid.UUID) -> None:
        goal = self.get_environmental_goal(goal_id)
        self.repository.delete_environmental_goal(goal)
