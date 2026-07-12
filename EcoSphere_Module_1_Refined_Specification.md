# EcoSphere ESG Management Platform
## Module 1: Department Management - Comprehensive Specification
**Version:** 1.0  
**Status:** Production  
**Author:** Enterprise Architecture Team  
**Last Updated:** 2026  

---

## EXECUTIVE SUMMARY

You are building **Module 1: Department Management** — the foundational Master Data module for EcoSphere ESG Management Platform. This module serves as the organizational hierarchy backbone for all subsequent ESG tracking, compliance, and gamification features.

**Critical Success Criteria:**
- Production-grade architecture, not prototype code
- Enterprise-level design system with zero generic UI patterns
- Full stack integration: Database → Backend → Frontend
- Comprehensive validation and error handling
- Performance optimized for 10,000+ departments
- Security hardened per OWASP standards
- Fully tested with 90%+ code coverage

---

## PROJECT CONTEXT & VISION

**EcoSphere** is an integrated ESG Management Platform that combines:
- Environmental tracking (carbon accounting, emission factors)
- Social initiatives (CSR activities, employee participation)
- Governance compliance (policies, audits, compliance issues)
- Gamification (challenges, badges, XP, rewards, leaderboards)

**Department Management** is the master data foundation:
- Organizations establish departments as ESG ownership units
- Every transaction, policy, employee, and metric rolls up to departments
- Department hierarchy enables cascading ESG responsibility
- All reporting aggregates department-level scores

**This module will become the template architecture for all remaining modules.** Every architectural decision, pattern, and code quality standard must be replicable.

---

## TECHNOLOGY STACK & CONSTRAINTS

### Frontend
```
React 19.x
TypeScript 5.x (strict mode)
Vite 6.x
Tailwind CSS 4.x
shadcn/ui (latest)
Lucide React (latest)
React Router DOM 7.x
React Hook Form 7.x
Zod 3.x (schema validation)
TanStack Query (React Query) 5.x
TanStack Table 8.x (data tables)
Axios 1.x
Recharts 2.x (charts, if needed)
Framer Motion 11.x (animations)
```

### Backend
```
FastAPI 0.104+
Python 3.12+
SQLAlchemy 2.0+ (ORM)
Pydantic V2 (validation)
Alembic 1.13+ (migrations)
Uvicorn (ASGI)
python-jose (JWT)
python-multipart (file uploads)
python-dotenv (config)
structlog (structured logging)
pytest 7.x (testing)
```

### Database
```
Supabase PostgreSQL 15+
UUID primary keys (native)
PostGIS extension (optional, for geo-location)
```

### Authentication & Storage
```
Supabase Auth (JWT-based)
Supabase Storage (file attachments)
```

### DevOps & Deployment
```
Docker & Docker Compose
GitHub Actions (CI/CD)
Environment: Development, Staging, Production
```

---

## PART 1: DESIGN SYSTEM & VISUAL IDENTITY

### 1.1 Design Philosophy

**Principles:**
- **Professional Minimalism:** No unnecessary gradients, shadows, or decorative elements
- **Enterprise Clarity:** Information hierarchy must be immediately obvious
- **Accessibility First:** WCAG 2.1 AA compliance minimum
- **Consistency:** Single source of truth for all design tokens
- **Performance:** Every animation must be justified; no bloat
- **Semantic:** Component names reflect purpose, not appearance

### 1.2 Color Palette

**Primary Brand Colors** (ESG-Aligned):
```
Green (Environmental) - #10B981
  - Hover: #059669
  - Active: #047857
  - Light bg: #F0FDF4

Blue (Social) - #3B82F6
  - Hover: #2563EB
  - Active: #1D4ED8
  - Light bg: #F0F9FF

Slate (Governance) - #475569
  - Hover: #334155
  - Active: #1E293B
  - Light bg: #F1F5F9

Amber (Compliance/Warning) - #F59E0B
  - Hover: #D97706
  - Active: #B45309
  - Light bg: #FFFBEB
```

**Neutral Scale** (No pure black):
```
Slate-50: #F8FAFC   (Background, very light)
Slate-100: #F1F5F9  (Background, light)
Slate-200: #E2E8F0  (Borders, dividers)
Slate-300: #CBD5E1  (Subtle text)
Slate-400: #94A3B8  (Secondary text)
Slate-500: #64748B  (Primary text, muted)
Slate-600: #475569  (Primary text)
Slate-700: #334155  (Headings)
Slate-800: #1E293B  (Strong emphasis)
Slate-900: #0F172A  (Rare, maximum contrast)
```

**Semantic Colors:**
```
Success: #10B981 (Operations completed)
Warning: #F59E0B (Requires attention)
Error: #EF4444 (Critical issues)
Info: #3B82F6 (Informational)
Disabled: #D1D5DB with 50% opacity
```

