# EcoSphere ESG Management Platform

# Phase 8 & Phase 9 -- Reports + Settings & Notifications

## Enterprise Implementation Blueprint

## Mandatory Architecture Review

Before implementing:

-   Inspect the existing repository and architecture.
-   Review frontend modules, backend modules, shared components,
    authentication, RBAC, routing, services, hooks, database schema and
    utilities.
-   Reuse existing code wherever possible.
-   Do not duplicate components or business logic.
-   Follow existing enterprise architecture.

------------------------------------------------------------------------

# Objective

Implement the complete Reporting and Settings modules with
production-ready architecture.

Stack

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

# Phase 8 -- Reports

## Modules

### 8.1 Environmental Report

Pages

-   Environmental Report Dashboard
-   Report Filters
-   Report Preview
-   Export History

Database

environmental_reports

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

User Stories

-   ESG Manager generates environmental reports.
-   Executive downloads environmental reports.
-   Analyst filters reports by department and date.

Acceptance Criteria

-   Filters work.
-   Export works.
-   Reports match database values.

------------------------------------------------------------------------

### 8.2 Social Report

Pages

-   Social Report
-   Participation Analytics
-   CSR Analytics

Database

social_reports

User Stories

-   HR reviews CSR participation.
-   Executive views social KPIs.

------------------------------------------------------------------------

### 8.3 Governance Report

Pages

-   Governance Report
-   Compliance Analytics
-   Audit Analytics

Database

governance_reports

User Stories

-   Auditor reviews compliance.
-   ESG Manager downloads governance reports.

------------------------------------------------------------------------

### 8.4 ESG Summary Report

Pages

-   ESG Summary
-   ESG Comparison
-   ESG Trends

Database

esg_summary_reports

User Stories

-   Executive views consolidated ESG performance.

------------------------------------------------------------------------

### 8.5 Custom Report Builder

Pages

-   Report Builder
-   Saved Reports
-   Report Templates

Components

-   Drag-and-drop filter builder
-   Date range picker
-   Department selector
-   Module selector
-   Preview table

User Stories

-   User creates reusable report templates.
-   User exports custom reports.

Acceptance Criteria

-   Supports Department, Date Range, Module, Employee, Challenge and ESG
    Category filters.
-   Saves reusable templates.

------------------------------------------------------------------------

### Export Module

Support

-   PDF
-   Excel
-   CSV

Pages

-   Export Center
-   Export History

Acceptance Criteria

-   Correct file generated.
-   Audit trail stored.

------------------------------------------------------------------------

# Phase 9 -- Settings & Notifications

## 9.1 ESG Configuration

Pages

-   ESG Configuration
-   Weight Settings
-   Carbon Settings

Database

esg_configuration

Fields

-   environmental_weight
-   social_weight
-   governance_weight
-   auto_carbon_calculation
-   evidence_required
-   auto_badge_award

User Stories

-   Admin configures organization ESG rules.

------------------------------------------------------------------------

## 9.2 Notification Settings

Pages

-   Notification Settings
-   Templates
-   Delivery Preferences

Database

notification_settings

------------------------------------------------------------------------

## 9.3 Email Notifications

Pages

-   Email Templates
-   Email Logs

Database

email_logs

User Stories

-   Admin customizes email templates.
-   Users receive notification emails.

------------------------------------------------------------------------

## 9.4 Badge Notifications

Pages

-   Badge Notifications
-   Notification History

Database

badge_notifications

------------------------------------------------------------------------

## 9.5 Compliance Alerts

Pages

-   Compliance Alerts
-   Alert History

Database

compliance_alerts

------------------------------------------------------------------------

## 9.6 Auto Carbon Calculation

Pages

-   Carbon Automation

Backend

Automatic creation of Carbon Transactions using configured Emission
Factors.

Acceptance Criteria

-   Toggle enables/disables automation.

------------------------------------------------------------------------

## 9.7 Auto Badge Award

Pages

-   Badge Automation

Backend

Automatically awards badges when unlock rules are satisfied.

------------------------------------------------------------------------

## 9.8 Evidence Requirement

Pages

-   Evidence Configuration

Backend

Require proof before CSR or Challenge approval.

------------------------------------------------------------------------

## 9.9 Reward Configuration

Pages

-   Reward Configuration
-   Reward Inventory

Database

reward_configuration

------------------------------------------------------------------------

# Shared Frontend Components

-   DataTable
-   SearchBar
-   FilterBar
-   Pagination
-   ReportViewer
-   Chart Components
-   ExportDialog
-   ConfirmDialog
-   SettingsForm
-   LoadingSkeleton
-   EmptyState
-   Toast Notifications

------------------------------------------------------------------------

# Backend Standards

Every module includes

-   models.py
-   schemas.py
-   repository.py
-   service.py
-   router.py
-   validators.py
-   permissions.py
-   exceptions.py
-   dependencies.py

Implement

-   Repository Pattern
-   Service Layer
-   Dependency Injection
-   RBAC
-   Validation
-   Logging
-   Pagination
-   Filtering
-   Search
-   Soft Delete where applicable

------------------------------------------------------------------------

# APIs

Reports

-   GET /reports/environmental
-   GET /reports/social
-   GET /reports/governance
-   GET /reports/esg-summary
-   POST /reports/custom
-   GET /reports/export/pdf
-   GET /reports/export/excel
-   GET /reports/export/csv

Settings

-   GET /settings
-   PUT /settings
-   GET /notifications/settings
-   PUT /notifications/settings
-   GET /email/templates
-   PUT /email/templates

------------------------------------------------------------------------

# Integration

React → Axios → FastAPI → SQLAlchemy → Supabase PostgreSQL

No mock data.

------------------------------------------------------------------------

# Testing

-   Unit Tests
-   API Tests
-   CRUD Tests
-   Validation Tests
-   Report Generation Tests
-   Export Tests
-   Notification Tests
-   Settings Tests
-   Integration Tests

------------------------------------------------------------------------

# Success Criteria

-   Database complete
-   Backend complete
-   APIs complete
-   Frontend complete
-   Reports complete
-   Settings complete
-   Notifications complete
-   Export complete
-   Testing complete

------------------------------------------------------------------------

# Final Verification (Mandatory)

1.  Review existing codebase before implementation.
2.  Reuse existing architecture and shared components.
3.  Run:

``` bash
npm run build
```

4.  Resolve all TypeScript and build errors.
5.  Verify backend starts successfully.
6.  Verify database migrations run successfully.
7.  Verify every route loads.
8.  Verify report generation and exports.
9.  Verify notification workflows.
10. Generate REPORTS_SETTINGS_COMPLETION_REPORT.md containing:

-   Files created
-   Files modified
-   Database changes
-   API endpoints
-   Build status
-   Remaining issues

Do not mark this phase complete until the application builds
successfully.
