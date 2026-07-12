from fastapi import HTTPException, status

class EmployeeNotFound(HTTPException):
    def __init__(self):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")

class DuplicateEmployeeCode(HTTPException):
    def __init__(self):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail="Employee code already exists")

class DuplicateEmail(HTTPException):
    def __init__(self):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")

class InvalidManager(HTTPException):
    def __init__(self):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid manager selected. Cannot be self or inactive.")

class EmployeeCannotDelete(HTTPException):
    def __init__(self, reason: str):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Cannot delete employee: {reason}")