**Background Strategy:**
- Primary background: Slate-50 or White
- Secondary background: Slate-100 (cards, panels)
- Dark background: NEVER use pure black (#000000)
  - Maximum darkness: Slate-900 (#0F172A) only for text
  - Modal/overlay: Slate-950 with 30% opacity

### 1.3 Typography System

**Font Stack:**
```
Primary Font: Inter (Google Fonts)
  - Weights: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
  
Monospace: Fira Code (for code blocks, IDs)
  - Weight: 400, 500
```

**Scale & Hierarchy:**

| Usage | Size | Line Height | Weight | Letter Spacing | Example |
|-------|------|-------------|--------|-----------------|---------|
| Page Title (H1) | 32px | 1.2 (38px) | 700 | -0.01em | "Department Management" |
| Section Title (H2) | 24px | 1.3 (31px) | 600 | -0.005em | "Active Departments" |
| Subsection (H3) | 18px | 1.4 (25px) | 600 | 0 | "Department Details" |
| Body Text | 14px | 1.6 (22px) | 400 | 0 | Standard paragraph text |
| Body Emphasis | 14px | 1.6 (22px) | 500 | 0 | Form labels, strong emphasis |
| Small Text | 12px | 1.5 (18px) | 400 | 0.02em | Metadata, timestamps |
| Button Text | 14px | 1.4 (20px) | 500 | 0.03em | CTA buttons |
| Badge Text | 11px | 1.4 (15px) | 500 | 0.05em | Status badges |

**Text Color Hierarchy:**
```
Primary Text: Slate-700 (#334155)
Secondary Text: Slate-500 (#64748B)
Tertiary Text: Slate-400 (#94A3B8)
Disabled Text: Slate-300 (#CBD5E1)
```

### 1.4 Spacing System (8px Base Unit)

```
xs: 4px
sm: 8px
md: 12px
lg: 16px
xl: 24px
2xl: 32px
3xl: 48px
4xl: 64px
```

**Common Spacing:**
- Page padding: 24px (lg)
- Card padding: 16px (lg) or 20px
- Element gaps: 8px-16px
- Form field spacing: 12px (md)
- Section spacing: 32px-48px (2xl-3xl)

### 1.5 Component Token Specifications

#### Buttons
```
Primary Button (CTA)
  - Background: Green-600 (#10B981)
  - Text: White
  - Padding: 8px 16px (sm vertical, lg horizontal)
  - Border Radius: 6px
  - Font: 14px, 500 weight
  - Hover: Green-700, shadow-sm
  - Active: Green-800
  - Disabled: Slate-300 background, Slate-400 text, 50% opacity
  - Focus Ring: 2px solid Green-500, offset 2px

Secondary Button
  - Background: Slate-100
  - Text: Slate-700
  - Border: 1px solid Slate-200
  - Same padding/radius as primary
  - Hover: Slate-200, border Slate-300
  - Active: Slate-300, border Slate-400
  - Focus: Green-500 ring

Tertiary Button (Ghost)
  - No background
  - Text: Green-600
  - Hover: Green-100 background
  - Active: Green-200 background
  - Focus: Green-500 ring

Icon Button
  - Size: 32px × 32px
  - Padding: 6px
  - Border radius: 4px
  - Hover: Slate-100 background
```

#### Form Fields
```
Input & Textarea
  - Background: White or Slate-50
  - Border: 1px solid Slate-200
  - Padding: 8px 12px (sm vertical, md horizontal)
  - Border Radius: 6px
  - Font: 14px, 400 weight
  - Focus: Border Green-500, ring-2 Green-500 at 30% opacity
  - Error: Border #EF4444, ring #FCA5A5
  - Disabled: Background Slate-100, text Slate-400

Label
  - Font: 14px, 500 weight
  - Color: Slate-600
  - Margin Bottom: 6px
  - Required indicator: Red asterisk (*) in Gray-500
```

#### Cards
```
Default Card
  - Background: White
  - Border: 1px solid Slate-200
  - Padding: 16px (lg)
  - Border Radius: 8px
  - Box Shadow: 0 1px 2px rgba(0,0,0,0.05)

Hover Card
  - Shadow: 0 4px 6px rgba(0,0,0,0.07)
  - Border: 1px solid Slate-300
  - Transition: 150ms ease-in-out

Interactive Card (Row)
  - Cursor: pointer
  - Hover: Background Slate-50, shadow elevation
  - Active: Background Slate-100, border Green-300
```

#### Status Badges
```
Active
  - Background: Green-100
  - Text: Green-800
  - Border: 1px solid Green-300

Inactive
  - Background: Slate-100
  - Text: Slate-700
  - Border: 1px solid Slate-300

Draft
  - Background: Slate-50
  - Text: Slate-600
  - Border: 1px dashed Slate-300
```

#### Data Table
```
Header Row
  - Background: Slate-50
  - Border Bottom: 1px solid Slate-200
  - Font: 12px, 600 weight, Slate-700

Body Row
  - Border Bottom: 1px solid Slate-200
  - Hover: Background Slate-50
  - Selected: Background Green-50, border-left 3px Green-600

Cell Padding: 12px (md vertical), 16px (lg horizontal)
```

### 1.6 Elevation & Shadows

```
Shadow-xs (subtle): 0 1px 2px 0 rgba(0,0,0,0.05)
Shadow-sm (default): 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)
Shadow-md (elevated): 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)
Shadow-lg (modal): 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)
Shadow-xl (premium): 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)
```

**Usage:**
- Cards: shadow-sm
- Hovered cards: shadow-md
- Dropdowns/popovers: shadow-md
- Modals: shadow-lg
- Toast notifications: shadow-md

### 1.7 Border Radius Specifications

```
xs: 2px (minimal rounding, icon buttons)
sm: 4px (tables, badges)
md: 6px (form fields, small components)
lg: 8px (cards, large components)
xl: 12px (large modals, hero sections)
full: 9999px (pill buttons, avatars)
```

### 1.8 Animations & Transitions

**Timing Functions:**
```
Fast (UI feedback): 150ms cubic-bezier(0.4, 0, 0.2, 1) - easeInOut
Normal (transitions): 300ms cubic-bezier(0.4, 0, 0.2, 1) - easeInOut
Slow (entrance): 500ms cubic-bezier(0.4, 0, 0.2, 1) - easeInOut
```

**Approved Animations:**
- **Fade:** Opacity 0 → 1, duration 150ms
- **Slide-up:** Transform translateY(8px) → 0, duration 300ms
- **Hover elevation:** Shadow transition, duration 150ms
- **Loading spinner:** Rotation 360deg, duration 1s, infinite linear
- **Skeleton pulse:** Opacity 1 → 0.5 → 1, duration 2s, infinite
- **Toast slide-in:** Transform translateX(-100%) → 0, duration 300ms

**NO animations for:**
- Route transitions (handled by React Router)
- Table data updates (distracting)
- Form field changes (user-triggered)

### 1.9 Responsive Design Breakpoints

```
Mobile: 320px - 640px (default)
Tablet: 641px - 1024px (md)
Desktop: 1025px - 1440px (lg)
Wide: 1441px+ (xl, 2xl)
```

**Mobile-First Strategy:**
- Design for mobile first (320px)
- Layer tablet enhancements (md)
- Add desktop refinements (lg)
- Optimize wide layouts (xl, 2xl)

**Breakpoint Usage:**
```
Mobile: Single column, full-width components
Tablet: Two-column layouts, optimized spacing
Desktop: Three-column + sidebar, expanded UI
```

### 1.10 Accessibility Standards

**Compliance:**
- WCAG 2.1 AA minimum
- Keyboard navigation (Tab, Enter, Escape)
- Screen reader compatibility (ARIA labels)
- Color contrast: 4.5:1 for normal text, 3:1 for large text
- Focus indicators: Always visible, 2px offset

**Keyboard Navigation:**
- Tab order follows visual flow
- Escape closes modals/dropdowns
- Enter triggers primary action
- Arrow keys navigate tables/lists

**Screen Reader:**
- All interactive elements have aria-label or visible labels
- Data tables have proper <th> headers
- Form fields have associated <label> elements
- Loading states use aria-live="polite"
- Errors use role="alert"

---

## PART 2: DATABASE ARCHITECTURE

### 2.1 Schema Design Principles

**Normalization:** BCNF (Boyce-Codd Normal Form)  
**Strategy:** 
- Single responsibility per table
- Foreign key constraints enforced
- Indexes on foreign keys and search fields
- Soft deletes via `deleted_at` timestamp
- Audit trail via `created_by`, `updated_by`, `created_at`, `updated_at`

### 2.2 Departments Table

```sql
CREATE TABLE public.departments (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Core Data
    name VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    
    -- Hierarchy
    parent_department_id UUID REFERENCES public.departments(id) ON DELETE RESTRICT,
    
    -- Leadership
    department_head_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    
    -- Metadata
    employee_count INT DEFAULT 0 CHECK (employee_count >= 0),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    
    -- Audit & Soft Delete
    created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    updated_by UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Indexes
    CONSTRAINT check_no_self_parent CHECK (parent_department_id != id)
);

-- Indexes
CREATE INDEX idx_departments_parent_id ON public.departments(parent_department_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_departments_status ON public.departments(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_departments_code ON public.departments(code) WHERE deleted_at IS NULL;
CREATE INDEX idx_departments_name ON public.departments(name) WHERE deleted_at IS NULL;
CREATE INDEX idx_departments_head_id ON public.departments(department_head_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_departments_created_by ON public.departments(created_by);
CREATE INDEX idx_departments_updated_by ON public.departments(updated_by);
CREATE INDEX idx_departments_deleted_at ON public.departments(deleted_at);

-- Constraints Explanation
-- - `name` & `code`: UNIQUE ensures no duplicates
-- - `parent_department_id`: REFERENCES self for hierarchy; ON DELETE RESTRICT prevents orphaning
-- - `department_head_id`: ON DELETE SET NULL allows user deletion without breaking dept
-- - `employee_count`: CHECK ensures non-negative
-- - `status`: CHECK restricts to valid enum
-- - `check_no_self_parent`: Prevents circular references
-- - All indexes have WHERE deleted_at IS NULL: Only indexes active records for performance
```

### 2.3 Hierarchy Validation Strategy

**Problem:** Circular references in parent-child hierarchy
**Solution:** 
1. Database constraint: `CHECK (parent_department_id != id)` (self-reference only)
2. Backend validation: Recursive check up to 3 levels
3. Business logic: Prevent cycle when updating parent_department_id

**Validation Algorithm:**
```
Function: validateParentHierarchy(deptId, newParentId)
  IF newParentId == deptId THEN
    THROW CircularReferenceError
  END IF
  
  visited = Set()
  current = newParentId
  
  FOR i = 1 TO 10 DO  // Max depth check
    IF current == NULL THEN
      RETURN TRUE  // Valid: no cycle found
    END IF
    
    IF current IN visited THEN
      THROW CircularReferenceError  // Cycle detected
    END IF
    
    visited.add(current)
    current = getParentOf(current)
  END FOR
  
  THROW HierarchyTooDeepError  // Max depth exceeded
END Function
```

### 2.4 Soft Delete Implementation

**Strategy:** No data is ever truly deleted

```sql
-- Soft delete
UPDATE departments 
SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
WHERE id = $1 AND deleted_at IS NULL;

-- Restore (if needed)
UPDATE departments 
SET deleted_at = NULL, updated_at = CURRENT_TIMESTAMP
WHERE id = $1;

-- Query only active records
SELECT * FROM departments WHERE deleted_at IS NULL;

-- Query all records (admin only)
SELECT * FROM departments;
```

### 2.5 Audit Trail

**Every change is tracked:**
- `created_by`: User ID who created the record
- `updated_by`: User ID who last updated the record
- `created_at`: Timestamp of creation
- `updated_at`: Timestamp of last update

**Audit Log Table (Optional but Recommended):**
```sql
CREATE TABLE public.department_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES public.departments(id),
    action VARCHAR(20) NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'RESTORE')),
    changed_by UUID NOT NULL REFERENCES public.users(id),
    changes JSONB,  -- {field: {old: value, new: value}}
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_dept_id ON public.department_audit_log(department_id);
CREATE INDEX idx_audit_timestamp ON public.department_audit_log(timestamp);
```

---

## PART 3: BACKEND ARCHITECTURE

### 3.1 Folder Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI app initialization
│   ├── config.py                  # Configuration, env variables
│   ├── security.py                # JWT, auth utilities
│   ├── logging_config.py           # Structured logging setup
│   ├── core/
│   │   ├── __init__.py
│   │   ├── exceptions.py          # Custom exceptions
│   │   ├── constants.py           # Enums, constants
│   │   └── utils.py               # Utility functions
│   ├── middleware/
│   │   ├── __init__.py
│   │   ├── auth_middleware.py     # JWT validation
│   │   ├── error_handler.py       # Global error handling
│   │   └── logging_middleware.py  # Request/response logging
│   ├── database/
│   │   ├── __init__.py
│   │   ├── session.py             # DB session management
│   │   └── base.py                # SQLAlchemy Base, metadata
│   ├── modules/
│   │   ├── __init__.py
│   │   └── department/
│   │       ├── __init__.py
│   │       ├── models.py          # SQLAlchemy ORM models
│   │       ├── schemas.py         # Pydantic request/response schemas
│   │       ├── repository.py      # Data access layer (repository pattern)
│   │       ├── service.py         # Business logic layer
│   │       ├── router.py          # API endpoints
│   │       ├── dependencies.py    # Dependency injection
│   │       ├── validators.py      # Custom validators
│   │       ├── exceptions.py      # Domain-specific exceptions
│   │       └── tests/
│   │           ├── test_models.py
│   │           ├── test_repository.py
│   │           ├── test_service.py
│   │           └── test_router.py
│   └── shared/
│       ├── __init__.py
│       ├── response_models.py     # Generic response wrappers
│       ├── pagination.py          # Pagination logic
│       └── search_filters.py      # Search/filter logic
├── migrations/
│   ├── alembic.ini
│   └── versions/
│       └── 001_create_departments_table.py
├── tests/
│   ├── conftest.py                # Pytest fixtures
│   ├── integration/
│   └── e2e/
├── requirements.txt
├── .env.example
└── run.sh
```

### 3.2 Models (SQLAlchemy 2.0)

**File:** `app/modules/department/models.py`

```python
from datetime import datetime
from uuid import UUID
from sqlalchemy import String, Integer, DateTime, ForeignKey, CheckConstraint, Index, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from app.database.base import Base

class Department(Base):
    __tablename__ = "departments"

    # Primary Key
    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), 
        primary_key=True, 
        default=lambda: UUID_FACTORY()  # UUID generation
    )

    # Core Data
    name: Mapped[str] = mapped_column(
        String(255), 
        nullable=False, 
        unique=True, 
        index=True
    )
    code: Mapped[str] = mapped_column(
        String(50), 
        nullable=False, 
        unique=True, 
        index=True
    )
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Hierarchy
    parent_department_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("departments.id", ondelete="RESTRICT"),
        nullable=True,
        index=True
    )

    # Leadership
    department_head_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )

    # Metadata
    employee_count: Mapped[int] = mapped_column(
        Integer, 
        default=0, 
        nullable=False
    )
    status: Mapped[str] = mapped_column(
        String(20),
        default="ACTIVE",
        nullable=False,
        index=True
    )

    # Audit & Soft Delete
    created_by: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
        index=True
    )
    updated_by: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
        index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.now(UTC),
        nullable=False,
        index=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.now(UTC),
        onupdate=datetime.now(UTC),
        nullable=False,
        index=True
    )
    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        index=True
    )

    # Relationships
    parent_department: Mapped["Department | None"] = relationship(
        "Department",
        remote_side=[id],
        backref="child_departments",
        foreign_keys=[parent_department_id]
    )

    # Constraints
    __table_args__ = (
        CheckConstraint("parent_department_id != id", name="check_no_self_parent"),
        CheckConstraint("employee_count >= 0", name="check_positive_employee_count"),
        CheckConstraint("status IN ('ACTIVE', 'INACTIVE')", name="check_valid_status"),
        Index("idx_departments_parent_status", "parent_department_id", "status", "deleted_at"),
    )

    def __repr__(self) -> str:
        return f"<Department(id={self.id}, name='{self.name}', code='{self.code}')>"
