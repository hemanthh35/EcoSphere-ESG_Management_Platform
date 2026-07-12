from typing import Any, Optional


class EcoSphereBaseException(Exception):
    """Base exception for all EcoSphere custom exceptions."""

    def __init__(self, message: str, detail: Optional[Any] = None):
        self.message = message
        self.detail = detail
        super().__init__(self.message)

class ResourceNotFoundError(EcoSphereBaseException):
    def __init__(self, resource_id: str):
        super().__init__(
            message=f"Resource with id '{resource_id}' was not found.",
            detail={"resource_id": resource_id},
        )

class ResourceAlreadyExistsError(EcoSphereBaseException):
    def __init__(self, field: str, value: str):
        super().__init__(
            message=f"A resource with {field} '{value}' already exists.",
            detail={"field": field, "value": value},
        )


class DepartmentNotFoundError(EcoSphereBaseException):
    """Raised when a department cannot be found."""

    def __init__(self, dept_id: str):
        super().__init__(
            message=f"Department with id '{dept_id}' was not found.",
            detail={"dept_id": dept_id},
        )


class DepartmentAlreadyExistsError(EcoSphereBaseException):
    """Raised when a department with the same name or code already exists."""

    def __init__(self, field: str, value: str):
        super().__init__(
            message=f"A department with {field} '{value}' already exists.",
            detail={"field": field, "value": value},
        )


class InvalidDepartmentHierarchyError(EcoSphereBaseException):
    """Raised when a circular reference or too-deep hierarchy is detected."""

    def __init__(self, reason: str):
        super().__init__(
            message=f"Invalid department hierarchy: {reason}",
            detail={"reason": reason},
        )


class CannotDeleteDepartmentError(EcoSphereBaseException):
    """Raised when a department cannot be deleted due to dependencies."""

    def __init__(self, reason: str):
        super().__init__(
            message=f"Cannot delete department: {reason}",
            detail={"reason": reason},
        )
