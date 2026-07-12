from enum import Enum


class DepartmentStatus(str, Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"


class SortOrder(str, Enum):
    ASC = "asc"
    DESC = "desc"


class DepartmentSortField(str, Enum):
    NAME = "name"
    CODE = "code"
    STATUS = "status"
    CREATED_AT = "created_at"
    UPDATED_AT = "updated_at"


MAX_HIERARCHY_DEPTH = 10
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100
