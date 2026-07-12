# EcoSphere - Detailed Implementation Plan

## Phase 0: Project Setup & Architecture (COMPLETED)
- [x] Initial FastAPI Backend Setup with SQLAlchemy and Alembic
- [x] React + Vite + Tailwind CSS Frontend Setup
- [x] Base layout and routing structure
- [x] Scaffolding for feature-sliced architecture (Modules: Auth, Department, Category, etc.)

## Phase 1: Authentication & Authorization (COMPLETED)
- [x] Supabase integration for JWT validation
- [x] `Profile` database model to extend Supabase user
- [x] Backend Login, Logout, Profile, and Refresh endpoints
- [x] Role-Based Access Control (`RoleGuard`)
- [x] Frontend `AuthContext`, Interceptors, Login Page, and Protected Routes

## Phase 2: Master Data Management (IN PROGRESS)
**Current Status**: `Department` is mostly implemented (Backend APIs and Frontend UI are present).
**Remaining Work in Phase 2**:
- [ ] **Department (Fixes/Development)**: Verify API integration in frontend. Ensure hierarchy (parent_department_id) is fully functional in the UI.
- [ ] **Category Module**: Shared categories for CSR and Challenges. (Fields: Name, Type, Status). Backend CRUD + Frontend UI.
- [ ] **Emission Factor Module**: Carbon values for calculations. Backend CRUD + Frontend UI.
- [ ] **Product ESG Profile**: ESG info linked to products. Backend CRUD + Frontend UI.
- [ ] **Environmental Goal**: Sustainability targets. Backend CRUD + Frontend UI.
- [ ] **ESG Policy**: Governance policies. Backend CRUD + Frontend UI.
- [ ] **Badge & Reward**: Badges (Name, Description, Unlock Rule, Icon) and Rewards (Points Required, Stock, Status). Backend CRUD + Frontend UI.

## Phase 3: Transactional Data - Environmental
- [ ] **Carbon Transactions**: Store calculated emissions from ERP operations.
- [ ] **Auto Emission Calculation**: Business rule to calculate emissions automatically using Emission Factors (toggleable via settings).

## Phase 4: Transactional Data - Social & Governance
- [ ] **CSR Activities**: Social initiatives organized by the company.
- [ ] **Employee Participation**: Track involvement in CSR activities (requires Proof and Approval status).
- [ ] **Evidence Requirement Engine**: Business rule to mandate proof files for CSR approval.
- [ ] **Audits & Compliance Issues**: Track governance violations with assigned Owners and Due Dates.
- [ ] **Policy Acknowledgements**: Track employee acceptance of ESG policies.

## Phase 5: Gamification Engine
- [ ] **Challenges**: Full lifecycle (Draft -> Active -> Under Review -> Completed/Archived).
- [ ] **Challenge Participation**: Track employee progress within challenges.
- [ ] **XP & Badge Auto-Award Engine**: Automatically assign badges when thresholds are met.
- [ ] **Reward Redemption**: Deduct points/XP when employees redeem rewards from the catalog.
- [ ] **Leaderboards**: Aggregate points for gamification dashboard.

## Phase 6: Dashboards & Reporting
- [ ] **Department Scoring Engine**: Aggregate ESG performance per department (Env Score, Social Score, Gov Score -> Total Score).
- [ ] **Overall ESG Score**: Weighted average of department scores.
- [ ] **Environmental, Social, Governance Reports**.
- [ ] **Custom Report Builder**: Export to PDF/Excel/CSV with filters (Date Range, Module, Employee, Challenge, ESG Category).

## Phase 7: Settings, Administration & Notifications
- [ ] **Global ESG Configuration**: Toggle business rules (Auto Emissions, Evidence Requirements, Badge Auto-Award).
- [ ] **Notification System**: In-app and email notifications for compliance issues, approvals, reminders, and badge unlocks.