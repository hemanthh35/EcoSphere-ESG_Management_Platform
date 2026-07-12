from app.core.exceptions import EcoSphereBaseException

class DuplicateProductCodeError(EcoSphereBaseException):
    def __init__(self, product_code: str):
        super().__init__(
            message=f"A product with code '{product_code}' already exists.",
            detail={"product_code": product_code}
        )

class InvalidCarbonFactorError(EcoSphereBaseException):
    def __init__(self, carbon_factor: float):
        super().__init__(
            message=f"Carbon factor cannot be negative. Received {carbon_factor}",
            detail={"carbon_factor": carbon_factor}
        )

class InvalidESGScoreError(EcoSphereBaseException):
    def __init__(self, esg_score: float):
        super().__init__(
            message=f"ESG Score must be between 0 and 100. Received {esg_score}",
            detail={"esg_score": esg_score}
        )

class ProductInUseError(EcoSphereBaseException):
    def __init__(self, product_id: str):
        super().__init__(
            message=f"Product '{product_id}' cannot be deleted because it is referenced in transactions.",
            detail={"product_id": product_id}
        )
