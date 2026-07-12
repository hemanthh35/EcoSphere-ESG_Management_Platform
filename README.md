# EcoSphere: ESG Management Platform

Welcome to EcoSphere! This project aims to revolutionize how modern organizations track, manage, and improve their Environmental, Social, and Governance (ESG) performance. 

By integrating ESG metrics directly into day-to-day ERP operations, EcoSphere bridges the gap between raw operational data and meaningful sustainability action. We are moving away from disconnected spreadsheets and manual reports, and stepping into a world where sustainability is measurable, transparent, and engaging for everyone involved.

---

## Challenge Statement

Environmental, Social, and Governance (ESG) is no longer a buzzword; it is a critical aspect of modern business. Organizations are expected to monitor carbon emissions, promote employee well-being, and maintain strict governance compliance. 

However, while many ERP systems already collect the necessary operational data, ESG reporting often remains a highly manual, disconnected, and difficult-to-monitor process. 

EcoSphere solves this by pulling operational data, tracking employee participation, and overseeing compliance activities in one unified, real-time dashboard. Plus, we have incorporated elements of gamification to encourage active participation across the organization.

---

## Core Modules

EcoSphere is built on four fundamental pillars:

1. **Environmental**: Carbon accounting, emission factors management, setting sustainability goals, and generating carbon reports.
2. **Social**: Organizing Corporate Social Responsibility (CSR) activities, tracking employee participation, diversity metrics, and overall engagement.
3. **Governance**: Managing ESG policies, conducting audits, tracking compliance issues, and generating governance reports.
4. **Gamification**: Setting up sustainability challenges, awarding badges and XP, redeeming rewards, and tracking leaderboards to boost employee involvement.

---

## Data Model Overview

The application structure is divided into Master Data and Transactional Data.

### Master Data (The Foundation)
- **Department**: Organizational hierarchy and ESG ownership.
- **Category**: Shared values across Social and Gamification modules (e.g., CSR Activity Category).
- **Emission Factor**: Carbon values used during calculations.
- **Product ESG Profile**: ESG information linked directly to products.
- **Environmental Goal**: Long-term and short-term sustainability targets.
- **ESG Policy**: Governance policies that dictate organizational rules.
- **Badge**: Employee achievements, including the name, unlock rules, and icons.
- **Reward**: Redeemable incentives for earned points.

### Transactional Data (The Action)
- **Carbon Transaction**: Calculated emissions from daily ERP operations.
- **CSR Activity & Employee Participation**: Tracking social initiatives and who is involved, complete with proof and approval tracking.
- **Challenge & Challenge Participation**: Sustainability challenges detailing XP, difficulty levels, and required evidence.
- **Policy Acknowledgement**: Tracking which employees have read and accepted governance policies.
- **Audit & Compliance Issue**: Governance audits and tracking violations, including severity, assigned owner, and due dates.
- **Department Score**: Aggregated ESG performance per department.

---

## Business Workflow

Here is how data flows through EcoSphere:

1. **Master Configuration**: Set up Departments, Categories, Emission Factors, Products, Goals, Policies, and Challenges.
2. **Daily Business Operations**: Regular ERP activities take place, such as Purchasing, Manufacturing, Expenses, and Fleet management.
3. **Data Collection**: 
   - Operations automatically generate Carbon Transactions.
   - Employees engage in CSR activities and Challenges.
   - Governance is tracked via Policy Acknowledgements and Audits.
4. **Scoring**: The system calculates Environmental, Social, and Governance scores per department.
5. **Rollup**: Department scores are aggregated into an Overall ESG Score (Configurable weighting: Default is 40% Environment, 30% Social, 30% Governance).
6. **Dashboards & Reports**: Beautiful, actionable insights are presented at the organization level.

---

## Expected Features

EcoSphere provides a rich set of features tailored to each ESG pillar:

### Environmental
- Configure Emission Factors & Calculate Carbon Emissions
- Department Carbon Tracking & Sustainability Goals
- Interactive Environmental Dashboard

### Social
- CSR Activities Management & Employee Participation Tracking
- Diversity Metrics & Training Completion tracking

### Governance
- ESG Policies & Policy Acknowledgements
- Audits Management & Compliance Issue Tracking

### Gamification
- **Challenges**: Full lifecycle management moving from Draft, to Active, Under Review, and Completed or Archived.
- **XP & Badges**: Auto-awarded based on custom rules.
- **Rewards & Leaderboards**: Redeem points for actual rewards.

### Settings & Administration
- Manage Departments, Categories, and general ESG Configurations.
- Robust Notification Settings.

---

## Reports

The platform generates comprehensive insights, including:
- Environmental, Social, and Governance Reports
- An overarching ESG Summary Report
- A Custom Report Builder allowing users to combine filters (Department, Date Range, Module, Employee, Challenge, ESG Category) and export to PDF, Excel, or CSV formats.

---

## Core Configuration & Business Rules

These features are the engine keeping EcoSphere running smoothly:

- **Reward Redemption**: Employees can spend their hard-earned Points or XP on real rewards, which automatically deducts from their balance subject to stock availability.
- **Notification System**: Automated alerts via in-app notifications or email for compliance issues, CSR approvals, policy reminders, and badge unlocks.
- **Auto Emission Calculation**: A toggleable feature that automatically calculates carbon transactions from linked ERP records using relevant Emission Factors, eliminating the need for manual entry.
- **Evidence Requirement**: A toggleable setting requiring file proofs before a CSR activity can be approved.
- **Badge Auto-Award**: A toggleable setting that automatically assigns badges the moment an employee hits an XP milestone or challenge count.
- **Compliance Issue Ownership**: Every compliance issue gets an Owner and a Due Date. Overdue issues are automatically flagged.

---

## Bonus Ideas & Future Enhancements

As the platform grows, we are looking to explore:
- **Department ESG Rankings**: Friendly competition across the organization.
- **Smart Dashboard Visualizations**: AI-driven insights and predictive analytics.
- **Mobile-Responsive Interface**: Managing ESG on the go.

**Visual Mockup**: [View Excalidraw Mockup](https://link.excalidraw.com/l/65VNwvy7c4X/2m6lz9Ln4)

---

*Let's build a more sustainable future, one transaction at a time!*
