from fastapi import HTTPException, status

class EnvironmentalException(HTTPException):
    def __init__(self, status_code: int, detail: str):
        super().__init__(status_code=status_code, detail=detail)

class EmissionFactorNotFound(EnvironmentalException):
    def __init__(self, detail: str = "Emission Factor not found"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)

class EmissionFactorCodeExists(EnvironmentalException):
    def __init__(self, detail: str = "Emission Factor with this code already exists"):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)

class CarbonTransactionNotFound(EnvironmentalException):
    def __init__(self, detail: str = "Carbon Transaction not found"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)

class CarbonTransactionNumberExists(EnvironmentalException):
    def __init__(self, detail: str = "Carbon Transaction with this number already exists"):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)

class EnvironmentalGoalNotFound(EnvironmentalException):
    def __init__(self, detail: str = "Environmental Goal not found"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)

class InvalidReferenceError(EnvironmentalException):
    def __init__(self, detail: str = "Invalid reference ID provided"):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)
