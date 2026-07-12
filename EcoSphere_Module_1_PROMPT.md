# EcoSphere ESG Management Platform
## Module 1: Department Management - Complete Prompt
**Status:** Production-Grade Specification (Code-Free)  
**Version:** 1.0  

---

## EXECUTIVE SUMMARY

You are building **Module 1: Department Management** for EcoSphere ESG Management Platform. This is the foundational Master Data module that enables organizational hierarchy and ESG ownership tracking. 

**Critical Requirements:**
- Enterprise-grade architecture (not prototype code)
- Production-ready from database to frontend
- Zero generic AI-generated design patterns
- Full stack integration with real data flow
- 90%+ test coverage
- WCAG 2.1 AA accessibility compliance
- Performance optimized for scale

**This module becomes the architectural template for all remaining modules.** Every decision here will be replicated across 8+ additional modules. Therefore quality is non-negotiable.

---

## PROJECT CONTEXT

### What is EcoSphere?

EcoSphere is an integrated ESG (Environmental, Social, Governance) Management Platform that combines:
- **Environmental:** Carbon accounting, emission factors, sustainability goals, carbon reports
- **Social:** CSR activities, employee participation, diversity metrics, engagement tracking
- **Governance:** Policies, audits, compliance tracking, governance reports
- **Gamification:** Challenges, badges, XP systems, rewards, leaderboards

### Why Department Management Matters

Departments are the fundamental organizational unit in EcoSphere. Every transaction, policy, employee metric, and ESG score rolls up to departments. The platform enables:
- Organizational hierarchy with parent-child relationships
- Department-level ESG ownership and accountability
- Cascading ESG metrics from individual departments to organization-wide reporting
- Role-based access control tied to departments

Without solid Department Management, all downstream modules fail. This module must be bulletproof.

---

## TECHNOLOGY STACK (FIXED)

### Frontend
- React 19.x
- TypeScript 5.x (strict mode enforced)
- Vite 6.x
- Tailwind CSS 4.x
- shadcn/ui components (latest)
- Lucide React icons
- React Router DOM 7.x
- React Hook Form 7.x (form handling)
- Zod 3.x (schema validation)
- TanStack Query 5.x (React Query for data fetching)
- TanStack Table 8.x (advanced data table)
- Axios 1.x (HTTP client)
- Framer Motion 11.x (animations)

### Backend
- FastAPI 0.104+
- Python 3.12+
- SQLAlchemy 2.0+ (ORM)
- Pydantic V2 (validation)
- Alembic 1.13+ (migrations)
- Uvicorn (ASGI server)
- python-jose (JWT auth)
- structlog (structured logging)
- pytest 7.x (testing)

### Database
- Supabase PostgreSQL 15+
- Native UUID support
- Full-text search capability
- PostGIS extension (optional, for future geo-features)

### Authentication & Storage
- Supabase Auth (JWT-based)
- Supabase Storage (file attachments)

### Deployment
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Environment: Dev, Staging, Production

---

## PART 1: DESIGN SYSTEM & VISUAL IDENTITY

### 1.1 Design Philosophy

The UI must embody:
- **Professional Minimalism:** No unnecessary gradients, animations, shadows, or decorative elements
- **Enterprise Clarity:** Information hierarchy immediately obvious; no confusion
- **Accessibility First:** WCAG 2.1 AA minimum compliance; every interactive element keyboard navigable
- **Consistency:** Single source of truth for all design tokens; no custom one-offs
- **Performance:** Every animation must serve a purpose; no bloat or unnecessary re-renders
- **Semantic Design:** Component names reflect purpose and function, not appearance
- **Light Theme Only:** Bright, professional appearance (no dark mode for this module)

### 1.2 Color Palette

**Primary Brand Colors (ESG-Aligned):**

- **Green (Environmental):** Primary action color
  - Main: #10B981
  - Hover: #059669
  - Active: #047857
  - Light background: #F0FDF4
  - Used for: CTAs, success states, environmental metrics

- **Blue (Social):** Secondary action color
  - Main: #3B82F6
  - Hover: #2563EB
  - Active: #1D4ED8
  - Light background: #F0F9FF
  - Used for: Information, social metrics, secondary actions

- **Slate (Governance):** Neutral/tertiary color
  - Main: #475569
  - Hover: #334155
  - Active: #1E293B
  - Light background: #F1F5F9
  - Used for: Text, disabled states, governance metrics

- **Amber (Compliance/Warning):** Alert color
  - Main: #F59E0B
  - Hover: #D97706
  - Active: #B45309
  - Light background: #FFFBEF
  - Used for: Warnings, requires-attention states, pending actions

**Neutral Scale (No Pure Black):**
- Slate-50: #F8FAFC (lightest background)
- Slate-100: #F1F5F9 (light background, cards)
- Slate-200: #E2E8F0 (borders, dividers)
- Slate-300: #CBD5E1 (subtle text)
- Slate-400: #94A3B8 (secondary text, muted)
- Slate-500: #64748B (primary text, readable)
- Slate-600: #475569 (strong text, headings)
- Slate-700: #334155 (main headings)
- Slate-800: #1E293B (strong emphasis, maximum contrast)
- Slate-900: #0F172A (absolute maximum contrast, rare use only)

**Semantic Colors:**
- Success: #10B981 (operations completed successfully)
- Warning: #F59E0B (requires attention, not critical)
- Error: #EF4444 (critical issues, failures)
- Info: #3B82F6 (informational messages)
- Disabled: Slate-300 with 50% opacity

