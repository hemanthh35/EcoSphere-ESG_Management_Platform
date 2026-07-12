# EcoSphere ESG Management Platform

# Phase 5 -- Governance Module (Implementation Blueprint)

## Mandatory Architecture Review

Before writing code:

-   Inspect the existing repository.
-   Review frontend architecture, backend architecture, routing, shared
    components, authentication, RBAC, database schema, services, hooks,
    API layer, utilities and layouts.
-   Reuse existing code wherever possible.
-   Do not duplicate components or business logic.
-   Follow the existing enterprise architecture.

------------------------------------------------------------------------

# Objective

Build the complete Governance module end-to-end with production-ready
architecture.

Tech Stack

-   React 19
-   TypeScript
-   Vite
-   Tailwind CSS
-   shadcn/ui
-   FastAPI
-   SQLAlchemy
-   Supabase PostgreSQL
-   Supabase Auth

------------------------------------------------------------------------

# Module 5.1 ESG Policies

## Purpose

Manage organizational ESG policies.

## Database

Table: esg_policies

Fields

-   id
-   policy_code
-   title
-   version
-   department_id
-   description
-   effective_date
-   expiry_date
-   attachment_url
-   status
-   created_by
-   updated_by
-   created_at
-   updated_at
-   deleted_at
-   is_deleted

## Frontend Pages

-   Policy List
-   Create Policy
-   Edit Policy
-   Policy Details
-   Policy Version History

## Components

-   PolicyTable
-   PolicyForm
-   PolicyDrawer
-   PolicyViewer
-   SearchBar
-   FilterBar
-   StatusBadge
-   DeleteDialog

## Backend

-   models.py
-   schemas.py
-   repository.py
-   service.py
-   router.py
-   validators.py
-   permissions.py
-   exceptions.py
-   dependencies.py

## APIs

GET /policies GET /policies/{id} POST /policies PUT /policies/{id}
DELETE /policies/{id} GET /policies/dropdown

## User Stories

-   Admin creates ESG policies.
-   Employee views current policies.
-   ESG Manager updates policy versions.

## Acceptance Criteria

-   Versioning supported.
-   Active policy visible.
-   Soft delete only.

------------------------------------------------------------------------

# Module 5.2 Policy Acknowledgements

## Database

policy_acknowledgements

Fields

-   id
-   policy_id
-   employee_id
-   acknowledged_at
-   status
-   remarks

## Frontend Pages

-   Pending Acknowledgements
-   My Policies
-   Acknowledgement History

## Components

-   AcknowledgementTable
-   PolicyReader
-   AcceptDialog
-   StatusBadge

## Backend

Standard enterprise architecture.

## User Stories

-   Employee acknowledges policies.
-   Admin tracks completion.

## Acceptance Criteria

-   One acknowledgement per employee per policy version.
-   Reminder support.

------------------------------------------------------------------------

# Module 5.3 Audits

## Database

audits

Fields

-   id
-   audit_code
-   department_id
-   auditor_id
-   title
-   start_date
-   end_date
-   findings
-   status
-   created_at
-   updated_at

## Frontend Pages

-   Audit List
-   Create Audit
-   Audit Details
-   Audit Timeline

## Components

-   AuditTable
-   AuditForm
-   Timeline
-   FindingsPanel

## User Stories

-   Auditor creates audit.
-   Manager reviews findings.

## Acceptance Criteria

-   Lifecycle tracked.
-   Audit history retained.

------------------------------------------------------------------------

# Module 5.4 Compliance Issues

## Database

compliance_issues

Fields

-   id
-   audit_id
-   title
-   description
-   severity
-   owner_id
-   due_date
-   resolution
-   status
-   created_at
-   updated_at

## Frontend Pages

-   Compliance List
-   Create Issue
-   Issue Details
-   Resolution Board

## Components

-   ComplianceTable
-   IssueForm
-   SeverityBadge
-   ResolutionDrawer

## User Stories

-   Auditor raises issue.
-   Owner resolves issue.
-   ESG Manager tracks overdue issues.

## Acceptance Criteria

-   Owner required.
-   Due date required.
-   Overdue issues highlighted.

------------------------------------------------------------------------

# Module 5.5 Governance Dashboard

## Pages

-   Executive Governance Dashboard
-   Department Governance Dashboard

## Widgets

-   Policies
-   Pending Acknowledgements
-   Audit Status
-   Compliance Issues
-   Overdue Issues
-   KPI Cards
-   Charts
-   Trends

------------------------------------------------------------------------

# Shared Frontend Components

-   DataTable
-   SearchBar
-   FilterBar
-   Pagination
-   Breadcrumb
-   PageHeader
-   EmptyState
-   LoadingSkeleton
-   ConfirmDialog
-   Toast Notifications

------------------------------------------------------------------------

# Backend Standards

Each module includes

-   models.py
-   schemas.py
-   repository.py
-   service.py
-   router.py
-   validators.py
-   permissions.py
-   exceptions.py
-   dependencies.py

Repository Pattern

Service Layer

Dependency Injection

RBAC

Logging

Validation

Searching

Filtering

Pagination

Soft Delete

------------------------------------------------------------------------

# Integration

React → Axios → FastAPI → SQLAlchemy → Supabase PostgreSQL

No mock data.

------------------------------------------------------------------------

# Testing

-   Unit Tests
-   Integration Tests
-   CRUD Tests
-   API Tests
-   Validation Tests
-   Permission Tests
-   Component Tests
-   Dashboard Tests

------------------------------------------------------------------------

# Success Criteria

-   Database complete
-   Backend complete
-   APIs complete
-   Frontend complete
-   Validation complete
-   Permissions complete
-   Integration complete
-   Dashboard complete
-   Testing complete

------------------------------------------------------------------------

# Final Verification (Mandatory)

Before marking this phase complete:

1.  Review the existing codebase again and ensure new code follows the
    current architecture.
2.  Run:

``` bash
npm run build
```

3.  Resolve every TypeScript and build error.
4.  Verify backend starts successfully.
5.  Verify database migrations execute.
6.  Verify all governance routes load.
7.  Verify APIs function correctly.
8.  Produce a GOVERNANCE_COMPLETION_REPORT.md containing:
    -   Files created
    -   Files modified
    -   Database changes
    -   API endpoints
    -   Build status
    -   Remaining issues (if any)

Do not mark this phase complete until the application builds
successfully and all Governance functionality is integrated.