```

### 3.3 Schemas (Pydantic V2)

**File:** `app/modules/department/schemas.py`

```python
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field, field_validator

class DepartmentBase(BaseModel):
    name: str = Field(
        ..., 
        min_length=3, 
        max_length=255,
        description="Department name (3-255 characters)"
    )
    code: str = Field(
        ..., 
        min_length=2, 
        max_length=50,
        description="Department code (uppercase, 2-50 characters)"
    )
    description: str | None = Field(
        None,
        max_length=1000,
        description="Optional department description"
    )
    parent_department_id: UUID | None = Field(
        None,
        description="Parent department ID for hierarchy"
    )
    department_head_id: UUID | None = Field(
        None,
        description="User ID of department head"
    )
    employee_count: int = Field(
        0,
        ge=0,
        description="Number of employees"
    )
    status: str = Field(
        "ACTIVE",
        description="Department status: ACTIVE or INACTIVE"
    )

    @field_validator("code")
    @classmethod
    def validate_code_uppercase(cls, v: str) -> str:
        if not v.isupper():
            raise ValueError("Department code must be uppercase")
        if not v.isalnum():
            raise ValueError("Department code must be alphanumeric")
        return v

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        if v not in ("ACTIVE", "INACTIVE"):
            raise ValueError("Status must be ACTIVE or INACTIVE")
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Engineering",
                "code": "ENG",
                "description": "Engineering Department",
                "status": "ACTIVE"
            }
        }


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentUpdate(BaseModel):
    name: str | None = Field(None, min_length=3, max_length=255)
    code: str | None = Field(None, min_length=2, max_length=50)
    description: str | None = Field(None, max_length=1000)
    parent_department_id: UUID | None = None
    department_head_id: UUID | None = None
    employee_count: int | None = Field(None, ge=0)
    status: str | None = None

    @field_validator("code")
    @classmethod
    def validate_code_if_present(cls, v: str | None) -> str | None:
        if v is not None:
            if not v.isupper():
                raise ValueError("Department code must be uppercase")
            if not v.isalnum():
                raise ValueError("Department code must be alphanumeric")
        return v

    @field_validator("status")
    @classmethod
    def validate_status_if_present(cls, v: str | None) -> str | None:
        if v is not None and v not in ("ACTIVE", "INACTIVE"):
            raise ValueError("Status must be ACTIVE or INACTIVE")
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Engineering",
                "status": "ACTIVE"
            }
        }


