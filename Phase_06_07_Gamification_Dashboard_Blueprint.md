# EcoSphere ESG Management Platform

# Phase 6 & Phase 7 -- Gamification + Executive Dashboard & Analytics

## Enterprise Implementation Blueprint

## Mandatory Architecture Review

Before implementing:

-   Inspect the existing codebase.
-   Review folder structure, shared components, routing, authentication,
    RBAC, database schema, API layer, hooks, services, utilities and
    layouts.
-   Reuse existing code and architecture.
-   Do not duplicate components or APIs.
-   Follow existing enterprise coding standards.

------------------------------------------------------------------------

# Objective

Implement the complete Gamification and Executive Dashboard modules with
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

# Module 6.1 -- Challenges

## Database

Table: challenges

Fields

-   id
-   challenge_code
-   title
-   category_id
-   description
-   xp_points
-   difficulty
-   evidence_required
-   start_date
-   end_date
-   status
-   created_by
-   updated_by
-   created_at
-   updated_at

## Frontend Pages

-   Challenge List
-   Create Challenge
-   Edit Challenge
-   Challenge Details
-   Challenge Timeline

## Components

-   ChallengeTable
-   ChallengeForm
-   ChallengeCard
-   ChallengeDrawer
-   SearchBar
-   FilterBar
-   StatusBadge

## Backend

models.py schemas.py repository.py service.py router.py validators.py
permissions.py exceptions.py dependencies.py

## APIs

GET /challenges POST /challenges PUT /challenges/{id} DELETE
/challenges/{id} GET /challenges/{id}

## User Stories

-   ESG Manager creates sustainability challenges.
-   Employee views active challenges.
-   Manager closes completed challenges.

## Acceptance Criteria

-   Full lifecycle supported.
-   Validation enforced.
-   Soft delete only.

------------------------------------------------------------------------

# Module 6.2 -- Challenge Participation

## Database

challenge_participation

Fields

-   id
-   challenge_id
-   employee_id
-   progress
-   proof_url
-   approval_status
-   xp_awarded
-   completed_at

## Frontend Pages

-   My Challenges
-   Join Challenge
-   Progress Tracker
-   Approval Queue

## Components

ParticipationTable ProgressCard EvidenceUploader ApprovalDialog

## User Stories

-   Employee joins challenge.
-   Employee uploads evidence.
-   Manager approves participation.

## Acceptance Criteria

-   Duplicate participation prevented.
-   Evidence validation.
-   XP awarded after approval.

------------------------------------------------------------------------

# Module 6.3 -- XP Engine

## Database

xp_transactions

Fields

-   id
-   employee_id
-   source_type
-   source_id
-   xp
-   transaction_date

## Backend Responsibilities

-   Calculate XP
-   Award XP
-   Deduct XP
-   Maintain history

## User Stories

-   Employee earns XP.
-   Rewards deduct XP automatically.

------------------------------------------------------------------------

# Module 6.4 -- Badge Management

## Database

badges

employee_badges

Fields

Badge

-   id
-   name
-   unlock_rule
-   icon
-   description

Employee Badge

-   employee_id
-   badge_id
-   awarded_at

## Frontend Pages

-   Badge Gallery
-   Badge Details
-   Employee Badges

## Acceptance Criteria

-   Auto award supported.
-   Duplicate badges prevented.

------------------------------------------------------------------------

# Module 6.5 -- Rewards

## Database

rewards

reward_redemptions

Fields

Reward

-   id
-   name
-   description
-   points_required
-   stock
-   status

Redemption

-   employee_id
-   reward_id
-   redeemed_at

## Frontend Pages

-   Rewards Store
-   Redeem Reward
-   Redemption History

## Acceptance Criteria

-   Stock validation.
-   XP deduction.
-   Redemption history.

------------------------------------------------------------------------

# Module 6.6 -- Leaderboard

## Database

leaderboards

Fields

-   employee_id
-   department_id
-   rank
-   xp
-   period

