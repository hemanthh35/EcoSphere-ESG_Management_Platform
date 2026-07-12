import uuid
from typing import List, Tuple, Optional
from sqlalchemy.orm import Session, aliased
from sqlalchemy import func
from datetime import datetime, timezone

from app.modules.product_esg.models import ProductESGProfile, SustainabilityRating, ProductStatus
from app.modules.department.models import Department
from app.modules.category.models import Category
from app.modules.product_esg.schemas import ProductESGSortField
from app.core.constants import SortOrder

class ProductESGRepository:
    def __init__(self, db: Session):
        self.db = db

    def _active_query(self):
        return self.db.query(
            ProductESGProfile,
            Department.name.label("department_name"),
            Category.category_name.label("category_name")
        ).outerjoin(
            Department, ProductESGProfile.department_id == Department.id
        ).outerjoin(
            Category, ProductESGProfile.category_id == Category.id
        ).filter(ProductESGProfile.is_deleted == False)

    def get_by_id(self, product_id: uuid.UUID) -> Optional[dict]:
        res = self._active_query().filter(ProductESGProfile.id == product_id).first()
        if res:
            profile, dept_name, cat_name = res
            data = profile.__dict__.copy()
            data["department_name"] = dept_name
            data["category_name"] = cat_name
            return data
        return None

    def get_by_code(self, product_code: str) -> Optional[ProductESGProfile]:
        return self.db.query(ProductESGProfile).filter(
            ProductESGProfile.product_code == product_code,
            ProductESGProfile.is_deleted == False
        ).first()

    def create(self, **kwargs) -> ProductESGProfile:
        product = ProductESGProfile(**kwargs)
        self.db.add(product)
        self.db.commit()
        self.db.refresh(product)
        return product

    def update(self, product_id: uuid.UUID, **kwargs) -> Optional[ProductESGProfile]:
        product = self.db.query(ProductESGProfile).filter(
            ProductESGProfile.id == product_id,
            ProductESGProfile.is_deleted == False
        ).first()
        if not product:
            return None
            
        for key, value in kwargs.items():
            setattr(product, key, value)
            
        self.db.commit()
        self.db.refresh(product)
        return product

    def soft_delete(self, product_id: uuid.UUID, updated_by: uuid.UUID) -> Optional[ProductESGProfile]:
        product = self.db.query(ProductESGProfile).filter(ProductESGProfile.id == product_id).first()
        if not product:
            return None
            
        product.is_deleted = True
        product.deleted_at = datetime.now(timezone.utc)
        product.status = ProductStatus.INACTIVE
        product.updated_by = updated_by
        
        self.db.commit()
        self.db.refresh(product)
        return product

    def list_products(
        self,
        skip: int = 0,
        limit: int = 20,
        search: Optional[str] = None,
        department_id: Optional[uuid.UUID] = None,
        status: Optional[str] = None,
        sustainability_rating: Optional[str] = None,
        sort_by: ProductESGSortField = ProductESGSortField.CREATED_AT,
        sort_order: SortOrder = SortOrder.DESC
    ) -> Tuple[List[dict], int]:
        
        query = self._active_query()
        
        if search:
            pattern = f"%{search}%"
            query = query.filter(
                (ProductESGProfile.product_code.ilike(pattern)) |
                (ProductESGProfile.product_name.ilike(pattern))
            )
            
        if department_id:
            query = query.filter(ProductESGProfile.department_id == department_id)
            
        if status:
            query = query.filter(ProductESGProfile.status == status)
            
        if sustainability_rating:
            query = query.filter(ProductESGProfile.sustainability_rating == sustainability_rating)
            
        total = query.count()
        
        sort_col = getattr(ProductESGProfile, sort_by.value)
        if sort_order == SortOrder.DESC:
            query = query.order_by(sort_col.desc())
        else:
            query = query.order_by(sort_col.asc())
            
        items = query.offset(skip).limit(limit).all()
        
        results = []
        for profile, dept_name, cat_name in items:
            data = profile.__dict__.copy()
            data["department_name"] = dept_name
            data["category_name"] = cat_name
            results.append(data)
            
        return results, total

    def get_dropdown(self) -> List[dict]:
        res = self.db.query(ProductESGProfile).filter(
            ProductESGProfile.is_deleted == False,
            ProductESGProfile.status == ProductStatus.ACTIVE
        ).with_entities(
            ProductESGProfile.id,
            ProductESGProfile.product_code,
            ProductESGProfile.product_name,
            ProductESGProfile.esg_score
        ).all()
        return [{"id": r[0], "product_code": r[1], "product_name": r[2], "esg_score": r[3]} for r in res]

    def get_statistics(self) -> dict:
        total = self.db.query(ProductESGProfile).filter(ProductESGProfile.is_deleted == False).count()
        active = self.db.query(ProductESGProfile).filter(
            ProductESGProfile.is_deleted == False,
            ProductESGProfile.status == ProductStatus.ACTIVE
        ).count()
        
        avg_esg = self.db.query(func.avg(ProductESGProfile.esg_score)).filter(ProductESGProfile.is_deleted == False).scalar()
        avg_carbon = self.db.query(func.avg(ProductESGProfile.carbon_factor)).filter(ProductESGProfile.is_deleted == False).scalar()
        
        return {
            "total_products": total,
            "active_products": active,
            "avg_esg_score": round(float(avg_esg), 2) if avg_esg else None,
            "avg_carbon_factor": round(float(avg_carbon), 4) if avg_carbon else None
        }
