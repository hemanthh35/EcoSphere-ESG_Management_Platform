import re
from fastapi import HTTPException
from pydantic import EmailStr

def validate_password_strength(password: str) -> bool:
    """
    Validates that a password is at least 8 characters long,
    contains at least one uppercase letter, one lowercase letter,
    one digit, and one special character.
    """
    if len(password) < 8:
        raise ValueError("Password must be at least 8 characters long")
    if not re.search(r"[a-z]", password):
        raise ValueError("Password must contain at least one lowercase letter")
    if not re.search(r"[A-Z]", password):
        raise ValueError("Password must contain at least one uppercase letter")
    if not re.search(r"\d", password):
        raise ValueError("Password must contain at least one digit")
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        raise ValueError("Password must contain at least one special character")
    return True

def validate_phone_number(phone: str) -> bool:
    """
    Simple validation for phone numbers.
    """
    if phone and not re.match(r"^\+?[1-9]\d{1,14}$", phone):
        raise ValueError("Invalid phone number format")
    return True
