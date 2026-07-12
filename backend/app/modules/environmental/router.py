import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.modules.auth.dependencies import get_current_user, RoleChecker
from app.modules.auth.models import Profile, RoleEnum
from app.modules.environmental.service import EnvironmentalService
from app.modules.environmental.schemas import (
    EmissionFactorCreate, EmissionFactorUpdate, EmissionFactorResponse, PaginatedEmissionFactors,
    CarbonTransactionCreate, CarbonTransactionUpdate, CarbonTransactionResponse, PaginatedCarbonTransactions,
    EnvironmentalGoalCreate, EnvironmentalGoalUpdate, EnvironmentalGoalResponse, PaginatedEnvironmentalGoals
)

router = APIRouter(prefix="/api/v1/environmental", tags=["Environmental"])

def get_environmental_service(db: Session = Depends(get_db)) -> EnvironmentalService:
    return EnvironmentalService(db)

# --- Emission Factors ---

@router.get("/emission-factors", response_model=PaginatedEmissionFactors)
def list_emission_factors(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    service: EnvironmentalService = Depends(get_environmental_service),
    current_user: Profile = Depends(get_current_user),
):
    items, total = service.get_emission_factors(skip, limit, search)
    return {"items": items, "total": total}

@router.get("/emission-factors/{factor_id}", response_model=EmissionFactorResponse)
def get_emission_factor(
    factor_id: uuid.UUID,
    service: EnvironmentalService = Depends(get_environmental_service),
    current_user: Profile = Depends(get_current_user),
):
    return service.get_emission_factor(factor_id)

@router.post("/emission-factors", response_model=EmissionFactorResponse, status_code=status.HTTP_201_CREATED)
def create_emission_factor(
    payload: EmissionFactorCreate,
    service: EnvironmentalService = Depends(get_environmental_service),
    current_user: Profile = Depends(RoleChecker([RoleEnum.ADMIN, RoleEnum.ESG_MANAGER])),
):
    return service.create_emission_factor(payload, current_user.id)

@router.put("/emission-factors/{factor_id}", response_model=EmissionFactorResponse)
def update_emission_factor(
    factor_id: uuid.UUID,
    payload: EmissionFactorUpdate,
    service: EnvironmentalService = Depends(get_environmental_service),
    current_user: Profile = Depends(RoleChecker([RoleEnum.ADMIN, RoleEnum.ESG_MANAGER])),
):
    return service.update_emission_factor(factor_id, payload, current_user.id)

@router.delete("/emission-factors/{factor_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_emission_factor(
    factor_id: uuid.UUID,
    service: EnvironmentalService = Depends(get_environmental_service),
    current_user: Profile = Depends(RoleChecker([RoleEnum.ADMIN])),
):
    service.delete_emission_factor(factor_id)

# --- Carbon Transactions ---

@router.get("/carbon-transactions", response_model=PaginatedCarbonTransactions)
def list_carbon_transactions(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    department_id: Optional[uuid.UUID] = Query(None),
    service: EnvironmentalService = Depends(get_environmental_service),
    current_user: Profile = Depends(get_current_user),
):
    items, total = service.get_carbon_transactions(skip, limit, search, department_id)
    
    # Map relationships for UI
    for item in items:
        setattr(item, "department_name", item.department.name if item.department else None)
        setattr(item, "emission_factor_name", item.emission_factor.factor_name if item.emission_factor else None)
        setattr(item, "product_name", item.product_esg_profile.product_name if getattr(item, "product_esg_profile", None) else None)
        
    return {"items": items, "total": total}

@router.get("/carbon-transactions/{tx_id}", response_model=CarbonTransactionResponse)
def get_carbon_transaction(
    tx_id: uuid.UUID,
    service: EnvironmentalService = Depends(get_environmental_service),
    current_user: Profile = Depends(get_current_user),
):
    item = service.get_carbon_transaction(tx_id)
    setattr(item, "department_name", item.department.name if item.department else None)
    setattr(item, "emission_factor_name", item.emission_factor.factor_name if item.emission_factor else None)
    setattr(item, "product_name", item.product_esg_profile.product_name if getattr(item, "product_esg_profile", None) else None)
    return item

