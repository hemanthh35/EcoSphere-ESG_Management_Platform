# EcoSphere ESG Management Platform

# Phase 4 -- Social Module (Implementation Blueprint)

## Objective

Build the complete Social module for the EcoSphere ESG Management
Platform.

**Before implementing anything:**

-   Review the existing repository.
-   Reuse existing architecture.
-   Do not duplicate components.
-   Follow the existing coding standards.
-   Integrate with existing Authentication, Master Data and
    Environmental modules.

------------------------------------------------------------------------

# Mandatory Architecture Review

Inspect:

-   Folder structure
-   Existing frontend modules
-   Existing backend modules
-   Database schema
-   Routing
-   Shared components
-   API layer
-   Authentication
-   Permissions
-   Hooks
-   Services
-   Utilities

Only create files that are missing.

------------------------------------------------------------------------

# Module Scope

## 4.1 CSR Activities

Purpose: Create and manage Corporate Social Responsibility activities.

Frontend Pages

-   CSR Activities List
-   Create CSR Activity
-   Edit CSR Activity
-   CSR Activity Details
-   CSR Calendar View

Frontend Components

-   CSR Table
-   CSR Form
-   CSR Card
-   CSR Drawer
-   Search
-   Filters
-   Status Badge
-   Delete Dialog
-   Approval Badge

Backend

-   models.py
-   schemas.py
-   repository.py
-   service.py
-   router.py
-   validators.py
-   permissions.py
-   exceptions.py
-   dependencies.py

Database Table

csr_activities

Fields

-   id
-   activity_code
-   title
-   category_id
-   department_id
-   description
-   start_date
-   end_date
-   location
-   max_participants
-   status
-   created_by
-   updated_by
-   created_at
-   updated_at

User Stories

-   As an ESG Manager I can create CSR activities.
-   As an Employee I can view available CSR activities.
-   As an Admin I can manage CSR activities.

Acceptance Criteria

-   CRUD works
-   Search works
-   Filter works
-   Pagination works
-   Validation enforced

------------------------------------------------------------------------

## 4.2 Employee Participation

Purpose

Track employee participation.

Frontend Pages

-   Participation List
-   Join Activity
-   Upload Evidence
-   Participation Details
-   Approval Queue

Components

-   Participation Table
-   Upload Dialog
-   Approval Dialog
-   Status Badge

Backend

Standard enterprise module architecture.

Database

employee_participation

Fields

-   id
-   employee_id
-   activity_id
-   proof_url
-   approval_status
-   points_earned
-   completion_date

User Stories

-   Employee joins activity.
-   Manager approves evidence.
-   System awards points.

Acceptance Criteria

-   Employee cannot join twice.
-   Evidence required if configured.
-   Points awarded after approval.

------------------------------------------------------------------------

## 4.3 Diversity Metrics

Purpose

Track workforce diversity.

Frontend Pages

-   Diversity Dashboard
-   Diversity Metrics
-   Department Diversity

Backend

CRUD + analytics.

Database

diversity_metrics

Fields

-   id
-   department_id
-   metric_name
-   metric_value
-   reporting_period

User Stories

-   ESG Manager records diversity metrics.
-   Executives view diversity analytics.

Acceptance Criteria

-   Metrics stored by period.
-   Department filters work.

------------------------------------------------------------------------

## 4.4 Training Completion

Purpose

Track ESG training completion.

Frontend Pages

-   Training List
-   Assign Training
-   Completion Status
-   Certificates

Database

training_records

Fields

-   id
-   employee_id
-   training_name
-   completion_date
-   expiry_date
-   status
-   certificate_url

User Stories

-   Employee completes training.
-   Manager tracks completion.

Acceptance Criteria

-   Completion tracked.
-   Expired training highlighted.

------------------------------------------------------------------------

## 4.5 Social Dashboard

Pages

-   Executive Dashboard
-   Department Dashboard

Widgets

-   CSR Participation
-   Diversity Charts
-   Training Completion
-   Top Departments
-   Top Employees
-   KPIs
-   Trend Charts

------------------------------------------------------------------------

## 4.6 Social Reports

Pages

-   CSR Report
-   Participation Report
-   Diversity Report
-   Training Report

Features

-   PDF Export
-   Excel Export
-   CSV Export
-   Filters
-   Date Range
-   Department
-   Employee

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

Every module must include

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

Pagination

Filtering

Searching

Soft Delete

------------------------------------------------------------------------

# Integration

React → Axios → FastAPI → SQLAlchemy → Supabase PostgreSQL

Use real APIs only.

------------------------------------------------------------------------

# Testing

Implement

-   Unit Tests
-   Integration Tests
-   CRUD Tests
-   API Tests
-   Validation Tests
-   Permission Tests
-   Component Tests

------------------------------------------------------------------------

# Completion Checklist

-   Database complete
-   Backend complete
-   APIs complete
-   Frontend complete
-   Validation complete
-   Permissions complete
-   Integration complete
-   Testing complete

------------------------------------------------------------------------

# Final Verification (Mandatory)

Before marking this phase complete:

1.  Run frontend build:

``` bash
npm run build
```

2.  Fix every compilation error.

3.  Ensure there are no TypeScript errors.

4.  Verify all routes load correctly.

5.  Verify backend starts without errors.

6.  Verify API endpoints work.

7.  Verify database migrations run successfully.

8.  Produce a final completion report summarizing:

    -   Files created
    -   Files modified
    -   Build status
    -   Remaining issues (if any)

Do not consider the module complete until the build succeeds
successfully.