## Frontend Pages

-   Global Leaderboard
-   Department Leaderboard

## Widgets

-   Top Employees
-   Top Departments

------------------------------------------------------------------------

# Phase 7 -- Executive Dashboard & Analytics

## Pages

-   Executive Dashboard
-   ESG Score Dashboard
-   Department Score Dashboard
-   Organization Dashboard
-   KPI Analytics
-   Trend Analytics

## Dashboard Widgets

-   ESG Score Cards
-   Environmental Score
-   Social Score
-   Governance Score
-   Overall ESG Score
-   Department Rankings
-   Challenge KPIs
-   Participation KPIs
-   Carbon Trends
-   Audit Trends
-   Compliance Trends
-   Leaderboard
-   Goal Progress
-   Charts
-   Activity Feed
-   Quick Actions

## Charts

-   Line Chart
-   Bar Chart
-   Pie Chart
-   Area Chart
-   Department Ranking
-   Monthly Trends

------------------------------------------------------------------------

# Database

Additional Tables

department_scores

organization_scores

dashboard_snapshots

------------------------------------------------------------------------

# Backend Structure

modules/

gamification/ - challenges/ - participation/ - xp/ - badges/ -
rewards/ - leaderboard/

dashboard/ - score_engine/ - analytics/ - executive_dashboard/

Every module includes:

-   models.py
-   schemas.py
-   repository.py
-   service.py
-   router.py
-   validators.py
-   permissions.py
-   exceptions.py
-   dependencies.py

------------------------------------------------------------------------

# APIs

Challenges

GET/POST/PUT/DELETE

Challenge Participation

GET/POST/PUT

XP

GET /xp/history

Badges

GET /badges

Rewards

GET /rewards POST /rewards/redeem

Leaderboard

GET /leaderboard

Dashboard

GET /dashboard/executive GET /dashboard/esg-score GET
/dashboard/department-score GET /dashboard/organization-score GET
/dashboard/kpis GET /dashboard/charts

------------------------------------------------------------------------

# Shared Frontend Components

-   DataTable
-   Cards
-   Charts
-   ProgressBars
-   SearchBar
-   FilterBar
-   Pagination
-   Drawer
-   Dialog
-   Toasts
-   EmptyState
-   LoadingSkeleton

------------------------------------------------------------------------

# Business Rules

-   XP awarded only after approval.
-   Badge auto-awarded when unlock rules are met.
-   Rewards deduct XP.
-   Rewards respect stock.
-   Leaderboards update automatically.
-   Department scores aggregate Environmental, Social and Governance
    scores.
-   Overall ESG score uses configurable weighted average.
-   Dashboard always reflects live database values.

------------------------------------------------------------------------

# Integration

React → Axios → FastAPI → SQLAlchemy → Supabase PostgreSQL

No mock data.

------------------------------------------------------------------------

# Testing

-   Unit Tests
-   Integration Tests
-   CRUD Tests
-   Permission Tests
-   Dashboard Tests
-   Score Engine Tests
-   Chart Tests
-   Component Tests

------------------------------------------------------------------------

# Success Criteria

-   Database complete
-   Backend complete
-   APIs complete
-   Frontend complete
-   Gamification complete
-   Dashboard complete
-   Analytics complete
-   Testing complete

------------------------------------------------------------------------

# Final Verification (Mandatory)

1.  Review existing codebase before coding.
2.  Reuse existing architecture.
3.  Run:

``` bash
npm run build
```

4.  Resolve all TypeScript and build errors.
5.  Verify backend starts successfully.
6.  Verify migrations execute.
7.  Verify all dashboard and gamification routes.
8.  Verify APIs.
9.  Generate GAMIFICATION_DASHBOARD_COMPLETION_REPORT.md including:
    -   Files created
    -   Files modified
    -   Database changes
    -   API endpoints
    -   Build status
    -   Remaining issues

Do not mark the phase complete until the application builds
successfully.
