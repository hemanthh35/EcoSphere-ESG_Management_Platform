from typing import Any, Generic, Optional, TypeVar
from pydantic import BaseModel

T = TypeVar("T")


class ResponseModel(BaseModel, Generic[T]):
    """Standard API response wrapper."""

    success: bool
    message: str
    data: Optional[T] = None

    @classmethod
    def ok(cls, data: T, message: str = "Success") -> "ResponseModel[T]":
        return cls(success=True, message=message, data=data)

    @classmethod
    def error(cls, message: str) -> "ResponseModel[None]":
        return cls(success=False, message=message, data=None)
