from fastapi import HTTPException, status

class MaxParticipantsReachedException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CSR Activity has reached its maximum participant capacity."
        )

class AlreadyJoinedException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee has already registered for this CSR activity."
        )
