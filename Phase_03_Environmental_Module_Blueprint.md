# EcoSphere ESG Management Platform

# Phase 3 -- Environmental Module

> This document is the implementation blueprint for the complete
> Environmental Module.

## Objective

Build the complete Environmental module end-to-end using:

-   React 19
-   TypeScript
-   Vite
-   Tailwind CSS
-   shadcn/ui
-   FastAPI
-   SQLAlchemy
-   Supabase PostgreSQL
-   Supabase Auth

The implementation must match the supplied UI wireframe: - Environmental
Dashboard - Emission Factors - Product ESG Profiles - Carbon
Transactions - Environmental Goals

------------------------------------------------------------------------

# Module 3 Scope

1.  Emission Factors
2.  Product ESG Profiles Integration
3.  Carbon Transactions
4.  Environmental Goals
5.  Environmental Dashboard
6.  Environmental Reports

------------------------------------------------------------------------

# User Stories

## ESG Manager

-   Configure emission factors.
-   Manage sustainability goals.
-   Review environmental KPIs.

## Environmental Analyst

-   Record carbon transactions.
-   Search and filter emissions.
-   Generate reports.

## Department Head

-   View department emissions.
-   Track department goals.

## Executive

-   View dashboards.
-   Download reports.

------------------------------------------------------------------------

# Success Criteria

-   Complete PostgreSQL schema
-   Complete FastAPI backend
-   Complete React frontend
-   Real API integration
-   Responsive UI
-   Validation
-   Role-based authorization
-   Dashboard with KPIs
-   Reports (PDF/Excel/CSV)
-   Production-ready architecture

------------------------------------------------------------------------

# Database

## Tables

-   emission_factors
-   carbon_transactions
-   environmental_goals

References:

-   departments
-   product_esg_profiles
-   profiles

## emission_factors

Fields:

-   id
-   factor_code
-   factor_name
-   source
-   category
-   unit
-   co2e_factor
-   effective_from
-   effective_to
-   status
-   created_at
-   updated_at
-   created_by
-   updated_by

## carbon_transactions

Fields:

-   id
-   transaction_number
-   department_id
-   product_esg_profile_id
-   emission_factor_id
-   quantity
-   unit
-   calculated_emission
-   transaction_date
-   notes
-   status
-   created_at
-   updated_at

## environmental_goals

Fields:

-   id
-   goal_name
-   department_id
-   target_co2
-   current_co2
-   progress_percentage
-   deadline
-   status
-   created_at
-   updated_at

------------------------------------------------------------------------

# Backend

Folder

    modules/environmental/

    ├── emission_factors/
    ├── carbon_transactions/
    ├── environmental_goals/
    ├── dashboard/
    └── reports/

Every module contains:

-   models.py
-   schemas.py
-   repository.py
-   service.py
-   router.py
-   validators.py
-   exceptions.py
-   permissions.py
-   dependencies.py

------------------------------------------------------------------------

# APIs

Emission Factors

-   GET /emission-factors
-   POST /emission-factors
-   PUT /emission-factors/{id}
-   DELETE /emission-factors/{id}

Carbon Transactions

-   GET /carbon-transactions
-   POST /carbon-transactions
-   PUT /carbon-transactions/{id}
-   DELETE /carbon-transactions/{id}

Environmental Goals

-   GET /environmental-goals
-   POST /environmental-goals
-   PUT /environmental-goals/{id}
-   DELETE /environmental-goals/{id}

Dashboard

-   GET /environmental/dashboard

Reports

-   GET /reports/environmental
-   GET /reports/environmental/export/pdf
-   GET /reports/environmental/export/excel
-   GET /reports/environmental/export/csv

------------------------------------------------------------------------

# Frontend

Folder

    modules/environmental/

    ├── pages/
    ├── components/
    ├── hooks/
    ├── services/
    ├── validation/
    ├── types/

Pages

-   Environmental Dashboard
-   Emission Factors
-   Carbon Transactions
-   Environmental Goals
-   Environmental Reports

Components

-   KPI Cards
-   Charts
-   Data Table
-   Search
-   Filter
-   Pagination
-   Goal Progress Cards
-   Goal Form
-   Carbon Transaction Form
-   Emission Factor Form
-   Report Filters
-   Export Buttons

------------------------------------------------------------------------

# UI Requirements

Match the supplied wireframe:

-   Dashboard cards
-   Line chart
-   Department ranking chart
-   Goal progress bars
-   Data tables
-   Search bars
-   Status badges
-   Responsive layout
-   Professional ERP styling
-   shadcn/ui components
-   Tailwind CSS
-   Light theme

------------------------------------------------------------------------

# Validation

-   Quantity \> 0
-   CO2 Factor \> 0
-   Target CO2 \> 0
-   Deadline required
-   Department required
-   Product required
-   Emission factor required

------------------------------------------------------------------------

# Business Rules

-   Carbon = Quantity × Emission Factor
-   Product must exist
-   Department must exist
-   Inactive factors cannot be selected
-   Goal progress updates automatically
-   Dashboard refreshes from live database

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
-   Integration Tests
-   Dashboard Tests
-   Report Export Tests

------------------------------------------------------------------------

# Deliverables

-   Database Schema
-   SQLAlchemy Models
-   Pydantic Schemas
-   Repository Layer
-   Service Layer
-   Routers
-   REST APIs
-   React Pages
-   Components
-   Hooks
-   Services
-   Validation
-   Dashboard
-   Reports
-   End-to-End Integration
