import uuid
from typing import List, Tuple, Optional
from sqlalchemy.orm import Session

from app.modules.product_esg.repository import ProductESGRepository
from app.modules.product_esg.schemas import (
    ProductESGProfileCreate,
    ProductESGProfileUpdate,
    ProductESGSortField
)
from app.core.exceptions import ResourceNotFoundError
from app.modules.product_esg.exceptions import (
    DuplicateProductCodeError,
    InvalidCarbonFactorError,
    InvalidESGScoreError
)
from app.modules.department.repository import DepartmentRepository
from app.core.constants import SortOrder

class ProductESGService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = ProductESGRepository(db)
        self.dept_repo = DepartmentRepository(db)

    def _validate_esg_data(self, data):
        if data.get("carbon_factor") is not None and data["carbon_factor"] < 0:
            raise InvalidCarbonFactorError(data["carbon_factor"])
        if data.get("esg_score") is not None and not (0 <= data["esg_score"] <= 100):
            raise InvalidESGScoreError(data["esg_score"])

    def create_product(self, payload: ProductESGProfileCreate, created_by: uuid.UUID) -> dict:
        data = payload.model_dump(exclude_unset=True)
        
        # Check uniqueness
        if self.repo.get_by_code(data["product_code"]):
            raise DuplicateProductCodeError(data["product_code"])
            
        # Check department
        if not self.dept_repo.get_by_id(data["department_id"]):
            raise ResourceNotFoundError(str(data["department_id"]))
            
        # Validate ESG limits
        self._validate_esg_data(data)
        
        data["created_by"] = created_by
        product = self.repo.create(**data)
        return self.repo.get_by_id(product.id)

    def get_product(self, product_id: uuid.UUID) -> dict:
        product = self.repo.get_by_id(product_id)
        if not product:
            raise ResourceNotFoundError(str(product_id))
        return product

    def list_products(
        self,
        skip: int,
        limit: int,
        search: Optional[str],
        department_id: Optional[uuid.UUID],
        status: Optional[str],
        sustainability_rating: Optional[str],
        sort_by: ProductESGSortField,
        sort_order: SortOrder
    ) -> Tuple[List[dict], int]:
        return self.repo.list_products(skip, limit, search, department_id, status, sustainability_rating, sort_by, sort_order)

    def update_product(self, product_id: uuid.UUID, payload: ProductESGProfileUpdate, updated_by: uuid.UUID) -> dict:
        existing = self.repo.get_by_id(product_id)
        if not existing:
            raise ResourceNotFoundError(str(product_id))
            
        data = payload.model_dump(exclude_unset=True)
        
        if "product_code" in data and data["product_code"] != existing["product_code"]:
            if self.repo.get_by_code(data["product_code"]):
                raise DuplicateProductCodeError(data["product_code"])
                
        if "department_id" in data and data["department_id"] != existing["department_id"]:
            if not self.dept_repo.get_by_id(data["department_id"]):
                raise ResourceNotFoundError(str(data["department_id"]))
                
        self._validate_esg_data(data)
        
        data["updated_by"] = updated_by
        self.repo.update(product_id, **data)
        return self.repo.get_by_id(product_id)

    def delete_product(self, product_id: uuid.UUID, updated_by: uuid.UUID) -> dict:
        existing = self.repo.get_by_id(product_id)
        if not existing:
            raise ResourceNotFoundError(str(product_id))
            
        # TODO: Check if referenced in Carbon Transactions once that module exists
        # if carbon_transactions_repo.is_referenced(product_id):
        #     raise ProductInUseError(str(product_id))
            
        product = self.repo.soft_delete(product_id, updated_by)
        return self.repo.get_by_id(product_id)

    def get_dropdown(self) -> List[dict]:
        return self.repo.get_dropdown()

    def get_statistics(self) -> dict:
        return self.repo.get_statistics()
