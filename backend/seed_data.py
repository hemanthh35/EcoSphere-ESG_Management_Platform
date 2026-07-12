import sys
import os
import uuid
import random
from datetime import datetime, date, timedelta, timezone

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))

from app.database.session import SessionLocal

# Import models
from app.modules.auth.models import Profile, RoleEnum, StatusEnum, GenderEnum
from app.modules.department.models import Department
from app.modules.category.models import Category
from app.modules.product_esg.models import ProductESGProfile, SustainabilityRating, ProductStatus
from app.modules.environmental.models import CarbonTransaction, EnvironmentalGoal, EmissionFactor, FactorStatusEnum, TransactionStatusEnum, GoalStatusEnum
from app.modules.social.models import CsrActivity, DiversityMetric, TrainingRecord, EmployeeParticipation
from app.modules.governance.models import ESGPolicy, Audit, ComplianceIssue, PolicyAcknowledgement, PolicyStatusEnum, AcknowledgementStatusEnum, AuditStatusEnum, IssueSeverityEnum, IssueStatusEnum
from app.modules.settings.models import ESGConfiguration, NotificationSetting
from app.modules.gamification.models import Challenge, ChallengeParticipation, XpTransaction, ChallengeDifficultyEnum, ChallengeStatusEnum, ParticipationStatusEnum
from app.modules.reports.models import ReportTemplate, ExportAuditLog
from sqlalchemy import select, func

# Standard timezone (UTC)
UTC = timezone.utc