**Background Strategy:**
- Primary page background: Slate-50 or White (not #FFFFFF, use Slate-50 for subtle distinction)
- Secondary backgrounds (cards, panels): Slate-100
- NEVER use pure black (#000000) for text or backgrounds
- Dark backgrounds: Use Slate-900 (#0F172A) only for maximum contrast text
- Modal overlays: Slate-950 at 30% opacity

### 1.3 Typography System

**Font Stack:**
- Primary: Inter (from Google Fonts)
  - Weights: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
  - Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
  
- Monospace: Fira Code (for code blocks, department codes, IDs)
  - Weights: 400, 500

**Type Scale & Hierarchy:**

| Component | Size | Line Height | Weight | Letter Spacing | Example | Use Case |
|-----------|------|-------------|--------|-----------------|---------|----------|
| Page Title (H1) | 32px | 38px (1.2x) | 700 | -0.01em | "Department Management" | Main page heading |
| Section Title (H2) | 24px | 31px (1.3x) | 600 | -0.005em | "Active Departments" | Section headings |
| Subsection (H3) | 18px | 25px (1.4x) | 600 | 0 | "Department Details" | Card headings |
| Body Text | 14px | 22px (1.6x) | 400 | 0 | Standard paragraph text | Main content |
| Body Emphasis | 14px | 22px (1.6x) | 500 | 0 | Form labels, highlights | Important body text |
| Small Text | 12px | 18px (1.5x) | 400 | 0.02em | Metadata, timestamps | Supporting info |
| Button Text | 14px | 20px (1.4x) | 500 | 0.03em | CTA buttons | Interactive elements |
| Badge/Tag Text | 11px | 15px (1.4x) | 500 | 0.05em | Status badges | Labels, tags |

**Text Color Hierarchy:**
- Primary text: Slate-700 (#334155) - main content, body text
- Secondary text: Slate-500 (#64748B) - supporting text, descriptions
- Tertiary text: Slate-400 (#94A3B8) - metadata, timestamps, muted info
- Disabled text: Slate-300 (#CBD5E1) - disabled states

### 1.4 Spacing System (8px Base Unit)

Spacing should follow an 8px grid:
- xs: 4px (minimal gaps)
- sm: 8px (standard gap between elements)
- md: 12px (form field spacing)
- lg: 16px (padding inside cards/containers)
- xl: 24px (padding inside larger containers)
- 2xl: 32px (section spacing)
- 3xl: 48px (major section spacing)
- 4xl: 64px (page-level spacing)

**Common Spacing Applications:**
- Page padding: 24px (lg)
- Card padding: 16px (lg) or 20px for emphasis
- Element gaps within cards: 8-12px (sm-md)
- Form field spacing: 12px (md)
- Vertical section spacing: 32-48px (2xl-3xl)
- List item spacing: 8px (sm)

### 1.5 Component Token Specifications

**Buttons:**

Primary Button (Main CTA - Green)
- Background: #10B981
- Text color: White
- Padding: 8px vertical, 16px horizontal
- Border radius: 6px
- Font: 14px, 500 weight
- Hover state: Background #059669, shadow-sm elevation
- Active state: Background #047857
- Disabled state: Slate-300 background, Slate-400 text, 50% opacity
- Focus indicator: 2px solid green ring, 2px offset

Secondary Button (Alternative Action)
- Background: Slate-100
- Text color: Slate-700
- Border: 1px solid Slate-200
- Same padding, radius as primary
- Hover state: Slate-200 background, Slate-300 border
- Active state: Slate-300 background, Slate-400 border
- Focus indicator: Green ring

Tertiary Button (Ghost/Minimal)
- No background (transparent)
- Text color: Green-600
- Hover state: Green-100 background
- Active state: Green-200 background
- Focus indicator: Green ring

Icon Button
- Size: 32px × 32px square
- Inner padding: 6px (leaves 20px icon area)
- Border radius: 4px
- Hover: Slate-100 background
- Transition: Smooth 150ms

**Form Fields:**

Input & Textarea
- Background: White or Slate-50
- Border: 1px solid Slate-200
- Padding: 8px vertical, 12px horizontal
- Border radius: 6px
- Font: 14px, 400 weight, Slate-700
- Focus state: Border Green-500, 2px ring Green-500 at 30% opacity
- Error state: Border #EF4444, ring #FCA5A5
- Disabled state: Background Slate-100, text Slate-400, cursor not-allowed
- Placeholder text: Slate-400
- Line height: 1.5

Label
- Font: 14px, 500 weight
- Color: Slate-600
- Margin bottom: 6px (md)
- Required indicator: Red asterisk (*) in Slate-400 color
- Associated with input via <label> tag

**Cards:**

Default Card
- Background: White
- Border: 1px solid Slate-200
- Padding: 16px (lg)
- Border radius: 8px
- Box shadow: 0 1px 2px rgba(0,0,0,0.05) (shadow-xs)

Interactive/Hoverable Card
- Default shadow: shadow-xs
- Hover shadow: 0 4px 6px rgba(0,0,0,0.07) (shadow-md)
- Hover border: Slate-300
- Cursor: pointer
- Transition: 150ms ease-in-out

Selected/Active Card
- Background: Slate-50
- Border: 2px solid Green-500
- Left border accent: 3px solid Green-600

**Status Badges:**

Active Badge
- Background: #F0FDF4 (green-50)
- Text: #065F46 (green-900)
- Border: 1px solid #86EFAC (green-300)
- Font: 11px, 500 weight
- Padding: 2px 8px
- Border radius: 4px

Inactive Badge
- Background: Slate-100
- Text: Slate-700
- Border: 1px solid Slate-300
- Same font/padding/radius

Draft Badge
- Background: Slate-50
- Text: Slate-600
- Border: 1px dashed Slate-300

**Data Table:**

Table Header Row
- Background: Slate-50
- Border bottom: 1px solid Slate-200
- Font: 12px, 600 weight, Slate-700, uppercase letter-spacing
- Padding: 12px vertical, 16px horizontal

Table Body Row
- Border bottom: 1px solid Slate-200
- Padding: 12px vertical, 16px horizontal
- Hover state: Background Slate-50, cursor pointer
- Selected row: Background Green-50, left border 3px Green-600

Table Cell
- Text: Slate-700 for main, Slate-500 for secondary
- Alignment: Left for text, right for numbers
- Vertical alignment: Middle

### 1.6 Elevation & Shadows

Use these shadows for layering:

- shadow-xs: 0 1px 2px 0 rgba(0,0,0,0.05) - subtle, default cards
- shadow-sm: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06) - standard elevation
- shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06) - elevated, hovered cards
- shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05) - modal level
- shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04) - premium, important modals

**Usage Guidelines:**
- Cards at rest: shadow-xs
- Cards on hover: shadow-md
- Dropdowns/popovers: shadow-md
- Modals: shadow-lg
- Toast notifications: shadow-md
- Navigation: shadow-sm

### 1.7 Border Radius Specifications

- xs: 2px (minimal rounding, small components)
- sm: 4px (tables, small badges)
- md: 6px (form fields, buttons)
- lg: 8px (cards, larger components)
- xl: 12px (modals, hero sections)
- full: 9999px (pill buttons, avatars, circles)

### 1.8 Animations & Transitions

**Timing Functions:**
- Fast (UI feedback): 150ms cubic-bezier(0.4, 0, 0.2, 1)
- Normal (transitions): 300ms cubic-bezier(0.4, 0, 0.2, 1)
- Slow (entrance): 500ms cubic-bezier(0.4, 0, 0.2, 1)

**Approved Animations:**
- Fade: Opacity 0 → 1, 150ms
- Slide-up: Transform translateY(8px) → 0, 300ms
- Hover elevation: Shadow transition, 150ms
- Loading spinner: Rotation 360deg, 1s infinite linear
- Skeleton pulse: Opacity 1 → 0.5 → 1, 2s infinite
- Toast slide-in: Transform translateX(-100%) → 0, 300ms

**What NOT to Animate:**
- Route transitions (handled by router)
- Table data updates (distracting to users)
- Form field changes (user-triggered, no animation needed)
- Real-time counter changes
- Anything that happens < 200ms

**Animation Purpose Rule:** Every animation must either:
1. Provide feedback to user action
2. Guide visual hierarchy
3. Show loading/progress
4. Transition between states

If it doesn't serve one of these purposes, remove it.

### 1.9 Responsive Design Breakpoints

Design mobile-first, then layer enhancements:

- Mobile: 320px - 640px (default, base styles)
- Tablet: 641px - 1024px (two-column layouts)
- Desktop: 1025px - 1440px (three-column + sidebar)
- Wide/2K: 1441px+ (optimized for large screens)

**Responsive Behavior:**
- Mobile: Single column, full-width cards, no sidebar
- Tablet: Two-column layout, card grids, compact sidebar
- Desktop: Three-column main + sidebar navigation
- Wide: Additional columns, expanded data views

**Touch Targets:** Minimum 44px × 44px on mobile for buttons/interactive elements

### 1.10 Accessibility Standards

**WCAG 2.1 AA Compliance Required:**

- Color Contrast: 4.5:1 for normal text, 3:1 for large text
- Focus Indicators: Always visible, 2px offset, never removed
- Keyboard Navigation: Tab order follows visual flow, Escape closes modals
- Screen Reader: aria-labels on icons, proper heading hierarchy, form associations
- Motion: Respect prefers-reduced-motion
- Language: Set lang="en" on HTML, mark language changes

**Keyboard Navigation:**
- Tab: Move forward through interactive elements
- Shift+Tab: Move backward
- Enter: Activate buttons/submit forms
- Escape: Close modals, dropdowns, dialogs
- Arrow keys: Navigate lists/tables/menus
- Space: Toggle checkboxes

**Screen Reader Support:**
- All images/icons have alt text or aria-label
- Form inputs have associated <label> elements
- Data tables have proper <th> headers
- Modals have role="dialog" and aria-labelledby
- Loading states use aria-live="polite"
- Errors use role="alert"

---

## PART 2: DATABASE ARCHITECTURE

### 2.1 Schema Design Principles

The database design must follow these principles:

- **Normalization Level:** BCNF (Boyce-Codd Normal Form) - eliminate all anomalies
- **Data Integrity:** Foreign key constraints enforced, not application-level
- **Audit Trail:** Every change tracked via created_by, updated_by, timestamps
- **Soft Deletes:** No data ever truly deleted; use deleted_at for logical deletion
- **Performance:** Strategic indexes on foreign keys and frequently queried fields
- **Scalability:** Design supports 10,000+ departments and millions of transactions

### 2.2 Departments Table

The core table structure must include:

**Primary Key:**
- UUID type (not auto-increment)
- Generated via database UUID function, not application

**Core Data Fields:**
- Department name (string, required, unique, 3-255 characters)
- Department code (string, required, unique, uppercase, 2-50 characters)
- Description (text, optional, up to 1000 characters)

**Hierarchy Fields:**
- Parent department ID (UUID, optional, self-referencing foreign key)
- Should enforce: Cannot reference itself (parent_id != id)
- Should restrict: ON DELETE RESTRICT (cannot delete if has children)

**Leadership & Metadata:**
- Department head ID (UUID, foreign key to users table, can be NULL)
- Employee count (integer, default 0, must be >= 0)
- Status field (string, enum: ACTIVE or INACTIVE, default ACTIVE)

**Audit Fields:**
- Created by (UUID, required, foreign key to users table)
- Updated by (UUID, required, foreign key to users table)
- Created at (timestamp with timezone, auto-set to current time)
- Updated at (timestamp with timezone, auto-set to current time, updates on every change)
- Deleted at (timestamp with timezone, NULL while active, set to current time when soft deleted)

**Indexes Strategy:**
- Unique index on name (WHERE deleted_at IS NULL)
- Unique index on code (WHERE deleted_at IS NULL)
- Index on parent_department_id (WHERE deleted_at IS NULL)
- Index on status (WHERE deleted_at IS NULL)
- Index on department_head_id
- Composite index on parent_id + status + deleted_at
- Index on deleted_at (for quick active record filtering)

**Constraints:**
- Check: status IN ('ACTIVE', 'INACTIVE')
- Check: employee_count >= 0
- Check: parent_department_id != id (prevent self-reference)
- Foreign key on parent_id: ON DELETE RESTRICT
- Foreign key on department_head_id: ON DELETE SET NULL
- Foreign key on created_by, updated_by: ON DELETE RESTRICT

### 2.3 Hierarchy Validation Strategy

The system must prevent circular references in the department hierarchy:

**Level 1 - Database Constraint:**
- Self-reference check: parent_department_id != id

**Level 2 - Business Logic Validation:**
- When creating/updating a department with a parent, validate no circular reference exists
- Algorithm: Walk up the hierarchy from new_parent_id, checking if dept_id exists in the chain
- Max depth: 10 levels (reasonable organizational structure limit)
- If max depth exceeded: Reject with "hierarchy too deep" error

**Level 3 - Query Pattern:**
- When displaying hierarchy trees, ensure algorithms handle depth gracefully
- Use recursive CTEs (PostgreSQL WITH RECURSIVE) for efficient hierarchy queries

### 2.4 Soft Delete Implementation

Strategy: Never delete data; flag it as deleted via deleted_at timestamp.

**Soft Delete:**
- Set deleted_at = CURRENT_TIMESTAMP
- Update updated_at = CURRENT_TIMESTAMP
- Update updated_by = current_user_id

**Query Pattern:**
- Active records: WHERE deleted_at IS NULL
- All records (admin): No WHERE clause on deleted_at
- Restore option: SET deleted_at = NULL (optional, for data recovery)

**Benefit:** Maintains referential integrity and audit trail; allows data recovery

### 2.5 Audit Trail Implementation

Every department record must track:

**Who made changes:**
- created_by: User ID who created the record
- updated_by: User ID who last modified the record

**When changes happened:**
- created_at: Timestamp of creation
- updated_at: Timestamp of last update (auto-updated on every change)

**Optional - Audit Log Table:**
- Stores detailed history of all changes
- Fields: id, department_id, action (CREATE/UPDATE/DELETE/RESTORE), changed_by, changes (JSONB), timestamp
- Indexes: On department_id, timestamp
- Benefit: Legal compliance, dispute resolution, audit trails

---

## PART 3: BACKEND ARCHITECTURE

### 3.1 Folder Structure

Backend code must be organized as follows:

```
backend/
├── app/
│   ├── main.py                 # FastAPI app initialization, mount router
│   ├── config.py               # Configuration, environment variables
│   ├── security.py             # JWT utilities, password hashing
│   ├── logging_config.py        # Structured logging setup
│   ├── core/
│   │   ├── exceptions.py       # Custom exception classes
│   │   ├── constants.py        # Enums, constants, error codes
│   │   └── utils.py            # Utility functions
│   ├── middleware/
│   │   ├── auth_middleware.py  # JWT token validation
│   │   ├── error_handler.py    # Global exception handling
│   │   └── logging_middleware.py # Request/response logging
│   ├── database/
│   │   ├── session.py          # AsyncSession factory, lifecycle
│   │   └── base.py             # SQLAlchemy Base, metadata
│   ├── modules/
│   │   └── department/
│   │       ├── models.py       # SQLAlchemy ORM models
│   │       ├── schemas.py      # Pydantic request/response schemas
│   │       ├── repository.py   # Repository pattern (data access)
│   │       ├── service.py      # Service layer (business logic)
│   │       ├── router.py       # FastAPI router (endpoints)
│   │       ├── dependencies.py # Dependency injection
│   │       ├── validators.py   # Custom validators
│   │       ├── exceptions.py   # Domain-specific exceptions
│   │       └── tests/
│   │           ├── test_models.py
│   │           ├── test_repository.py
│   │           ├── test_service.py
│   │           └── test_router.py
│   └── shared/
│       ├── response_models.py  # Generic response wrappers
│       ├── pagination.py       # Pagination helpers
│       └── search_filters.py   # Search/filter utilities
├── migrations/
│   ├── alembic.ini
│   └── versions/
│       └── 001_create_departments_table.py
├── tests/
│   ├── conftest.py             # Pytest fixtures
│   ├── integration/
│   └── e2e/
├── requirements.txt
├── .env.example
└── run.sh
```

### 3.2 Models (SQLAlchemy ORM)

SQLAlchemy models must:

- Use SQLAlchemy 2.0 syntax with type hints (Mapped, mapped_column)
- Define every column with appropriate types and constraints
- Include relationships for parent-child hierarchy
- Add table-level constraints (CheckConstraint, ForeignKeyConstraint)
- Define indexes in __table_args__
- Include __repr__ method for debugging
- Support soft deletes via deleted_at
- Track audit fields (created_by, updated_by, timestamps)

Model should:
- Map to departments table
- Use UUID primary key (PG_UUID as_uuid=True)
- Enforce uniqueness on name and code
- Support self-referencing parent relationship
- Include all audit fields
- Implement soft delete support
- Have relationship to parent department (for hierarchy traversal)

### 3.3 Pydantic Schemas (Request/Response)

Schemas must handle:

**Base Schema (DepartmentBase):**
- All common fields: name, code, description, parent_id, department_head_id, employee_count, status
- Field validators for each: min/max length, enum validation, case conversion
- Example data in schema_extra

**Create Schema (DepartmentCreate):**
- Extends DepartmentBase
- Required fields only
- Pre-validation: code must be uppercase, status must be ACTIVE or INACTIVE
- No id, timestamps, audit fields

**Update Schema (DepartmentUpdate):**
- All fields optional (partial updates)
- Same validators as Create
- Allows null values for optional fields

**Response Schema (DepartmentResponse):**
- All fields including id, timestamps, audit fields
- config.from_attributes = True (for SQLAlchemy model conversion)
- Example response data

**List Response Schema (DepartmentListResponse):**
- Subset of fields (no description, simplified audit info)
- Used in paginated list responses

**Paginated Response Schema (PaginatedDepartmentResponse):**
- items: list of DepartmentListResponse
- total: total count
- page: current page number
- page_size: items per page
- total_pages: calculated

**Validators (built into schemas):**
- Code: Must be uppercase, alphanumeric, 2-50 characters
- Name: Must be 3-255 characters, not empty
- Status: Must be ACTIVE or INACTIVE
- Employee count: Must be >= 0
- Description: Optional, max 1000 characters

### 3.4 Repository Pattern (Data Access Layer)

Repository must handle all database operations:

**Methods Required:**

Create Operation:
- Takes: name, code, created_by, and optional fields
- Returns: Created Department model
- Logging: Log department creation with ID and code

Read Operations:
- get_by_id(dept_id) - fetch single department by UUID
- get_by_code(code) - fetch by department code
- list_active(...) - fetch paginated list with filters
  - Parameters: skip, limit, search, status, parent_id, sort_by, sort_order
  - Returns: Tuple of (departments list, total count)

Update Operation:
- update(dept_id, updated_by, **kwargs) - update fields dynamically
- Returns: Updated Department model

Delete Operation:
- soft_delete(dept_id, updated_by) - set deleted_at timestamp
- Returns: Soft-deleted Department model

Helper Methods:
- has_children(dept_id) - check if department has child departments
- has_employees(dept_id) - check if employee_count > 0
- check_name_exists(name, exclude_id) - check uniqueness (can exclude current dept)
- check_code_exists(code, exclude_id) - check uniqueness

Filtering & Searching:
- Filter by status (ACTIVE/INACTIVE)
- Filter by parent_department_id
- Search by name, code, or description (case-insensitive LIKE)
- Sort by: name, code, status, created_at, updated_at
- Pagination: skip (offset) and limit

All Queries:
- Only return active records (WHERE deleted_at IS NULL)
- Use indexes efficiently
- Log operations with structured logging

### 3.5 Service Layer (Business Logic)

Service must handle all business logic, validation, and error handling:

**Methods Required:**

Create Department:
- Accepts: DepartmentCreate schema, created_by user UUID
- Validates: Name uniqueness, code uniqueness
- Validates: Parent hierarchy (if parent provided, check it exists and no circular reference)
- Returns: DepartmentResponse
- Throws: DepartmentAlreadyExistsError, DepartmentNotFoundError, InvalidDepartmentHierarchyError

Get Department:
- Accepts: dept_id
- Returns: DepartmentResponse
- Throws: DepartmentNotFoundError

List Departments:
- Accepts: Skip, limit, search, status filter, parent_id filter, sort params
- Returns: Tuple of (list of DepartmentResponse, total count)
- Supports pagination, searching, filtering, sorting

Update Department:
- Accepts: dept_id, DepartmentUpdate schema, updated_by user UUID
- Validates: Updated name/code uniqueness (excluding current dept)
- Validates: Parent hierarchy if parent_id changed
- Returns: DepartmentResponse
- Throws: DepartmentNotFoundError, DepartmentAlreadyExistsError, InvalidDepartmentHierarchyError

Delete Department (Soft Delete):
- Accepts: dept_id, updated_by user UUID
- Validates: Cannot delete if has child departments (throws CannotDeleteDepartmentError)
- Validates: Cannot delete if has employees (throws CannotDeleteDepartmentError)
- Performs: Soft delete via repository
- Throws: DepartmentNotFoundError, CannotDeleteDepartmentError

**Service Characteristics:**
- All database calls go through repository
- All business logic enforced (not in database alone)
- Comprehensive error handling with custom exceptions
- Structured logging for all operations
- No direct SQLAlchemy usage (abstracted by repository)

### 3.6 Router (FastAPI Endpoints)

FastAPI router must expose 5 REST endpoints:

**List Departments - GET /api/v1/departments**
- Query parameters:
  - skip (int, >= 0, default 0): Pagination offset
  - limit (int, 1-100, default 20): Items per page
  - search (string, optional): Search departments by name/code/description
  - status (string, optional): Filter by ACTIVE or INACTIVE
  - parent_id (UUID, optional): Filter by parent department
  - sort_by (string, default "created_at"): Sort field
  - sort_order (string, default "desc"): asc or desc
- Response: ResponseModel[PaginatedDepartmentResponse]
- Status Code: 200
- Error Handling: 500 on server error

**Create Department - POST /api/v1/departments**
- Request body: DepartmentCreate schema
- Response: ResponseModel[DepartmentResponse]
- Status Code: 201 Created
- Error Handling:
  - 409 Conflict if name/code already exists
  - 404 Not Found if parent department doesn't exist
  - 400 Bad Request if circular hierarchy detected
  - 500 on server error

**Get Department - GET /api/v1/departments/{dept_id}**
- Path parameter: dept_id (UUID)
- Response: ResponseModel[DepartmentResponse]
- Status Code: 200
- Error Handling:
  - 404 Not Found if department doesn't exist
  - 500 on server error

**Update Department - PUT /api/v1/departments/{dept_id}**
- Path parameter: dept_id (UUID)
- Request body: DepartmentUpdate schema (all fields optional)
- Response: ResponseModel[DepartmentResponse]
- Status Code: 200
- Error Handling:
  - 404 Not Found if department doesn't exist
  - 409 Conflict if name/code already exists
  - 400 Bad Request if circular hierarchy detected
  - 500 on server error

**Delete Department - DELETE /api/v1/departments/{dept_id}**
- Path parameter: dept_id (UUID)
- Response: ResponseModel (no data, just success message)
- Status Code: 200
- Error Handling:
  - 404 Not Found if department doesn't exist
  - 409 Conflict if department has children or employees
  - 500 on server error

**Response Wrapper (ResponseModel):**
- Wraps all responses in consistent format
- Fields: data (optional), message (string), status (success/error)
- Example: { "data": {...}, "message": "Department created successfully", "status": "success" }

**Endpoint Documentation:**
- Each endpoint includes OpenAPI docstring
- Parameter descriptions
- Response descriptions
- Error codes documented
- Swagger UI auto-generates from these

### 3.7 Custom Exceptions

Module must define domain-specific exceptions:

**DepartmentException** (Base)
- Parent class for all department-related errors
- Inherits from Exception

**DepartmentNotFoundError**
- Thrown when department doesn't exist
- Message: "Department {id} not found"

**DepartmentAlreadyExistsError**
- Thrown when name or code is duplicate
- Message: "Department name/code already exists"

**InvalidDepartmentHierarchyError**
- Thrown when circular reference detected
- Message: "Circular hierarchy detected" or "Parent department not found"

**CannotDeleteDepartmentError**
- Thrown when trying to delete protected department
- Message: "Cannot delete department with child departments" or "Cannot delete department with employees"

Each exception:
- Inherits from DepartmentException
- Has clear, actionable message
- Maps to appropriate HTTP status code

### 3.8 Validators

Module must implement business rule validators:

**Circular Hierarchy Validator:**
- Accepts: repository, new_parent_id, dept_id (optional), max_depth
- Logic: Walk up hierarchy from new_parent_id checking for cycles
- Returns: Boolean (True = valid, False = circular)
- Max iterations: 10 (prevents infinite loops)
- Logs warnings when cycles detected

**Name Uniqueness Validator:**
- Accepts: name, exclude_id (optional)
- Checks: No other active department has this name
- Returns: Boolean

**Code Uniqueness Validator:**
- Accepts: code, exclude_id (optional)
- Checks: No other active department has this code
- Returns: Boolean

**Status Validator:**
- Accepts: status string
- Checks: Value is ACTIVE or INACTIVE
- Returns: Boolean

### 3.9 Dependency Injection

FastAPI endpoints must use dependency injection:

**get_db_session():**
- Returns: AsyncSession for database operations
- Lifecycle: Yields session, closes after request

**get_department_repository():**
- Depends on: get_db_session
- Returns: DepartmentRepository instance

**get_department_service():**
- Depends on: get_department_repository
- Returns: DepartmentService instance

**get_current_user_id():**
- Depends on: Supabase Auth (JWT token in Authorization header)
- Returns: Current user's UUID
- Throws: HTTPException 401 if not authenticated

Endpoints receive dependencies via:
```python
async def endpoint(
    service: DepartmentService = Depends(get_department_service),
    current_user_id: UUID = Depends(get_current_user_id)
)
```

### 3.10 Logging Strategy

All operations must log structured information:

**Framework:** structlog (structured logging, not print statements)

**Log Levels:**
- INFO: Normal operations (created, updated, deleted, listed)
- WARNING: Business logic violations (duplicate name, circular hierarchy, protected delete)
- ERROR: System failures (database errors, unexpected exceptions)

**Log Fields:**
- operation_name: What happened
- dept_id: Department ID
- user_id: User who performed action
- error: Error message (if applicable)
- count: Items affected (if applicable)

**Examples:**
- "department_created": dept_id, code, created_by
- "department_updated": dept_id, updated_by
- "department_deleted": dept_id, deleted_by
- "department_not_found": dept_id
- "circular_hierarchy_detected": attempted_parent_id

---

## PART 4: FRONTEND ARCHITECTURE

### 4.1 Folder Structure

Frontend code must be organized as:

```
src/
├── pages/
│   └── Departments/
│       ├── index.tsx               # Main list page
│       ├── DepartmentDetail.tsx    # Detail drawer/view
│       └── components/
│           ├── DepartmentTable.tsx       # Reusable table
│           ├── CreateDialog.tsx          # Create modal
│           ├── EditDialog.tsx            # Edit modal
│           ├── DeleteDialog.tsx          # Delete confirmation
│           ├── SearchBar.tsx             # Search input
│           ├── FilterBar.tsx             # Filter controls
│           ├── StatusFilter.tsx          # Status filter
│           ├── Breadcrumbs.tsx           # Navigation breadcrumbs
│           ├── EmptyState.tsx            # No data state
│           ├── ErrorState.tsx            # Error state
│           └── LoadingSkeleton.tsx       # Loading placeholders
├── hooks/
│   ├── useDepartments.ts           # React Query list hook
│   ├── useDepartment.ts            # React Query single hook
│   ├── useCreateDepartment.ts      # Mutation hook
│   ├── useUpdateDepartment.ts      # Mutation hook
│   ├── useDeleteDepartment.ts      # Mutation hook
│   ├── useDebounce.ts              # Search debounce
│   └── usePagination.ts            # Pagination state
├── services/
│   └── departmentService.ts        # Axios API client
├── types/
│   └── department.ts               # TypeScript interfaces
├── constants/
│   └── departments.ts              # Enums, messages
└── utils/
    └── formatters.ts               # Format utilities
```

### 4.2 Custom Hooks

Hooks must leverage TanStack Query for data fetching and state management:

**useDepartments Hook:**
- Returns: UseQueryResult with paginated departments
- Accepts options: page, pageSize, search, status, parentId, sortBy, sortOrder, enabled
- Query key: 'departments' with all filter parameters
- Stale time: 5 minutes
- Retry: 2 attempts on failure
- Supports pagination: Calculate skip from page and pageSize

**useDepartment Hook:**
- Returns: UseQueryResult with single department
- Accepts: departmentId (string)
- Query key: 'department' with id
- Stale time: 5 minutes
- Only runs if id is provided (enabled check)

**useCreateDepartment Hook:**
- Returns: UseMutationResult
- Mutation function: departmentService.createDepartment
- Invalidates queries: 'departments' after success
- Shows success toast
- Shows error toast with message

**useUpdateDepartment Hook:**
- Returns: UseMutationResult
- Mutation function: departmentService.updateDepartment
- Invalidates queries: 'departments' and specific department
- Shows success/error toasts

**useDeleteDepartment Hook:**
- Returns: UseMutationResult
- Mutation function: departmentService.deleteDepartment
- Invalidates queries: 'departments'
- Shows success/error toasts

**useDebounce Hook:**
- Returns: Debounced value
- Default delay: 500ms
- Used for search input

**usePagination Hook:**
- Returns: Page, pageSize, setPagination helpers
- Manages pagination state locally
- Provides goToPage, nextPage, prevPage methods

### 4.3 Axios Service

Service layer must handle all API communication:

**Initialization:**
- Create axios instance with base URL from env (VITE_API_URL)
- Default headers: Content-Type: application/json

**Interceptors:**
- Request interceptor: Add Authorization header with Bearer token from localStorage
- Response interceptor: Handle 401 Unauthorized by clearing token and redirecting to login

**Methods:**

listDepartments(params):
- GET /api/v1/departments
- Params: skip, limit, search, status, parent_id, sort_by, sort_order
- Returns: Promise<PaginatedDepartmentResponse>

getDepartment(id):
- GET /api/v1/departments/{id}
- Returns: Promise<DepartmentResponse>

createDepartment(data):
- POST /api/v1/departments
- Body: DepartmentCreate
- Returns: Promise<DepartmentResponse>

updateDepartment(id, data):
- PUT /api/v1/departments/{id}
- Body: DepartmentUpdate (partial)
- Returns: Promise<DepartmentResponse>

deleteDepartment(id):
- DELETE /api/v1/departments/{id}
- Returns: Promise<void>

**Error Handling:**
- Log errors with user ID and operation
- Re-throw for component handling

### 4.4 React Components

Components must be production-ready, reusable, and fully typed:

**DepartmentTable Component:**
- Props: departments array, isLoading boolean, onEdit callback, onDelete callback
- Features:
  - Displays columns: Name, Code, Status badge, Employee count, Created date, Actions menu
  - Loading skeleton when isLoading true
  - Empty state message when no departments
  - Hover effects on rows
  - Dropdown menu with Edit/Delete actions
  - Responsive layout
- Styling: Use Tailwind CSS with design system tokens (colors, spacing, shadows)

**CreateDialog Component:**
- Modal dialog for creating new department
- Form fields: name, code, description, parent_department_id, department_head_id, employee_count, status
- Validation: Real-time field validation with Zod
- Submit button: Green primary button
- Cancel button: Secondary button
- Error display: Toast notifications
- Success: Closes dialog, refreshes list

**EditDialog Component:**
- Similar to CreateDialog but for updates
- Pre-fills form with existing department data
- Only allows updating fields that aren't system-controlled
- Validates hierarchy changes in real-time

**DeleteDialog Component:**
- Confirmation modal with warning message
- Shows department name being deleted
- Explains restrictions (can't delete if has children/employees)
- Cancel and Confirm buttons
- Error handling: Shows specific reason why delete failed

**SearchBar Component:**
- Input field with search icon
- Placeholder: "Search by name, code..."
- Debounced (500ms) onChange
- Clears button when has text
- Accessible: aria-label, proper label

**FilterBar Component:**
- Status filter dropdown: All, Active, Inactive
- Parent department filter: Dropdown of hierarchy
- Reset filters button
- Compact design, horizontal layout

**StatusFilter Component:**
- Dropdown/select with options: All, Active, Inactive
- Shows current selection
- Updates parent state on change

**Breadcrumbs Component:**
- Shows current location in hierarchy
- Links back to parent departments
- Format: "Departments / Parent Dept / Current Dept"
- Last item: not a link (current page)

**EmptyState Component:**
- Shows when no departments exist
- Icon: Inbox or similar from lucide-react
- Message: "No departments found"
- CTA button: "Create first department"

**ErrorState Component:**
- Shows when data fetch fails
- Icon: AlertCircle
- Message: Error description
- Retry button

**LoadingSkeleton Component:**
- Displays while departments loading
- 5-6 fake rows with placeholder bars
- Animates pulse effect
- Matches table layout

### 4.5 Types & Constants

**Types (department.ts):**
- DepartmentCreate: Request schema
- DepartmentUpdate: Request schema
- DepartmentResponse: Full response with timestamps
- DepartmentListResponse: Simplified list item
- PaginatedDepartmentResponse: List wrapper with pagination
- Define all fields with proper types (UUID, string, number, Date)

**Constants (departments.ts):**
- Status enum: ACTIVE, INACTIVE
- Error messages: "Failed to create", "Cannot delete with employees", etc.
- Success messages: "Department created successfully"
- API paths
- Validation constraints: min/max lengths, patterns

### 4.6 Utilities

**Formatters (formatters.ts):**
- formatDate(date): Format Date to "MMM d, yyyy" format
- formatDateTime(date): Format to "MMM d, yyyy HH:mm"
- formatEmployeeCount(count): Show "1 employee", "5 employees"
- truncateString(str, length): Truncate with ellipsis
- capitalizeStatus(status): ACTIVE → Active

### 4.7 Main Departments Page

**Layout:**
- Breadcrumbs at top
- Page title: "Department Management" (H1)
- Subtitle: "Manage organizational structure and ESG ownership"
- Controls bar: Search, Filters, Create button
- Main content: Table or empty state
- Pagination: At bottom

**Interactions:**
- Search: Debounced, triggers list refresh
- Filters: Update immediately, combine with search
- Sort: Click column headers to sort
- Pagination: Click page numbers or prev/next
- Create button: Opens CreateDialog
- Table row actions: Edit/Delete via dropdown

**Loading States:**
- Initial load: Show skeleton
- Refetch: Show existing data, subtle reload indicator
- Searching: Keep table visible, show loading state

**Error Handling:**
- Failed load: Show error state with retry
- Failed create/update: Toast notification with error message
- Failed delete: Toast notification with specific reason

### 4.8 Accessibility Features

- Keyboard navigation: Tab through all controls, Enter to activate
- Focus indicators: Visible 2px green ring on all interactive elements
- Labels: Every form field has associated <label>
- Semantic HTML: Use <button>, <input>, <select> properly
- ARIA: aria-label on icon-only buttons, aria-live on toasts
- Color: Don't rely on color alone for status (use text + color)
- Text contrast: 4.5:1 for all text
- Touch targets: Minimum 44px on mobile

### 4.9 Performance Optimizations

- React Query: Caching, stale time, gc time configured
- Pagination: Don't fetch all at once; default 20 per page
- Search debounce: 500ms delay to reduce API calls
- Virtualized table: If 1000+ departments, consider virtual scrolling
- Memoization: Use React.memo for list items
- Code splitting: Lazy load detail drawer if heavy
- Images: Use optimized icons (Lucide React already optimized)

---

## PART 5: VALIDATION STRATEGY

### 5.1 Frontend Validation

All form inputs must validate in real-time:

**Department Name:**
- Required: Show error if empty
- Min length: 3 characters
- Max length: 255 characters
- Uniqueness: Check as user types (debounced) - "This name is already used"

**Department Code:**
- Required: Show error if empty
- Format: Must be uppercase alphanumeric only
- Min/Max: 2-50 characters
- Auto-convert: Lowercase input to uppercase automatically
- Uniqueness: Check if already exists

**Status:**
- Required: Default ACTIVE
- Options: Dropdown with ACTIVE / INACTIVE only

**Parent Department:**
- Optional: Can be null
- Validation: Cannot select itself
- Hierarchy check: Cannot select a child as parent (circular reference)

**Employee Count:**
- Optional: Default 0
- Type: Integer only
- Min: 0 (non-negative)
- Format: Numbers only, no text

**Validation Display:**
- Field-level errors: Red border, error text below field
- Form-level errors: Toast notification
- Submit button: Disabled until form valid
- Real-time: Validate as user types (after blur or debounce)

### 5.2 Backend Validation

All incoming requests must be validated:

**Schema Validation (Pydantic):**
- Type checking: Reject non-string for name field
- Length validation: min/max enforced
- Enum validation: Status must be ACTIVE or INACTIVE
- Required fields: Reject missing name/code
- Auto-conversion: Uppercase code

**Business Logic Validation (Service):**
- Uniqueness: Name and code must be unique (excluding current record on update)
- Hierarchy: Parent must exist, no circular references
- Constraints: Employee count >= 0
- Soft delete: Don't return deleted departments in lists

**Database Validation (Constraints):**
- Primary key: UUID uniqueness
- Unique constraints: On name, code
- Check constraints: Status enum, employee_count >= 0
- Foreign keys: Parent department must exist
- Self-reference: Cannot reference itself as parent

### 5.3 Business Rules (Non-Negotiable)

- Department Name: Unique, required, 3-255 characters
- Department Code: Unique, uppercase, required, 2-50 characters
- Status: Only ACTIVE or INACTIVE (default ACTIVE)
- Parent Department: Cannot reference itself, no circular hierarchies
- Delete Restrictions: Cannot delete if has child departments or employees
- Soft Delete: Only logical delete via deleted_at (no hard delete)

---

## PART 6: TESTING STRATEGY

### 6.1 Test Coverage Requirements

**Target: 90%+ code coverage across all layers**

**Backend:**
- Unit tests for Models: Relationships, constraints
- Unit tests for Schemas: Validation rules
- Unit tests for Repository: CRUD operations
- Unit tests for Service: Business logic, error cases
- Integration tests: Repository + Service + DB
- API tests: Router endpoints, error responses, status codes
- Validation tests: All validation rules
- Edge case tests: Circular hierarchy, circular deletion, boundary values

**Frontend:**
- Component tests: Rendering, user interactions
- Hook tests: Data fetching, mutations
- Form tests: Validation, submission
- Integration tests: Component + service interactions
- Accessibility tests: WCAG compliance, keyboard nav
- E2E tests (optional): User workflows in browser

### 6.2 Test Examples to Follow

**Backend Unit Test Pattern:**
- Setup: Create test fixtures (departments, users)
- Execute: Call service/repository method
- Assert: Verify result and side effects
- Cleanup: Rollback transactions

Example areas:
- test_create_department_success
- test_create_duplicate_name_fails
- test_circular_hierarchy_prevented
- test_cannot_delete_with_children
- test_cannot_delete_with_employees
- test_soft_delete_hides_record
- test_update_parent_hierarchy_validation
- test_search_departments_by_name
- test_pagination_limits_results
- test_filter_by_status

**Frontend Component Test Pattern:**
- Render: Mount component with props
- User interaction: Simulate clicks, typing
- Assert: Verify UI updates, callbacks called

Example areas:
- test_renders_empty_state_when_no_departments
- test_renders_table_with_departments
- test_open_create_dialog_on_button_click
- test_validate_name_required
- test_submit_creates_department
- test_delete_confirmation_dialog_shows
- test_cancel_closes_dialog
- test_search_filters_departments
- test_pagination_navigates_pages
- test_status_badge_displays_correctly

### 6.3 Continuous Testing

- Unit tests: Run on every commit
- Integration tests: Run before merge
- API tests: Run on deployment
- Coverage reports: Track and maintain 90%+
- Regression tests: Before each release

---

## PART 7: SECURITY REQUIREMENTS

### 7.1 OWASP Compliance

- SQL Injection: Parameterized queries (SQLAlchemy), no string concatenation
- XSS: Sanitize user input, escape HTML output, CSP headers
- CSRF: CORS configured, same-site cookies
- Authentication: JWT via Supabase Auth, token validation on every request
- Authorization: Verify user_id in created_by/updated_by matches current user
- Rate limiting: Implement on API endpoints to prevent abuse
- Input validation: Both frontend and backend, Zod + Pydantic

### 7.2 Data Protection

- Passwords: Never stored, handled by Supabase Auth
- Sensitive data: Audit trail shows who made changes
- Soft deletes: Maintain data integrity, no permanent loss
- Environment variables: Keep secrets in .env, never in code
- HTTPS: Always use TLS in production

---

## PART 8: DOCUMENTATION REQUIREMENTS

### 8.1 Code Documentation

Every file must have:
- Module docstring: What does this file do?
- Function/method docstrings: Args, returns, raises, examples
- Complex logic: Inline comments explaining "why", not "what"
- Type hints: All functions have complete type annotations

### 8.2 API Documentation

- OpenAPI/Swagger: Auto-generated from FastAPI docstrings
- Endpoint summaries: Clear, actionable
- Parameter descriptions: What each parameter does, valid values
- Response descriptions: What data is returned
- Error codes: 404, 409, 400, etc. and what triggers them
- Example requests: Show sample data
- Example responses: Show expected output

### 8.3 Database Documentation

- Schema diagram: Visual representation of tables and relationships
- Column descriptions: What each field represents
- Indexes explanation: Why each index exists
- Constraints explanation: Why each constraint exists
- Audit trail: How changes are tracked

### 8.4 Frontend Documentation

- Component stories: Storybook examples of each component
- Props documentation: What each prop does, type, default value
- Hook documentation: What they do, return types, usage examples
- Service documentation: API methods, parameters, responses
- Type documentation: Interfaces and their fields

### 8.5 Setup & Deployment

- README: How to set up locally
- Environment variables: All required .env variables
- Database setup: How to run migrations
- Running backend: How to start FastAPI server
- Running frontend: How to start React dev server
- Testing: How to run tests
- Deployment: How to deploy to production

---

## PART 9: DELIVERABLES CHECKLIST

### Database Deliverables
- [ ] PostgreSQL schema with all tables, columns, constraints
- [ ] Alembic migration files (versioned, reversible)
- [ ] SQLAlchemy models with relationships and constraints
- [ ] Indexes strategy document
- [ ] Soft delete implementation
- [ ] Audit trail design

### Backend Deliverables
- [ ] Complete folder structure
- [ ] SQLAlchemy models (typed, with relationships)
- [ ] Pydantic schemas (create, update, response, list, paginated)
- [ ] Repository layer (all CRUD + helper methods)
- [ ] Service layer (all business logic + validation)
- [ ] FastAPI router (all 5 endpoints with error handling)
- [ ] Custom exceptions (5+ domain-specific)
- [ ] Validators (hierarchy, uniqueness)
- [ ] Dependency injection setup
- [ ] Structured logging throughout
- [ ] 90%+ test coverage (unit + integration)
- [ ] OpenAPI/Swagger documentation
- [ ] README with setup instructions

### Frontend Deliverables
- [ ] Complete folder structure
- [ ] Pages component (Departments list page)
- [ ] Reusable data table component
- [ ] Create dialog component
- [ ] Edit dialog component
- [ ] Delete confirmation component
- [ ] Search bar component
- [ ] Filter bar component
- [ ] Status badge component
- [ ] Breadcrumbs component
- [ ] Empty state component
- [ ] Error state component
- [ ] Loading skeleton component
- [ ] React Query hooks (useDepartments, useDepartment, mutations)
- [ ] Axios service with auth + error handling
- [ ] TypeScript types (all interfaces)
- [ ] Constants and enums
- [ ] Formatters utilities
- [ ] Component tests (90%+ coverage)
- [ ] Accessibility compliance (WCAG 2.1 AA)
- [ ] Responsive design (mobile-first)

### Quality & Documentation
- [ ] README: Complete setup guide
- [ ] Code: No TypeScript errors, no linting warnings
- [ ] Tests: 90%+ coverage, all edge cases
- [ ] Security: OWASP compliance checklist
- [ ] Performance: Query optimization, pagination, caching
- [ ] Accessibility: Keyboard nav, screen readers, contrast
- [ ] Database docs: Schema, relationships, indexes
- [ ] API docs: All endpoints documented in Swagger
- [ ] Component docs: Prop descriptions, usage examples

---

## PART 10: SUCCESS CRITERIA (Production-Ready Gates)

This module is **ONLY COMPLETE** when:

### ✅ Database Layer
- [ ] Normalized schema with BCNF
- [ ] All constraints enforced (check, foreign key, unique)
- [ ] Soft delete working
- [ ] Audit trail tracking all changes
- [ ] Indexes on all searched/filtered fields
- [ ] Circular hierarchy prevention at database level
- [ ] Query performance: Lists with 1000+ records < 500ms

### ✅ Backend Layer
- [ ] 5 REST endpoints fully functional
- [ ] All validation rules enforced
- [ ] Circular hierarchy validated
- [ ] Cannot delete protected departments
- [ ] Repository pattern clean and reusable
- [ ] Service layer handles all business logic
- [ ] 90%+ test coverage with all edge cases
- [ ] Structured logging on every operation
- [ ] Error responses consistent and helpful
- [ ] OpenAPI documentation complete

### ✅ Frontend Layer
- [ ] List page loads with real data
- [ ] Create dialog works end-to-end
- [ ] Edit dialog works end-to-end
- [ ] Delete confirmation prevents dangerous operations
- [ ] Search filters results (debounced)
- [ ] Pagination works correctly
- [ ] Status badges display correctly
- [ ] Loading states show while fetching
- [ ] Empty state shows when no departments
- [ ] Error state shows with retry
- [ ] Responsive on mobile, tablet, desktop
- [ ] WCAG 2.1 AA accessibility compliance
- [ ] No generic AI UI slop (custom, intentional design)

### ✅ Integration
- [ ] Full data flow: UI → API → Database
- [ ] No mock data; all real database calls
- [ ] Auth token properly managed
- [ ] Error messages propagate correctly
- [ ] Optimistic updates work (React Query)

### ✅ Testing
- [ ] 90%+ code coverage
- [ ] All CRUD operations tested
- [ ] All validation rules tested
- [ ] All error scenarios tested
- [ ] All business rules tested
- [ ] Circular hierarchy edge cases covered
- [ ] Delete protection rules verified

### ✅ Documentation
- [ ] Code is self-documenting
- [ ] Functions have docstrings
- [ ] Types are fully specified
- [ ] API endpoints documented
- [ ] Setup instructions clear
- [ ] Deployment guide included
- [ ] Database schema documented

### ✅ Quality
- [ ] Zero TypeScript errors
- [ ] Zero linting warnings
- [ ] No hardcoded values (all in constants)
- [ ] No duplicate code (DRY principle)
- [ ] No "any" types in TypeScript
- [ ] All promises handled (async/await)
- [ ] No console.log (use structured logging)
- [ ] Security hardened (OWASP)

---

## FINAL INSTRUCTIONS

### For Backend Developer:
Use this prompt to understand:
1. Database schema required (Part 2)
2. Backend architecture (Part 3)
3. Validation rules (Part 5)
4. Testing expectations (Part 6)
5. Security requirements (Part 7)

Build the complete backend with database migrations, models, schemas, repository, service, and router.

### For Frontend Developer:
Use this prompt to understand:
1. Design system exactly (Part 1)
2. Component requirements (Part 4)
3. Validation rules (Part 5)
4. Testing expectations (Part 6)
5. Accessibility standards (Part 1.10)

Build the complete frontend with pages, components, hooks, and services.

### For QA/Testing Engineer:
Use the testing section (Part 6) to write test plans covering:
- All CRUD operations
- All validation rules
- All error scenarios
- All business rules
- Performance benchmarks

### For DevOps/Deployment:
Use the deployment section (Part 8) to set up:
- Docker/Docker Compose
- GitHub Actions CI/CD
- Environment configurations
- Database migrations automation

### For Product/Stakeholders:
This module enables:
- Organizational hierarchy setup
- Department-level ESG ownership
- Department tracking and reporting
- Foundation for all downstream modules

---

## ARCHITECTURE PHILOSOPHY

**"Module 1 is the template. Everything that follows uses this pattern."**

Future modules will replicate:
- Repository pattern for data access
- Service layer for business logic
- Pydantic schemas for validation
- Repository + Service testing pattern
- API endpoint structure
- Frontend component organization
- React Query integration
- Design system compliance

Make no shortcuts. Cut no corners. This sets the standard for the entire platform.

---

**Version:** 1.0  
**Status:** Production-Grade Prompt (No Code)  
**Created:** July 2026  
**For:** Odoo Hackathon - EcoSphere ESG Management Platform  