@router.post("/carbon-transactions", response_model=CarbonTransactionResponse, status_code=status.HTTP_201_CREATED)
def create_carbon_transaction(
    payload: CarbonTransactionCreate,
    service: EnvironmentalService = Depends(get_environmental_service),
    current_user: Profile = Depends(get_current_user),
):
    item = service.create_carbon_transaction(payload)
    setattr(item, "department_name", item.department.name if item.department else None)
    setattr(item, "emission_factor_name", item.emission_factor.factor_name if item.emission_factor else None)
    setattr(item, "product_name", item.product_esg_profile.product_name if getattr(item, "product_esg_profile", None) else None)
    return item

@router.put("/carbon-transactions/{tx_id}", response_model=CarbonTransactionResponse)
def update_carbon_transaction(
    tx_id: uuid.UUID,
    payload: CarbonTransactionUpdate,
    service: EnvironmentalService = Depends(get_environmental_service),
    current_user: Profile = Depends(RoleChecker([RoleEnum.ADMIN, RoleEnum.ESG_MANAGER])),
):
    item = service.update_carbon_transaction(tx_id, payload)
    setattr(item, "department_name", item.department.name if item.department else None)
    setattr(item, "emission_factor_name", item.emission_factor.factor_name if item.emission_factor else None)
    setattr(item, "product_name", item.product_esg_profile.product_name if getattr(item, "product_esg_profile", None) else None)
    return item

@router.delete("/carbon-transactions/{tx_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_carbon_transaction(
    tx_id: uuid.UUID,
    service: EnvironmentalService = Depends(get_environmental_service),
    current_user: Profile = Depends(RoleChecker([RoleEnum.ADMIN, RoleEnum.ESG_MANAGER])),
):
    service.delete_carbon_transaction(tx_id)

# --- Environmental Goals ---

@router.get("/goals", response_model=PaginatedEnvironmentalGoals)
def list_environmental_goals(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    department_id: Optional[uuid.UUID] = Query(None),
    service: EnvironmentalService = Depends(get_environmental_service),
    current_user: Profile = Depends(get_current_user),
):
    items, total = service.get_environmental_goals(skip, limit, department_id)
    
    for item in items:
        setattr(item, "department_name", item.department.name if item.department else None)
        
    return {"items": items, "total": total}

@router.get("/goals/{goal_id}", response_model=EnvironmentalGoalResponse)
def get_environmental_goal(
    goal_id: uuid.UUID,
    service: EnvironmentalService = Depends(get_environmental_service),
    current_user: Profile = Depends(get_current_user),
):
    item = service.get_environmental_goal(goal_id)
    setattr(item, "department_name", item.department.name if item.department else None)
    return item

@router.post("/goals", response_model=EnvironmentalGoalResponse, status_code=status.HTTP_201_CREATED)
def create_environmental_goal(
    payload: EnvironmentalGoalCreate,
    service: EnvironmentalService = Depends(get_environmental_service),
    current_user: Profile = Depends(RoleChecker([RoleEnum.ADMIN, RoleEnum.ESG_MANAGER])),
):
    item = service.create_environmental_goal(payload)
    # The repository doesn't auto-join on create, so we can fetch it or just omit dept_name for the response
    item = service.get_environmental_goal(item.id) 
    setattr(item, "department_name", item.department.name if item.department else None)
    return item

@router.put("/goals/{goal_id}", response_model=EnvironmentalGoalResponse)
def update_environmental_goal(
    goal_id: uuid.UUID,
    payload: EnvironmentalGoalUpdate,
    service: EnvironmentalService = Depends(get_environmental_service),
    current_user: Profile = Depends(RoleChecker([RoleEnum.ADMIN, RoleEnum.ESG_MANAGER])),
):
    item = service.update_environmental_goal(goal_id, payload)
    item = service.get_environmental_goal(item.id)
    setattr(item, "department_name", item.department.name if item.department else None)
    return item

@router.delete("/goals/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_environmental_goal(
    goal_id: uuid.UUID,
    service: EnvironmentalService = Depends(get_environmental_service),
    current_user: Profile = Depends(RoleChecker([RoleEnum.ADMIN, RoleEnum.ESG_MANAGER])),
):
    service.delete_environmental_goal(goal_id)
