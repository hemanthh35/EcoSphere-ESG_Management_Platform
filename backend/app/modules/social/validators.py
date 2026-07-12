from datetime import datetime
from fastapi import HTTPException, status

def validate_csr_dates(start_date: datetime, end_date: datetime):
    if end_date < start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End date cannot be before start date."
        )

def validate_max_participants(max_participants: int):
    if max_participants is not None and max_participants <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum participants must be a positive integer."
        )