def seed_db():
    print("Initializing Database Seeding with clean, reduced dataset...")
    db = SessionLocal()
    
    try:
        # --- 1. CLEAN EXISTING DATA IN REVERSE DEPENDENCY ORDER ---
        print("Cleaning old records...")
        
        # Self referencing updates first
        db.query(Profile).update({Profile.manager_id: None})
        db.query(Department).update({Department.parent_department_id: None})
        db.commit()
        
        # Delete tables
        db.query(PolicyAcknowledgement).delete()
        db.query(ComplianceIssue).delete()
        db.query(Audit).delete()
        db.query(ESGPolicy).delete()
        db.query(EmployeeParticipation).delete()
        db.query(TrainingRecord).delete()
        db.query(DiversityMetric).delete()
        db.query(CsrActivity).delete()
        db.query(CarbonTransaction).delete()
        db.query(EnvironmentalGoal).delete()
        db.query(EmissionFactor).delete()
        
        # ProductESGProfile references Category and Profile, delete it before them
        db.query(ProductESGProfile).delete()
        
        db.query(ChallengeParticipation).delete()
        db.query(XpTransaction).delete()
        db.query(Challenge).delete()
        db.query(NotificationSetting).delete()
        db.query(ReportTemplate).delete()
        db.query(ExportAuditLog).delete()
        
        # Category references Profile, delete it before Profile
        db.query(Category).delete()
        
        # Profile references Department, delete it before Department
        db.query(Profile).delete()
        db.query(Department).delete()
        
        db.query(ESGConfiguration).delete()
        
        db.commit()
        print("Database cleaned successfully.")

        # --- 2. SEED ESG CONFIGURATION ---
        print("Seeding ESG Configuration...")
        config = ESGConfiguration(
            id=uuid.uuid4(),
            environmental_weight=0.40,
            social_weight=0.30,
            governance_weight=0.30,
            auto_carbon_calculation=True,
            evidence_required=True,
            auto_badge_award=True
        )
        db.add(config)
        db.flush()

        # --- 3. SEED DEPARTMENTS ---
        print("Seeding 3 core Departments...")
        dept_data = [
            {"name": "Operations", "code": "OPS", "desc": "Enterprise operational management and logistics"},
            {"name": "Manufacturing", "code": "MFG", "desc": "Production, assembly lines and plant engineering", "parent": "Operations"},
            {"name": "Environment Health and Safety", "code": "EHS", "desc": "ESG reporting, pollution control and workspace safety standards", "parent": "Operations"}
        ]

        depts = {}
        # Parent
        ops_id = uuid.uuid4()
        ops_dept = Department(
            id=ops_id,
            name="Operations",
            code="OPS",
            description="Enterprise operational management and logistics",
            status="ACTIVE",
            employee_count=0,
            created_by=uuid.UUID("00000000-0000-0000-0000-000000000000"),
            updated_by=uuid.UUID("00000000-0000-0000-0000-000000000000")
        )
        db.add(ops_dept)
        depts["Operations"] = ops_id
        db.flush()

        # Children
        for d in dept_data[1:]:
            dept_id = uuid.uuid4()
            dept = Department(
                id=dept_id,
                name=d["name"],
                code=d["code"],
                description=d["desc"],
                parent_department_id=ops_id,
                status="ACTIVE",
                employee_count=0,
                created_by=uuid.UUID("00000000-0000-0000-0000-000000000000"),
                updated_by=uuid.UUID("00000000-0000-0000-0000-000000000000")
            )
            db.add(dept)
            depts[d["name"]] = dept_id
        db.flush()

        # --- 4. SEED PROFILES (10 EMPLOYEES) ---
        print("Seeding 10 Employees...")
        
        leaders_config = [
            {"email": "rahul.sharma@greentech.com", "first": "Rahul", "last": "Sharma", "role": RoleEnum.ADMIN, "designation": "Chief Sustainability Officer", "dept": "Environment Health and Safety"},
            {"email": "priya.reddy@greentech.com", "first": "Priya", "last": "Reddy", "role": RoleEnum.ESG_MANAGER, "designation": "ESG Compliance Director", "dept": "Environment Health and Safety"},
            {"email": "arjun.kumar@greentech.com", "first": "Arjun", "last": "Kumar", "role": RoleEnum.DEPARTMENT_HEAD, "designation": "Manufacturing Director", "dept": "Manufacturing"},
            {"email": "amit.joshi@greentech.com", "first": "Amit", "last": "Joshi", "role": RoleEnum.AUDITOR, "designation": "EHS Lead Auditor", "dept": "Environment Health and Safety"}
        ]

        profiles = []
        leaders = {}

        for idx, l in enumerate(leaders_config):
            p_id = uuid.uuid4()
            code = f"GT-EMP-{100 + idx}"
            full_name = f"{l['first']} {l['last']}"
            dept_id = depts.get(l["dept"])
            
            p = Profile(
                id=p_id,
                employee_code=code,
                first_name=l["first"],
                last_name=l["last"],
                full_name=full_name,
                email=l["email"],
                phone=f"+91 9845{random.randint(100000, 999999)}",
                profile_image=None,
                department_id=dept_id,
                designation=l["designation"],
                role=l["role"],
                gender=GenderEnum.MALE if l["first"] not in ["Priya"] else GenderEnum.FEMALE,
                joining_date=date(2023, 1, 15),
                date_of_birth=date(1985, 5, 20),
                address=f"Flat {random.randint(10, 500)}, Sector 4, HSR Layout, Bangalore, India",
                status=StatusEnum.ACTIVE,
                is_deleted=False
            )
            db.add(p)
            profiles.append(p)
            leaders[l["role"]] = p_id
            if l["role"] == RoleEnum.DEPARTMENT_HEAD:
                leaders[l["dept"]] = p_id
        db.flush()

        # Update department heads
        for d_name, d_id in depts.items():
            dept_obj = db.get(Department, d_id)
            if d_name in leaders:
                dept_obj.department_head_id = leaders[d_name]
            else:
                dept_obj.department_head_id = leaders.get(RoleEnum.ESG_MANAGER)
            dept_obj.created_by = leaders[RoleEnum.ADMIN]
            dept_obj.updated_by = leaders[RoleEnum.ADMIN]
        db.flush()

        # Seed 6 more employees
        emp_names = [
            ("Sneha", "Verma"), ("Vikram", "Singh"), ("Neha", "Patel"),
            ("Kiran", "Mehta"), ("Pooja", "Nair"), ("Harish", "Kumar")
        ]
        
        departments_list = list(depts.values())
        admin_id = leaders[RoleEnum.ADMIN]

        for idx, (first, last) in enumerate(emp_names):
            p_id = uuid.uuid4()
            code = f"GT-EMP-{104 + idx}"
            full_name = f"{first} {last}"
            dept_id = random.choice(departments_list)
            
            p = Profile(
                id=p_id,
                employee_code=code,
                first_name=first,
                last_name=last,
                full_name=full_name,
                email=f"{first.lower()}.{last.lower()}@greentech.com",
                phone=f"+91 9{random.randint(700000000, 999999999)}",
                profile_image=None,
                department_id=dept_id,
                designation="ESG Specialist" if idx % 2 == 0 else "Operations Lead",
                manager_id=leaders[RoleEnum.ADMIN],
                role=RoleEnum.EMPLOYEE,
                gender=GenderEnum.FEMALE if first in ["Sneha", "Neha", "Pooja"] else GenderEnum.MALE,
                joining_date=date(2024, 2, 1),
                date_of_birth=date(1992, 8, 12),
                address="Whitefield, Bangalore, India",
                status=StatusEnum.ACTIVE,
                is_deleted=False,
                created_by=admin_id,
                updated_by=admin_id
            )
            db.add(p)
            profiles.append(p)
        db.flush()

        # Update employee count in Department table
        for d_id in departments_list:
            emp_cnt = db.scalar(select(func.count(Profile.id)).where(Profile.department_id == d_id))
            dept_obj = db.get(Department, d_id)
            dept_obj.employee_count = emp_cnt
        db.flush()

        # Create notifications settings
        for p in profiles:
            ns = NotificationSetting(
                id=uuid.uuid4(),
                profile_id=p.id,
                email_alerts=True,
                compliance_alerts=True,
                challenge_updates=True,
                badge_milestones=True
            )
            db.add(ns)
        db.flush()

        # --- 5. SEED CATEGORIES ---
        print("Seeding Categories...")
        csr_cats = ["Environment", "Health", "Education"]
        chg_cats = ["Energy Saving", "Water Conservation", "Plastic Free Office"]

        categories = {}
        for idx, c in enumerate(csr_cats):
            cat_id = uuid.uuid4()
            cat = Category(
                id=cat_id,
                category_code=f"CSR-{idx+1:02d}",
                category_name=c,
                category_type="CSR_ACTIVITY",
                description=f"Corporate social initiatives related to {c.lower()}",
                color="#10a368",
                icon="leaf" if "Env" in c else "users",
                status="ACTIVE",
                created_by=admin_id,
                updated_by=admin_id
            )
            db.add(cat)
            categories[c] = cat_id

        for idx, c in enumerate(chg_cats):
            cat_id = uuid.uuid4()
            cat = Category(
                id=cat_id,
                category_code=f"CHG-{idx+1:02d}",
                category_name=c,
                category_type="CHALLENGE",
                description=f"Eco sustainability challenge focused on {c.lower()}",
                color="#6366f1",
                icon="activity",
                status="ACTIVE",
                created_by=admin_id,
                updated_by=admin_id
            )
            db.add(cat)
            categories[c] = cat_id
        db.flush()

        # --- 6. SEED PRODUCT ESG PROFILES ---
        print("Seeding Product ESG Profiles...")
        product_list = [
            {"name": "GreenTech Industrial Motor 450", "code": "PRD-MOT-450", "rating": SustainabilityRating.PLATINUM, "factor": 1.25, "score": 92.5},
            {"name": "EcoCharge Electric Generator", "code": "PRD-GEN-ECO", "rating": SustainabilityRating.GOLD, "factor": 2.45, "score": 85.0},
            {"name": "SolarCell Photovoltaic Panel 400W", "code": "PRD-SOL-400", "rating": SustainabilityRating.PLATINUM, "factor": 0.35, "score": 95.0}
        ]

        products = []
        for idx, prd in enumerate(product_list):
            prd_id = uuid.uuid4()
            pep = ProductESGProfile(
                id=prd_id,
                product_code=prd["code"],
                product_name=prd["name"],
                department_id=depts["Manufacturing"] if idx % 2 == 0 else depts["Environment Health and Safety"],
                category_id=categories["Energy Saving"] if idx % 2 == 0 else categories["Plastic Free Office"],
                description=f"EcoSphere registered ESG blueprint details for {prd['name']}.",
                carbon_factor=prd["factor"],
                carbon_unit="kgCO2e/unit",
                sustainability_rating=prd["rating"],
                esg_score=prd["score"],
                recyclable=True,
                recycled_content_percentage=45.0,
                renewable_material=True,
                hazardous_material=False,
                certification="ISO 14001 Certified",
                supplier_name="TATA Steel Corporate Ltd",
                status=ProductStatus.ACTIVE,
                is_deleted=False,
                created_by=admin_id,
                updated_by=admin_id
            )
            db.add(pep)
            products.append(prd_id)
        db.flush()

        # --- 7. SEED EMISSION FACTORS ---
        print("Seeding Emission Factors...")
        ef_list = [
            {"code": "EF-DSL", "name": "Diesel Fuel Consumption", "source": "IPCC 2023 Guidelines", "category": "Fuel", "unit": "liters", "factor": 2.68},
            {"code": "EF-ELC", "name": "Electricity Consumption (Grid)", "source": "Central Electricity Authority India 2023", "category": "Energy", "unit": "kWh", "factor": 0.82},
            {"code": "EF-WTR", "name": "Water Distribution Consumption", "source": "Indian Central Water Commission", "category": "Resource", "unit": "kL", "factor": 0.34}
        ]

        factors = []
        for ef in ef_list:
            ef_id = uuid.uuid4()
            factor_obj = EmissionFactor(
                id=ef_id,
                factor_code=ef["code"],
                factor_name=ef["name"],
                source=ef["source"],
                category=ef["category"],
                unit=ef["unit"],
                co2e_factor=ef["factor"],
                effective_from=date(2025, 1, 1),
                status=FactorStatusEnum.ACTIVE,
                created_by=admin_id,
                updated_by=admin_id
            )
            db.add(factor_obj)
            factors.append((ef_id, ef["factor"], ef["unit"]))
        db.flush()

        # --- 8. SEED CARBON TRANSACTIONS ---
        print("Seeding 15 Carbon Transactions...")
        profile_ids = [p.id for p in profiles]
        today = date.today()
        
        for idx in range(15):
            tx_num = f"GT-TX-{2026}-{idx+1000:04d}"
            p_id = random.choice(profile_ids)
            emp_obj = db.get(Profile, p_id)
            d_id = emp_obj.department_id
            
            ef_id, ef_val, ef_unit = random.choice(factors)
            qty = round(random.uniform(50.0, 500.0), 2)
            calculated = round(qty * ef_val, 2)
            
            # spread dates
            days_ago = random.randint(0, 180)
            tx_date = today - timedelta(days=days_ago)
            
            tx = CarbonTransaction(
                id=uuid.uuid4(),
                transaction_number=tx_num,
                department_id=d_id,
                product_esg_profile_id=random.choice(products) if idx % 3 == 0 else None,
                emission_factor_id=ef_id,
                quantity=qty,
                unit=ef_unit,
                calculated_emission=calculated,
                transaction_date=tx_date,
                notes=f"Calculated carbon output transaction ref #{random.randint(100, 999)}.",
                status=TransactionStatusEnum.VERIFIED
            )
            db.add(tx)
        db.flush()

        # --- 9. SEED ENVIRONMENTAL GOALS ---
        print("Seeding 3 Environmental Goals...")
        goals_data = [
            {"title": "Reduce Electricity Carbon Emissions by 20%", "target": 50000.0, "current": 38000.0},
            {"title": "Minimize Industrial Water Usage in Plant C", "target": 8000.0, "current": 6400.0},
            {"title": "Reduce Diesel Logistics Emission", "target": 15000.0, "current": 9500.0}
        ]

        for idx, g in enumerate(goals_data):
            goal = EnvironmentalGoal(
                id=uuid.uuid4(),
                goal_name=g["title"],
                department_id=random.choice(departments_list),
                target_co2=g["target"],
                current_co2=g["current"],
                progress_percentage=round((g["current"] / g["target"]) * 100, 2),
                deadline=today + timedelta(days=random.randint(30, 200)),
                status=GoalStatusEnum.ON_TRACK if idx % 2 == 0 else GoalStatusEnum.ACTIVE
            )
            db.add(goal)
        db.flush()

        # --- 10. SEED CSR ACTIVITIES ---
        print("Seeding 3 CSR Activities...")
        csr_list = [
            {"title": "Tree Plantation Drive (Bangalore E-City)", "cat": "Environment"},
            {"title": "Corporate General Health Camp", "cat": "Health"},
            {"title": "Primary School Supplies Donation Program", "cat": "Education"}
        ]

        csr_activities = []
        for idx, c in enumerate(csr_list):
            csr_id = uuid.uuid4()
            act = CsrActivity(
                id=csr_id,
                activity_code=f"GT-CSR-ACT-{idx+1:03d}",
                title=c["title"],
                category_id=categories[c["cat"]],
                department_id=random.choice(departments_list),
                description=f"Corporate Social Responsibility volunteer drive for {c['title']}.",
                start_date=datetime.now(UTC) - timedelta(days=random.randint(10, 30)),
                end_date=datetime.now(UTC) - timedelta(days=random.randint(1, 9)),
                location="Whitefield, Bangalore, India",
                max_participants=20,
                status="COMPLETED",
                created_by=admin_id,
                updated_by=admin_id
            )
            db.add(act)
            csr_activities.append(csr_id)
        db.flush()

        # --- 11. SEED EMPLOYEE PARTICIPATIONS (CSR) ---
        print("Seeding Employee CSR Participations...")
        participations_set = set()
        for idx in range(12):
            emp_id = random.choice(profile_ids)
            act_id = random.choice(csr_activities)
            if (emp_id, act_id) in participations_set:
                continue
            participations_set.add((emp_id, act_id))
            
            part = EmployeeParticipation(
                id=uuid.uuid4(),
                employee_id=emp_id,
                activity_id=act_id,
                proof_url=f"https://evidence-url/csr_{idx}.jpg",
                approval_status="APPROVED",
                points_earned=150,
                completion_date=datetime.now(UTC) - timedelta(days=5)
            )
            db.add(part)
        db.flush()

        # Seed Diversity Metrics
        for dept_id in departments_list:
            dm = DiversityMetric(
                id=uuid.uuid4(),
                department_id=dept_id,
                metric_name="Gender Diversity Ratio",
                metric_value=45.0,
                reporting_period="Q1-2026"
            )
            db.add(dm)
        db.flush()

        # --- 12. SEED TRAINING RECORDS ---
        print("Seeding 12 Training Records...")
        trainings = ["EHS Awareness & Safety Standards", "Corporate Cyber Security", "Code of Conduct Compliance"]
        for idx in range(12):
            emp_id = random.choice(profile_ids)
            tr = TrainingRecord(
                id=uuid.uuid4(),
                employee_id=emp_id,
                training_name=random.choice(trainings),
                completion_date=datetime.now(UTC) - timedelta(days=random.randint(5, 50)),
                status="COMPLETED",
                certificate_url=f"https://certificate-url/{uuid.uuid4()}.pdf"
            )
            db.add(tr)
        db.flush()

        # --- 13. SEED POLICIES & ACKNOWLEDGEMENTS ---
        print("Seeding Governance Policies & 15 Acknowledgements...")
        policy_list = [
            {"title": "Enterprise Information Security Policy", "code": "POL-SEC-01"},
            {"title": "POSH Workplace Safety Policy", "code": "POL-HR-02"},
            {"title": "Enterprise Environmental Protection Policy", "code": "POL-EHS-03"}
        ]

        policies = []
        for p in policy_list:
            pol_id = uuid.uuid4()
            pol = ESGPolicy(
                id=pol_id,
                policy_code=p["code"],
                title=p["title"],
                version="1.0",
                department_id=random.choice(departments_list),
                description=f"GreenTech organizational policy document regarding compliance standards for {p['title']}.",
                effective_date=date(2025, 6, 1),
                status=PolicyStatusEnum.ACTIVE,
                created_by=admin_id,
                updated_by=admin_id
            )
            db.add(pol)
            policies.append(pol_id)
        db.flush()

        # Generate 15 Policy Acknowledgements
        acks_set = set()
        for idx in range(15):
            emp_id = random.choice(profile_ids)
            pol_id = random.choice(policies)
            if (emp_id, pol_id) in acks_set:
                continue
            acks_set.add((emp_id, pol_id))
            
            pa = PolicyAcknowledgement(
                id=uuid.uuid4(),
                policy_id=pol_id,
                employee_id=emp_id,
                acknowledged_at=datetime.now(UTC) - timedelta(days=random.randint(1, 10)),
                status=AcknowledgementStatusEnum.ACKNOWLEDGED,
                remarks="Signed digitally via portal verify."
            )
            db.add(pa)
        db.flush()

        # --- 14. SEED AUDITS & COMPLIANCE ISSUES ---
        print("Seeding Audits & Compliance Issues...")
        aud1_id = uuid.uuid4()
        aud1 = Audit(
            id=aud1_id,
            audit_code="AUD-Q1-SAF",
            title="Q1 Internal Safety Audit",
            department_id=depts["Environment Health and Safety"],
            auditor_id=leaders[RoleEnum.AUDITOR],
            start_date=date(2026, 2, 1),
            end_date=date(2026, 2, 10),
            findings="Fire safety criteria fully compliant.",
            status=AuditStatusEnum.COMPLETED
        )
        db.add(aud1)

        aud2_id = uuid.uuid4()
        aud2 = Audit(
            id=aud2_id,
            audit_code="AUD-ANN-ENV",
            title="Annual Environmental Compliance Audit",
            department_id=depts["Manufacturing"],
            auditor_id=leaders[RoleEnum.AUDITOR],
            start_date=date(2026, 4, 15),
            status=AuditStatusEnum.IN_PROGRESS
        )
        db.add(aud2)
        db.flush()

        issues_list = [
            {"title": "Expired Fire Extinguisher in Block A", "severity": IssueSeverityEnum.HIGH},
            {"title": "Improper Hazardous Material Storage", "severity": IssueSeverityEnum.CRITICAL},
            {"title": "Missing Personal Protective Equipment (PPE) Compliance", "severity": IssueSeverityEnum.HIGH}
        ]

        for idx, iss in enumerate(issues_list):
            issue = ComplianceIssue(
                id=uuid.uuid4(),
                title=iss["title"],
                description=f"Non-compliance reported during audit inspections. Requires immediate owner action.",
                audit_id=aud1_id if idx % 2 == 0 else aud2_id,
                severity=iss["severity"],
                owner_id=random.choice(profile_ids),
                due_date=today + timedelta(days=random.randint(5, 30)),
                status=IssueStatusEnum.OPEN
            )
            db.add(issue)
        db.flush()

        # --- 15. SEED CHALLENGES & PARTICIPATION ---
        print("Seeding Challenges...")
        chg_list = [
            {"title": "30-Day Corporate Energy Saving Challenge", "code": "CHG-ENG-01", "cat": "Energy Saving", "xp": 500},
            {"title": "Plastic-Free Office Campaign", "code": "CHG-PLS-03", "cat": "Plastic Free Office", "xp": 300},
            {"title": "Corporate Water Conservation Drive", "code": "CHG-WTR-04", "cat": "Water Conservation", "xp": 350}
        ]

        challenges = []
        for chg in chg_list:
            chg_id = uuid.uuid4()
            c_obj = Challenge(
                id=chg_id,
                challenge_code=chg["code"],
                title=chg["title"],
                description=f"A sustainability challenge focus to incentivize {chg['title']} among employees.",
                category_id=categories[chg["cat"]],
                xp_points=chg["xp"],
                difficulty=ChallengeDifficultyEnum.MEDIUM,
                evidence_required=True,
                start_date=today - timedelta(days=10),
                end_date=today + timedelta(days=20),
                status=ChallengeStatusEnum.ACTIVE,
                created_by=admin_id,
                updated_by=admin_id
            )
            db.add(c_obj)
            challenges.append((chg_id, chg["xp"]))
        db.flush()

        # Seeding Challenge Participation
        for idx in range(15):
            emp_id = random.choice(profile_ids)
            chg_id, xp_pts = random.choice(challenges)
            
            cp = ChallengeParticipation(
                id=uuid.uuid4(),
                challenge_id=chg_id,
                employee_id=emp_id,
                progress=100.0,
                proof_url=f"https://evidence-url/chg_{idx}.pdf",
                approval_status=ParticipationStatusEnum.APPROVED,
                xp_awarded=xp_pts,
                completed_at=datetime.now(UTC) - timedelta(days=3)
            )
            db.add(cp)
        db.flush()

        # --- 16. SEED XP TRANSACTIONS ---
        print("Seeding XP Transactions for Leaderboards...")
        for p_id in profile_ids:
            xt = XpTransaction(
                id=uuid.uuid4(),
                employee_id=p_id,
                source_type="CHALLENGE_COMPLETION",
                source_id=uuid.uuid4(),
                xp=random.randint(100, 800),
                transaction_date=datetime.now(UTC) - timedelta(days=random.randint(1, 10)),
                notes="XP awarded successfully for ESG participation."
            )
            db.add(xt)
        db.flush()

        db.commit()
        print("SUCCESS! Seeding of clean, reduced database completed successfully!")

    except Exception as e:
        db.rollback()
        import traceback
        print("FATAL ERROR occurred during Seeding process. Rollback complete.")
        traceback.print_exc()
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