class DepartmentResponse(DepartmentBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    created_by: UUID
    updated_by: UUID
    deleted_at: datetime | None = None

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "name": "Engineering",
                "code": "ENG",
                "description": "Engineering Department",
                "status": "ACTIVE",
                "parent_department_id": None,
                "department_head_id": "550e8400-e29b-41d4-a716-446655440001",
                "employee_count": 42,
                "created_at": "2026-07-01T10:00:00Z",
                "updated_at": "2026-07-12T15:30:00Z",
                "created_by": "550e8400-e29b-41d4-a716-446655440002",
                "updated_by": "550e8400-e29b-41d4-a716-446655440002",
                "deleted_at": None
            }
        }


class DepartmentListResponse(BaseModel):
    id: UUID
    name: str
    code: str
    status: str
    parent_department_id: UUID | None
    department_head_id: UUID | None
    employee_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PaginatedDepartmentResponse(BaseModel):
    items: list[DepartmentListResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

    class Config:
        json_schema_extra = {
            "example": {
                "items": [
                    {
                        "id": "550e8400-e29b-41d4-a716-446655440000",
                        "name": "Engineering",
                        "code": "ENG",
                        "status": "ACTIVE",
                        "parent_department_id": None,
                        "department_head_id": "550e8400-e29b-41d4-a716-446655440001",
                        "employee_count": 42,
                        "created_at": "2026-07-01T10:00:00Z",
                        "updated_at": "2026-07-12T15:30:00Z"
                    }
                ],
                "total": 25,
                "page": 1,
                "page_size": 20,
                "total_pages": 2
            }
        }
```

### 3.4 Repository Pattern

**File:** `app/modules/department/repository.py`

```python
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from sqlalchemy import select, and_, or_, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.department.models import Department
import structlog

logger = structlog.get_logger(__name__)


class DepartmentRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(
        self,
        name: str,
        code: str,
        created_by: UUID,
        description: Optional[str] = None,
        parent_department_id: Optional[UUID] = None,
        department_head_id: Optional[UUID] = None,
        employee_count: int = 0,
        status: str = "ACTIVE",
    ) -> Department:
        """Create a new department."""
        dept = Department(
            name=name,
            code=code,
            description=description,
            parent_department_id=parent_department_id,
            department_head_id=department_head_id,
            employee_count=employee_count,
            status=status,
            created_by=created_by,
            updated_by=created_by,
        )
        self.session.add(dept)
        await self.session.flush()
        logger.info("department_created", dept_id=dept.id, code=dept.code, created_by=created_by)
        return dept

    async def get_by_id(self, dept_id: UUID) -> Optional[Department]:
        """Get department by ID (active only)."""
        query = select(Department).where(
            and_(
                Department.id == dept_id,
                Department.deleted_at.is_(None)
            )
        )
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def get_by_code(self, code: str) -> Optional[Department]:
        """Get department by code (active only)."""
        query = select(Department).where(
            and_(
                Department.code == code,
                Department.deleted_at.is_(None)
            )
        )
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def list_active(
        self,
        skip: int = 0,
        limit: int = 20,
        search: Optional[str] = None,
        status: Optional[str] = None,
        parent_id: Optional[UUID] = None,
        sort_by: str = "created_at",
        sort_order: str = "desc",
    ) -> tuple[List[Department], int]:
        """
        List active departments with pagination and filters.
        Returns tuple of (departments, total_count).
        """
        query = select(Department).where(Department.deleted_at.is_(None))

        # Apply filters
        if status:
            query = query.where(Department.status == status)
        
        if parent_id:
            query = query.where(Department.parent_department_id == parent_id)

        if search:
            search_term = f"%{search}%"
            query = query.where(
                or_(
                    Department.name.ilike(search_term),
                    Department.code.ilike(search_term),
                    Department.description.ilike(search_term)
                )
            )

        # Get total count before pagination
        count_query = select(func.count()).select_from(Department).where(
            Department.deleted_at.is_(None)
        )
        if status:
            count_query = count_query.where(Department.status == status)
        if parent_id:
            count_query = count_query.where(Department.parent_department_id == parent_id)
        if search:
            count_query = count_query.where(
                or_(
                    Department.name.ilike(f"%{search}%"),
                    Department.code.ilike(f"%{search}%"),
                    Department.description.ilike(f"%{search}%")
                )
            )

        total_result = await self.session.execute(count_query)
        total_count = total_result.scalar() or 0

        # Sort
        sort_col = getattr(Department, sort_by, Department.created_at)
        if sort_order.lower() == "asc":
            query = query.order_by(sort_col.asc())
        else:
            query = query.order_by(sort_col.desc())

        # Paginate
        query = query.offset(skip).limit(limit)

        result = await self.session.execute(query)
        departments = result.scalars().all()
        
        logger.info("departments_listed", count=len(departments), total=total_count)
        return departments, total_count

    async def update(
        self,
        dept_id: UUID,
        updated_by: UUID,
        **kwargs
    ) -> Optional[Department]:
        """Update department fields."""
        dept = await self.get_by_id(dept_id)
        if not dept:
            return None

        kwargs["updated_by"] = updated_by
        kwargs["updated_at"] = datetime.now(UTC)

        for key, value in kwargs.items():
            if hasattr(dept, key) and value is not None:
                setattr(dept, key, value)

        await self.session.flush()
        logger.info("department_updated", dept_id=dept_id, updated_by=updated_by)
        return dept

    async def soft_delete(self, dept_id: UUID, updated_by: UUID) -> Optional[Department]:
        """Soft delete a department."""
        dept = await self.get_by_id(dept_id)
        if not dept:
            return None

        dept.deleted_at = datetime.now(UTC)
        dept.updated_by = updated_by
        dept.updated_at = datetime.now(UTC)

        await self.session.flush()
        logger.info("department_soft_deleted", dept_id=dept_id, deleted_by=updated_by)
        return dept

    async def has_children(self, dept_id: UUID) -> bool:
        """Check if department has child departments."""
        query = select(func.count()).select_from(Department).where(
            and_(
                Department.parent_department_id == dept_id,
                Department.deleted_at.is_(None)
            )
        )
        result = await self.session.execute(query)
        return (result.scalar() or 0) > 0

    async def has_employees(self, dept_id: UUID) -> bool:
        """Check if department has employees (via employee_count > 0)."""
        dept = await self.get_by_id(dept_id)
        return dept and dept.employee_count > 0 if dept else False

    async def check_name_exists(self, name: str, exclude_id: Optional[UUID] = None) -> bool:
        """Check if department name already exists."""
        query = select(func.count()).select_from(Department).where(
            and_(
                Department.name == name,
                Department.deleted_at.is_(None)
            )
        )
        if exclude_id:
            query = query.where(Department.id != exclude_id)
        
        result = await self.session.execute(query)
        return (result.scalar() or 0) > 0

    async def check_code_exists(self, code: str, exclude_id: Optional[UUID] = None) -> bool:
        """Check if department code already exists."""
        query = select(func.count()).select_from(Department).where(
            and_(
                Department.code == code,
                Department.deleted_at.is_(None)
            )
        )
        if exclude_id:
            query = query.where(Department.id != exclude_id)
        
        result = await self.session.execute(query)
        return (result.scalar() or 0) > 0
```

### 3.5 Service Layer

**File:** `app/modules/department/service.py`

```python
from uuid import UUID
from typing import Optional, List, Tuple
from app.modules.department.repository import DepartmentRepository
from app.modules.department.schemas import DepartmentCreate, DepartmentUpdate, DepartmentResponse
from app.modules.department.exceptions import (
    DepartmentNotFoundError,
    DepartmentAlreadyExistsError,
    InvalidDepartmentHierarchyError,
    CannotDeleteDepartmentError,
)
from app.modules.department.validators import validate_no_circular_hierarchy
import structlog

logger = structlog.get_logger(__name__)


class DepartmentService:
    def __init__(self, repository: DepartmentRepository):
        self.repository = repository

    async def create_department(
        self,
        schema: DepartmentCreate,
        created_by: UUID,
    ) -> DepartmentResponse:
        """Create a new department with validation."""
        
        # Check name uniqueness
        if await self.repository.check_name_exists(schema.name):
            logger.warning("department_name_exists", name=schema.name)
            raise DepartmentAlreadyExistsError(f"Department name '{schema.name}' already exists")

        # Check code uniqueness
        if await self.repository.check_code_exists(schema.code):
            logger.warning("department_code_exists", code=schema.code)
            raise DepartmentAlreadyExistsError(f"Department code '{schema.code}' already exists")

        # Validate hierarchy
        if schema.parent_department_id:
            parent = await self.repository.get_by_id(schema.parent_department_id)
            if not parent:
                logger.warning("parent_department_not_found", parent_id=schema.parent_department_id)
                raise DepartmentNotFoundError("Parent department not found")
            
            # Check for circular references
            is_valid = await validate_no_circular_hierarchy(
                self.repository,
                new_parent_id=schema.parent_department_id,
                dept_id=None  # New department
            )
            if not is_valid:
                logger.warning("circular_hierarchy_detected", parent_id=schema.parent_department_id)
                raise InvalidDepartmentHierarchyError("Circular hierarchy detected")

        # Create department
        dept = await self.repository.create(
            name=schema.name,
            code=schema.code,
            description=schema.description,
            parent_department_id=schema.parent_department_id,
            department_head_id=schema.department_head_id,
            employee_count=schema.employee_count,
            status=schema.status,
            created_by=created_by,
        )

        logger.info("department_created_successfully", dept_id=dept.id, created_by=created_by)
        return DepartmentResponse.model_validate(dept)

    async def get_department(self, dept_id: UUID) -> DepartmentResponse:
        """Get department by ID."""
        dept = await self.repository.get_by_id(dept_id)
        if not dept:
            logger.warning("department_not_found", dept_id=dept_id)
            raise DepartmentNotFoundError(f"Department {dept_id} not found")
        
        return DepartmentResponse.model_validate(dept)

    async def list_departments(
        self,
        skip: int = 0,
        limit: int = 20,
        search: Optional[str] = None,
        status: Optional[str] = None,
        parent_id: Optional[UUID] = None,
        sort_by: str = "created_at",
        sort_order: str = "desc",
    ) -> Tuple[List[DepartmentResponse], int]:
        """List departments with pagination."""
        departments, total = await self.repository.list_active(
            skip=skip,
            limit=limit,
            search=search,
            status=status,
            parent_id=parent_id,
            sort_by=sort_by,
            sort_order=sort_order,
        )
        
        return [DepartmentResponse.model_validate(d) for d in departments], total

    async def update_department(
        self,
        dept_id: UUID,
        schema: DepartmentUpdate,
        updated_by: UUID,
    ) -> DepartmentResponse:
        """Update department with validation."""
        dept = await self.repository.get_by_id(dept_id)
        if not dept:
            raise DepartmentNotFoundError(f"Department {dept_id} not found")

        # Validate updated name
        if schema.name and schema.name != dept.name:
            if await self.repository.check_name_exists(schema.name, exclude_id=dept_id):
                raise DepartmentAlreadyExistsError(f"Department name '{schema.name}' already exists")

        # Validate updated code
        if schema.code and schema.code != dept.code:
            if await self.repository.check_code_exists(schema.code, exclude_id=dept_id):
                raise DepartmentAlreadyExistsError(f"Department code '{schema.code}' already exists")

        # Validate hierarchy change
        if schema.parent_department_id and schema.parent_department_id != dept.parent_department_id:
            is_valid = await validate_no_circular_hierarchy(
                self.repository,
                new_parent_id=schema.parent_department_id,
                dept_id=dept_id
            )
            if not is_valid:
                raise InvalidDepartmentHierarchyError("Circular hierarchy detected")

        # Update
        update_data = schema.model_dump(exclude_unset=True)
        updated_dept = await self.repository.update(dept_id, updated_by, **update_data)

        logger.info("department_updated_successfully", dept_id=dept_id, updated_by=updated_by)
        return DepartmentResponse.model_validate(updated_dept)

    async def delete_department(self, dept_id: UUID, updated_by: UUID) -> None:
        """Delete department (soft delete) with validation."""
        dept = await self.repository.get_by_id(dept_id)
        if not dept:
            raise DepartmentNotFoundError(f"Department {dept_id} not found")

        # Cannot delete if has children
        if await self.repository.has_children(dept_id):
            logger.warning("cannot_delete_dept_with_children", dept_id=dept_id)
            raise CannotDeleteDepartmentError(
                "Cannot delete department that has child departments"
            )

        # Cannot delete if has employees
        if await self.repository.has_employees(dept_id):
            logger.warning("cannot_delete_dept_with_employees", dept_id=dept_id)
            raise CannotDeleteDepartmentError(
                "Cannot delete department that has employees"
            )

        await self.repository.soft_delete(dept_id, updated_by)
        logger.info("department_deleted_successfully", dept_id=dept_id, deleted_by=updated_by)
```

### 3.6 Router (API Endpoints)

**File:** `app/modules/department/router.py`

```python
from fastapi import APIRouter, Depends, Query, HTTPException, status
from uuid import UUID
from app.modules.department.schemas import (
    DepartmentCreate,
    DepartmentUpdate,
    DepartmentResponse,
    PaginatedDepartmentResponse,
    DepartmentListResponse,
)
from app.modules.department.service import DepartmentService
from app.modules.department.dependencies import get_department_service, get_current_user_id
from app.modules.department.exceptions import (
    DepartmentNotFoundError,
    DepartmentAlreadyExistsError,
    InvalidDepartmentHierarchyError,
    CannotDeleteDepartmentError,
)
from app.shared.response_models import ResponseModel
import structlog

logger = structlog.get_logger(__name__)

router = APIRouter(prefix="/api/v1/departments", tags=["Departments"])


@router.get(
    "/",
    response_model=ResponseModel[PaginatedDepartmentResponse],
    summary="List Departments",
    description="Get paginated list of active departments with filtering and search"
)
async def list_departments(
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(20, ge=1, le=100, description="Number of items to return"),
    search: str | None = Query(None, description="Search by name, code, or description"),
    status: str | None = Query(None, description="Filter by status (ACTIVE/INACTIVE)"),
    parent_id: UUID | None = Query(None, description="Filter by parent department ID"),
    sort_by: str = Query("created_at", description="Field to sort by"),
    sort_order: str = Query("desc", description="Sort order (asc/desc)"),
    service: DepartmentService = Depends(get_department_service),
    current_user_id: UUID = Depends(get_current_user_id),
):
    """
    List all active departments.
    
    **Query Parameters:**
    - `skip`: Pagination offset (default: 0)
    - `limit`: Items per page (default: 20, max: 100)
    - `search`: Search departments by name, code, or description
    - `status`: Filter by ACTIVE or INACTIVE
    - `parent_id`: Filter by parent department
    - `sort_by`: Field to sort (name, code, status, created_at)
    - `sort_order`: asc or desc
    
    **Response:** Paginated list of departments
    """
    try:
        departments, total = await service.list_departments(
            skip=skip,
            limit=limit,
            search=search,
            status=status,
            parent_id=parent_id,
            sort_by=sort_by,
            sort_order=sort_order,
        )

        response_data = PaginatedDepartmentResponse(
            items=[
                DepartmentListResponse.model_validate(d.model_dump())
                for d in departments
            ],
            total=total,
            page=skip // limit + 1,
            page_size=limit,
            total_pages=(total + limit - 1) // limit,
        )

        logger.info(
            "list_departments_success",
            user_id=current_user_id,
            count=len(departments),
            total=total
        )
        
        return ResponseModel(
            data=response_data,
            message="Departments retrieved successfully",
            status="success"
        )
    except Exception as e:
        logger.error("list_departments_error", error=str(e), user_id=current_user_id)
        raise HTTPException(status_code=500, detail="Failed to retrieve departments")


@router.post(
    "/",
    response_model=ResponseModel[DepartmentResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Create Department",
    description="Create a new department with validation"
)
async def create_department(
    schema: DepartmentCreate,
    service: DepartmentService = Depends(get_department_service),
    current_user_id: UUID = Depends(get_current_user_id),
):
    """
    Create a new department.
    
    **Validation Rules:**
    - Name: Required, unique, 3-255 characters
    - Code: Required, unique, uppercase alphanumeric, 2-50 characters
    - Parent Department: If provided, must exist and not create circular hierarchy
    - Status: ACTIVE or INACTIVE
    
    **Response:** Created department details
    """
    try:
        dept = await service.create_department(schema, created_by=current_user_id)
        logger.info("create_department_success", dept_id=dept.id, user_id=current_user_id)
        
        return ResponseModel(
            data=dept,
            message="Department created successfully",
            status="success"
        )
    except DepartmentAlreadyExistsError as e:
        logger.warning("create_department_conflict", error=str(e), user_id=current_user_id)
        raise HTTPException(status_code=409, detail=str(e))
    except InvalidDepartmentHierarchyError as e:
        logger.warning("create_department_hierarchy_error", error=str(e), user_id=current_user_id)
        raise HTTPException(status_code=400, detail=str(e))
    except DepartmentNotFoundError as e:
        logger.warning("create_department_not_found", error=str(e), user_id=current_user_id)
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error("create_department_error", error=str(e), user_id=current_user_id)
        raise HTTPException(status_code=500, detail="Failed to create department")


@router.get(
    "/{dept_id}",
    response_model=ResponseModel[DepartmentResponse],
    summary="Get Department",
    description="Retrieve a single department by ID"
)
async def get_department(
    dept_id: UUID,
    service: DepartmentService = Depends(get_department_service),
    current_user_id: UUID = Depends(get_current_user_id),
):
    """
    Get department details by ID.
    
    **Parameters:**
    - `dept_id`: Department UUID
    
    **Response:** Department details
    """
    try:
        dept = await service.get_department(dept_id)
        logger.info("get_department_success", dept_id=dept_id, user_id=current_user_id)
        
        return ResponseModel(
            data=dept,
            message="Department retrieved successfully",
            status="success"
        )
    except DepartmentNotFoundError as e:
        logger.warning("get_department_not_found", dept_id=dept_id, user_id=current_user_id)
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error("get_department_error", error=str(e), user_id=current_user_id)
        raise HTTPException(status_code=500, detail="Failed to retrieve department")


@router.put(
    "/{dept_id}",
    response_model=ResponseModel[DepartmentResponse],
    summary="Update Department",
    description="Update department details"
)
async def update_department(
    dept_id: UUID,
    schema: DepartmentUpdate,
    service: DepartmentService = Depends(get_department_service),
    current_user_id: UUID = Depends(get_current_user_id),
):
    """
    Update department information.
    
    **Parameters:**
    - `dept_id`: Department UUID
    
    **Body:** Fields to update (all optional)
    
    **Response:** Updated department details
    """
    try:
        dept = await service.update_department(dept_id, schema, updated_by=current_user_id)
        logger.info("update_department_success", dept_id=dept_id, user_id=current_user_id)
        
        return ResponseModel(
            data=dept,
            message="Department updated successfully",
            status="success"
        )
    except DepartmentNotFoundError as e:
        logger.warning("update_department_not_found", dept_id=dept_id, user_id=current_user_id)
        raise HTTPException(status_code=404, detail=str(e))
    except DepartmentAlreadyExistsError as e:
        logger.warning("update_department_conflict", error=str(e), user_id=current_user_id)
        raise HTTPException(status_code=409, detail=str(e))
    except InvalidDepartmentHierarchyError as e:
        logger.warning("update_department_hierarchy_error", error=str(e), user_id=current_user_id)
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error("update_department_error", error=str(e), user_id=current_user_id)
        raise HTTPException(status_code=500, detail="Failed to update department")


@router.delete(
    "/{dept_id}",
    response_model=ResponseModel,
    summary="Delete Department",
    description="Soft delete a department"
)
async def delete_department(
    dept_id: UUID,
    service: DepartmentService = Depends(get_department_service),
    current_user_id: UUID = Depends(get_current_user_id),
):
    """
    Delete (soft delete) a department.
    
    **Parameters:**
    - `dept_id`: Department UUID
    
    **Validation:**
    - Cannot delete if department has child departments
    - Cannot delete if department has employees
    
    **Response:** Success message
    """
    try:
        await service.delete_department(dept_id, updated_by=current_user_id)
        logger.info("delete_department_success", dept_id=dept_id, user_id=current_user_id)
        
        return ResponseModel(
            data=None,
            message="Department deleted successfully",
            status="success"
        )
    except DepartmentNotFoundError as e:
        logger.warning("delete_department_not_found", dept_id=dept_id, user_id=current_user_id)
        raise HTTPException(status_code=404, detail=str(e))
    except CannotDeleteDepartmentError as e:
        logger.warning("delete_department_protected", error=str(e), user_id=current_user_id)
        raise HTTPException(status_code=409, detail=str(e))
    except Exception as e:
        logger.error("delete_department_error", error=str(e), user_id=current_user_id)
        raise HTTPException(status_code=500, detail="Failed to delete department")
```

### 3.7 Custom Exceptions

**File:** `app/modules/department/exceptions.py`

```python
class DepartmentException(Exception):
    """Base exception for department module"""
    pass


class DepartmentNotFoundError(DepartmentException):
    """Raised when department is not found"""
    pass


class DepartmentAlreadyExistsError(DepartmentException):
    """Raised when department name/code already exists"""
    pass


class InvalidDepartmentHierarchyError(DepartmentException):
    """Raised when hierarchy validation fails (circular references)"""
    pass


class CannotDeleteDepartmentError(DepartmentException):
    """Raised when attempting to delete protected department"""
    pass
```

### 3.8 Validators

**File:** `app/modules/department/validators.py`

```python
from uuid import UUID
from app.modules.department.repository import DepartmentRepository
import structlog

logger = structlog.get_logger(__name__)


async def validate_no_circular_hierarchy(
    repository: DepartmentRepository,
    new_parent_id: UUID,
    dept_id: UUID | None = None,  # None if creating new
    max_depth: int = 10
) -> bool:
    """
    Validate that assigning new_parent_id to dept_id won't create circular hierarchy.
    
    Args:
        repository: DepartmentRepository instance
        new_parent_id: Proposed parent department ID
        dept_id: Department being updated (None if creating new)
        max_depth: Maximum hierarchy depth to check
    
    Returns:
        True if valid, False if circular reference detected
    """
    visited = set()
    current = new_parent_id

    for _ in range(max_depth):
        if current is None:
            return True  # Valid: reached top of hierarchy

        if current == dept_id:
            logger.warning(
                "circular_hierarchy_detected",
                dept_id=dept_id,
                attempted_parent=new_parent_id
            )
            return False  # Circular: new parent is a child of the department

        if current in visited:
            logger.warning(
                "hierarchy_cycle_detected",
                dept_id=dept_id,
                visited_departments=len(visited)
            )
            return False  # Cycle detected

        visited.add(current)

        # Get parent of current
        parent_dept = await repository.get_by_id(current)
        if not parent_dept:
            return True  # Valid: parent doesn't exist (shouldn't happen)

        current = parent_dept.parent_department_id

    logger.warning(
        "hierarchy_max_depth_exceeded",
        dept_id=dept_id,
        max_depth=max_depth
    )
    return False  # Max depth exceeded
```

---

## PART 4: FRONTEND ARCHITECTURE

### 4.1 Frontend Folder Structure

```
frontend/src/
├── pages/
│   └── Departments/
│       ├── index.tsx               # Main departments page (list view)
│       ├── DepartmentDetail.tsx    # Detail view/drawer
│       └── components/
│           ├── DepartmentTable.tsx
│           ├── CreateDialog.tsx
│           ├── EditDialog.tsx
│           ├── DeleteDialog.tsx
│           ├── SearchBar.tsx
│           ├── FilterBar.tsx
│           ├── StatusFilter.tsx
│           ├── Breadcrumbs.tsx
│           ├── EmptyState.tsx
│           ├── ErrorState.tsx
│           └── LoadingSkeleton.tsx
├── hooks/
│   ├── useDepartments.ts          # React Query hook for list
│   ├── useDepartment.ts           # React Query hook for single
│   ├── useCreateDepartment.ts     # Mutation hook
│   ├── useUpdateDepartment.ts     # Mutation hook
│   ├── useDeleteDepartment.ts     # Mutation hook
│   ├── useDebounce.ts             # Search debounce
│   └── usePagination.ts           # Pagination logic
├── services/
│   └── departmentService.ts       # Axios API client
├── types/
│   └── department.ts              # TypeScript interfaces
├── constants/
│   └── departments.ts             # Enums, constants
└── utils/
    └── formatters.ts              # Format utilities
```

### 4.2 Custom Hooks

**File:** `src/hooks/useDepartments.ts`

```typescript
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { departmentService } from '@/services/departmentService';
import { PaginatedDepartmentResponse } from '@/types/department';

interface UseDepartmentsOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  parentId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  enabled?: boolean;
}

export const useDepartments = (
  options: UseDepartmentsOptions = {}
): UseQueryResult<PaginatedDepartmentResponse, Error> => {
  const {
    page = 1,
    pageSize = 20,
    search = '',
    status,
    parentId,
    sortBy = 'created_at',
    sortOrder = 'desc',
    enabled = true,
  } = options;

  return useQuery({
    queryKey: [
      'departments',
      { page, pageSize, search, status, parentId, sortBy, sortOrder },
    ],
    queryFn: () =>
      departmentService.listDepartments({
        skip: (page - 1) * pageSize,
        limit: pageSize,
        search,
        status,
        parent_id: parentId,
        sort_by: sortBy,
        sort_order: sortOrder,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
    enabled,
    retry: 2,
  });
};

export const useDepartment = (
  departmentId: string | undefined,
  options: { enabled?: boolean } = {}
) => {
  return useQuery({
    queryKey: ['department', departmentId],
    queryFn: () => departmentService.getDepartment(departmentId!),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!departmentId && options.enabled !== false,
    retry: 2,
  });
};
```

**File:** `src/hooks/useDebounce.ts`

```typescript
import { useEffect, useState } from 'react';

export const useDebounce = <T,>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
```

### 4.3 Axios Service

**File:** `src/services/departmentService.ts`

```typescript
import axios, { AxiosInstance } from 'axios';
import { DepartmentCreate, DepartmentUpdate, DepartmentResponse, PaginatedDepartmentResponse } from '@/types/department';

class DepartmentService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to every request
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle response errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async listDepartments(params: {
    skip: number;
    limit: number;
    search?: string;
    status?: string;
    parent_id?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }): Promise<PaginatedDepartmentResponse> {
    const response = await this.api.get('/api/v1/departments', { params });
    return response.data.data;
  }

  async getDepartment(id: string): Promise<DepartmentResponse> {
    const response = await this.api.get(`/api/v1/departments/${id}`);
    return response.data.data;
  }

  async createDepartment(data: DepartmentCreate): Promise<DepartmentResponse> {
    const response = await this.api.post('/api/v1/departments', data);
    return response.data.data;
  }

  async updateDepartment(id: string, data: DepartmentUpdate): Promise<DepartmentResponse> {
    const response = await this.api.put(`/api/v1/departments/${id}`, data);
    return response.data.data;
  }

  async deleteDepartment(id: string): Promise<void> {
    await this.api.delete(`/api/v1/departments/${id}`);
  }
}

export const departmentService = new DepartmentService();
```

### 4.4 React Components

**File:** `src/pages/Departments/components/DepartmentTable.tsx`

```typescript
import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { DepartmentListResponse } from '@/types/department';
import { format } from 'date-fns';

interface DepartmentTableProps {
  departments: DepartmentListResponse[];
  isLoading: boolean;
  onEdit: (dept: DepartmentListResponse) => void;
  onDelete: (dept: DepartmentListResponse) => void;
}

export const DepartmentTable = ({
  departments,
  isLoading,
  onEdit,
  onDelete,
}: DepartmentTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-slate-100 text-slate-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-slate-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (departments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No departments found</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="border-b border-slate-200">
            <TableHead className="font-semibold text-slate-700">Name</TableHead>
            <TableHead className="font-semibold text-slate-700">Code</TableHead>
            <TableHead className="font-semibold text-slate-700">Status</TableHead>
            <TableHead className="font-semibold text-slate-700">Employees</TableHead>
            <TableHead className="font-semibold text-slate-700">Created</TableHead>
            <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.map((dept) => (
            <TableRow
              key={dept.id}
              className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <TableCell className="text-slate-900 font-medium">{dept.name}</TableCell>
              <TableCell className="text-slate-600 font-mono text-sm">{dept.code}</TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(dept.status)} border-0`}>
                  {dept.status}
                </Badge>
              </TableCell>
              <TableCell className="text-slate-600">{dept.employee_count}</TableCell>
              <TableCell className="text-slate-500 text-sm">
                {format(new Date(dept.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(dept)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(dept)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
```

---

## PART 5: TESTING STRATEGY

### 5.1 Test Coverage Requirements

```
Target: 90%+ code coverage
- Unit Tests: Models, Services, Validators
- Integration Tests: Repository + Service
- API Tests: Router + full stack
- Frontend Component Tests: React Testing Library
- E2E Tests: Cypress (optional, post-launch)
```

### 5.2 Backend Test Example

**File:** `app/modules/department/tests/test_service.py`

```python
import pytest
from uuid import uuid4
from app.modules.department.service import DepartmentService
from app.modules.department.schemas import DepartmentCreate, DepartmentUpdate
from app.modules.department.exceptions import (
    DepartmentAlreadyExistsError,
    InvalidDepartmentHierarchyError,
)


@pytest.mark.asyncio
async def test_create_department_success(department_service, user_id):
    """Test successful department creation."""
    schema = DepartmentCreate(
        name="Engineering",
        code="ENG",
        description="Engineering Department",
        status="ACTIVE"
    )
    
    result = await department_service.create_department(schema, created_by=user_id)
    
    assert result.id is not None
    assert result.name == "Engineering"
    assert result.code == "ENG"
    assert result.status == "ACTIVE"


@pytest.mark.asyncio
async def test_create_department_duplicate_name(department_service, user_id, existing_dept):
    """Test creation fails with duplicate name."""
    schema = DepartmentCreate(
        name=existing_dept.name,
        code="NEWCODE",
        status="ACTIVE"
    )
    
    with pytest.raises(DepartmentAlreadyExistsError):
        await department_service.create_department(schema, created_by=user_id)


@pytest.mark.asyncio
async def test_create_circular_hierarchy(department_service, user_id, dept_parent, dept_child):
    """Test circular hierarchy prevention."""
    # Try to make parent a child of child (circular)
    schema = DepartmentUpdate(
        parent_department_id=dept_child.id
    )
    
    with pytest.raises(InvalidDepartmentHierarchyError):
        await department_service.update_department(
            dept_parent.id,
            schema,
            updated_by=user_id
        )
```

### 5.3 Frontend Test Example

**File:** `src/components/__tests__/DepartmentTable.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { DepartmentTable } from '../DepartmentTable';
import { DepartmentListResponse } from '@/types/department';

describe('DepartmentTable', () => {
  const mockDepartments: DepartmentListResponse[] = [
    {
      id: '1',
      name: 'Engineering',
      code: 'ENG',
      status: 'ACTIVE',
      parent_department_id: null,
      department_head_id: null,
      employee_count: 42,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  it('renders department table with data', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    render(
      <DepartmentTable
        departments={mockDepartments}
        isLoading={false}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('ENG')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
  });

  it('shows empty state when no departments', () => {
    render(
      <DepartmentTable
        departments={[]}
        isLoading={false}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText('No departments found')).toBeInTheDocument();
  });
});
```

---

## PART 6: DOCUMENTATION & DEPLOYMENT

### 6.1 README Structure

```markdown
# EcoSphere ESG Management Platform - Module 1: Department Management

## Overview
- Purpose of the module
- Key features
- Architecture overview

## Tech Stack
- Frontend: React 19, TypeScript, Vite
- Backend: FastAPI, Python 3.12
- Database: Supabase PostgreSQL
- Authentication: Supabase Auth

## Getting Started

### Prerequisites
- Node 18+
- Python 3.12+
- PostgreSQL 15+
- Supabase account

### Installation
```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Environment Variables
See `.env.example` for all required variables

## API Documentation
- Swagger: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Testing
```bash
# Backend
pytest --cov=app

# Frontend
npm test
```

## Deployment
- Docker compose for local development
- GitHub Actions CI/CD pipeline
- Environment-specific configs
```

### 6.2 Code Quality Standards

- **Type Safety:** TypeScript (frontend), type hints (backend)
- **Linting:** ESLint (frontend), Flake8 (backend)
- **Formatting:** Prettier (frontend), Black (backend)
- **Testing:** Jest/React Testing Library (frontend), Pytest (backend)
- **Documentation:** Docstrings, JSDoc, API OpenAPI specs

---

## DELIVERABLES CHECKLIST

### Database
- [ ] PostgreSQL schema with constraints
- [ ] Alembic migration files
- [ ] SQLAlchemy models with relationships
- [ ] Indexes on frequently queried columns
- [ ] Audit trail implementation

### Backend
- [ ] Repository layer (data access)
- [ ] Service layer (business logic)
- [ ] Router with all 5 REST endpoints
- [ ] Pydantic schemas (request/response)
- [ ] Custom exception classes
- [ ] Validators (hierarchy, uniqueness, etc.)
- [ ] Dependency injection setup
- [ ] Structured logging
- [ ] Error handling middleware
- [ ] Unit & integration tests

### Frontend
- [ ] Page component (list view)
- [ ] Detail/drawer component
- [ ] Reusable data table
- [ ] Create dialog
- [ ] Edit dialog
- [ ] Delete confirmation
- [ ] Search/filter UI
- [ ] Pagination controls
- [ ] Breadcrumbs
- [ ] Loading skeleton
- [ ] Empty state
- [ ] Error state
- [ ] Status badges
- [ ] Custom hooks (React Query)
- [ ] Axios service with interceptors
- [ ] TypeScript types
- [ ] Component tests

### Documentation
- [ ] Comprehensive README
- [ ] Inline code documentation
- [ ] Database schema documentation
- [ ] API endpoint documentation
- [ ] Component prop documentation
- [ ] Setup & deployment guide

### Quality
- [ ] No TypeScript errors
- [ ] No linting warnings
- [ ] 90%+ test coverage
- [ ] WCAG 2.1 AA accessibility
- [ ] Performance optimized
- [ ] Security hardened
- [ ] Zero mock data (real DB integration)

---

## SUCCESS CRITERIA

This module is **COMPLETE & PRODUCTION-READY** only when:

1. **Database:** Full normalized schema with soft deletes and audit trails
2. **Backend:** Complete REST API with validation, hierarchy checks, error handling
3. **Frontend:** Professional UI matching design system, no generic components
4. **Integration:** Real data flow from UI → API → Database
5. **Testing:** 90%+ coverage, all edge cases handled
6. **Documentation:** Every function, endpoint, component documented
7. **Security:** OWASP compliance, proper authorization, input validation
8. **Performance:** Query optimization, pagination, caching strategies

---

## ARCHITECTURE PHILOSOPHY

**"Module 1 is the template for all future modules."**

Every architectural decision made here will be replicated across:
- Module 2: Category Management
- Module 3: Emission Factors
- Module 4: ESG Policies
- ... and beyond

Therefore:
- Code must be clean, reusable, and maintainable
- Patterns must be consistent and extensible
- Documentation must be comprehensive and clear
- Quality must be non-negotiable

---

**Version:** 1.0  
**Status:** Production-Grade Specification  
**Review Date:** Every 2 weeks during development

