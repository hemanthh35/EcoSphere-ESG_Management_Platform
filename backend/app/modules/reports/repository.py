from typing import List, Optional
from uuid import UUID
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import select, func

from app.modules.department.models import Department
from app.modules.environmental.models import CarbonTransaction, EnvironmentalGoal
from app.modules.social.models import CsrActivity, DiversityMetric, TrainingRecord, EmployeeParticipation
from app.modules.governance.models import ESGPolicy, Audit, ComplianceIssue, PolicyAcknowledgement
from app.modules.settings.models import ESGConfiguration
from .models import ReportTemplate, ExportAuditLog

class ReportsRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_environmental_data(self, department_id: Optional[UUID], start_date: Optional[date], end_date: Optional[date]) -> dict:
        # Get carbon transactions (summing calculated_emission as total emissions tracked)
        tx_query = select(func.sum(CarbonTransaction.calculated_emission))
        if department_id:
            tx_query = tx_query.where(CarbonTransaction.department_id == department_id)
        if start_date:
            tx_query = tx_query.where(CarbonTransaction.transaction_date >= start_date)
        if end_date:
            tx_query = tx_query.where(CarbonTransaction.transaction_date <= end_date)
        
        offset_sum = self.session.scalar(tx_query) or 0.0

        # Gather goal metrics
        goals_query = select(EnvironmentalGoal)
        if department_id:
            goals_query = goals_query.where(EnvironmentalGoal.department_id == department_id)
        
        goals = self.session.scalars(goals_query).all()
        goals_list = []
        energy_saved = 0.0
        water_conserved = 0.0
        waste_recycled = 0.0

        for goal in goals:
            title = goal.goal_name
            goals_list.append({
                "id": str(goal.id),
                "title": title,
                "target_value": goal.target_co2,
                "current_value": goal.current_co2,
                "progress": goal.progress_percentage
            })
            if "energy" in title.lower():
                energy_saved += goal.current_co2
            elif "water" in title.lower():
                water_conserved += goal.current_co2
            elif "waste" in title.lower() or "recycle" in title.lower():
                waste_recycled += goal.current_co2

        # Get carbon transactions monthly trend (last 6 months)
        trend_query = select(CarbonTransaction.transaction_date, CarbonTransaction.calculated_emission)
        if department_id:
            trend_query = trend_query.where(CarbonTransaction.department_id == department_id)
        
        txs = self.session.execute(trend_query).all()
        
        today = date.today()
        month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        trend_dict = {}
        ordered_months = []
        for i in range(5, -1, -1):
            m = today.month - i
            y = today.year
            if m <= 0:
                m += 12
                y -= 1
            m_name = month_names[m - 1]
            trend_dict[(y, m)] = {"month": m_name, "offset": 0.0}
            ordered_months.append((y, m))

        for tx_date, emission in txs:
            if tx_date:
                key = (tx_date.year, tx_date.month)
                if key in trend_dict:
                    trend_dict[key]["offset"] += float(emission)
        
        monthly_trend = [trend_dict[k] for k in ordered_months]

        return {
            "total_co2_reduction": float(offset_sum),
            "total_energy_saved": float(energy_saved),
            "total_water_conserved": float(water_conserved),
            "total_waste_recycled": float(waste_recycled),
            "goals_progress": goals_list,
            "monthly_trend": monthly_trend
        }

    def get_social_data(self, department_id: Optional[UUID], start_date: Optional[date], end_date: Optional[date]) -> dict:
        # CSR activities (only non-deleted ones)
        csr_query = select(CsrActivity).where(CsrActivity.deleted_at == None)
        if start_date:
            csr_query = csr_query.where(CsrActivity.start_date >= start_date)
        if end_date:
            csr_query = csr_query.where(CsrActivity.end_date <= end_date)

        activities = self.session.scalars(csr_query).all()
        active_csr = []
        for act in activities:
            active_csr.append({
                "id": str(act.id),
                "title": act.title,
                "status": act.status,
                "max_participants": act.max_participants
            })

        # Average diversity score
        diversity_query = select(func.avg(DiversityMetric.metric_value))
        if department_id:
            diversity_query = diversity_query.where(DiversityMetric.department_id == department_id)
        if start_date:
            # diversity metrics period as Q1/Q2 check, we simply ignore date filter or apply loosely
            pass
        avg_div = self.session.scalar(diversity_query) or 0.0

        # Training completion rate
        training_query = select(
            func.count(TrainingRecord.id),
            func.count(TrainingRecord.id).filter(TrainingRecord.status == "COMPLETED")
        )
        total_training, completed_training = self.session.execute(training_query).first() or (0, 0)
        training_rate = (completed_training / total_training * 100) if total_training > 0 else 0.0

        # Calculate actual CSR hours from start and end dates
        total_hours = 0.0
        for act in activities:
            if act.end_date and act.start_date:
                duration = act.end_date - act.start_date
                total_hours += duration.total_seconds() / 3600.0

        # Calculate actual employee participations count
        participation_query = select(func.count(EmployeeParticipation.id))
        if department_id:
            participation_query = participation_query.join(CsrActivity).where(CsrActivity.department_id == department_id)
        participation_count = self.session.scalar(participation_query) or 0

        return {
            "total_csr_hours": float(total_hours),
            "csr_participation_count": int(participation_count),
            "average_diversity_score": float(avg_div),
            "training_completion_rate": float(training_rate),
            "active_csr_initiatives": active_csr
        }

    def get_governance_data(self, department_id: Optional[UUID], start_date: Optional[date], end_date: Optional[date]) -> dict:
        # ESG Policies
        policy_query = select(ESGPolicy).where(ESGPolicy.is_deleted == False)
        if department_id:
            policy_query = policy_query.where(ESGPolicy.department_id == department_id)
        active_policies = self.session.scalars(policy_query).all()

        # Audits
        audit_query = select(Audit)
        if department_id:
            audit_query = audit_query.where(Audit.department_id == department_id)
        audits = self.session.scalars(audit_query).all()

        completed_audits = [a for a in audits if a.status == "COMPLETED" or getattr(a.status, 'value', None) == "COMPLETED"]

        # Compliance issues
        issues_query = select(ComplianceIssue)
        issues = self.session.scalars(issues_query).all()
        open_issues = [i for i in issues if i.status == "OPEN" or getattr(i.status, 'value', None) == "OPEN"]

        issues_list = []
        for issue in open_issues:
            issues_list.append({
                "id": str(issue.id),
                "title": issue.title,
                "severity": issue.severity.value if hasattr(issue.severity, 'value') else str(issue.severity),
                "due_date": str(issue.due_date)
            })

        return {
            "active_policies_count": len(active_policies),
            "total_audits_count": len(audits),
            "completed_audits_count": len(completed_audits),
            "open_compliance_issues_count": len(open_issues),
            "compliance_issues": issues_list
        }

    def get_esg_summary_data(self, department_id: Optional[UUID]) -> dict:
        # Load weights
        config = self.session.scalar(select(ESGConfiguration))
        env_w = config.environmental_weight if config else 0.4
        soc_w = config.social_weight if config else 0.3
        gov_w = config.governance_weight if config else 0.3

        # Compute global scores
        env_data = self.get_environmental_data(department_id, None, None)
        soc_data = self.get_social_data(department_id, None, None)
        gov_data = self.get_governance_data(department_id, None, None)

        # Global env_score
        goals = env_data["goals_progress"]
        env_score = sum(g["progress"] for g in goals) / len(goals) if goals else 0.0

        # Global soc_score
        has_diversity = soc_data["average_diversity_score"] > 0.0
        has_training = soc_data["training_completion_rate"] > 0.0
        div_val = soc_data["average_diversity_score"]
        train_val = soc_data["training_completion_rate"]

        if has_diversity and has_training:
            soc_score = (div_val + train_val) / 2.0
        elif has_diversity:
            soc_score = div_val
        elif has_training:
            soc_score = train_val
        else:
            soc_score = 0.0

        # Global gov_score
        total_audits = gov_data["total_audits_count"]
        if total_audits > 0:
            audit_completion = (gov_data["completed_audits_count"] / total_audits) * 100.0
            gov_score = max(audit_completion - (gov_data["open_compliance_issues_count"] * 10), 0.0)
        else:
            if gov_data["active_policies_count"] > 0:
                gov_score = max(100.0 - (gov_data["open_compliance_issues_count"] * 15), 0.0)
            else:
                gov_score = 0.0

        overall = (env_score * env_w) + (soc_score * soc_w) + (gov_score * gov_w)

        # Batch queries for leaderboard to avoid N+1 queries
        all_goals = self.session.scalars(select(EnvironmentalGoal)).all()
        goals_by_dept = {}
        for g in all_goals:
            goals_by_dept.setdefault(g.department_id, []).append(g.progress_percentage)

        div_avg_query = select(DiversityMetric.department_id, func.avg(DiversityMetric.metric_value)).group_by(DiversityMetric.department_id)
        div_by_dept = {row[0]: float(row[1]) for row in self.session.execute(div_avg_query).all()}

        global_training_query = select(
            func.count(TrainingRecord.id),
            func.count(TrainingRecord.id).filter(TrainingRecord.status == "COMPLETED")
        )
        total_t, comp_t = self.session.execute(global_training_query).first() or (0, 0)
        global_training_rate = (comp_t / total_t * 100) if total_t > 0 else 0.0

        all_audits = self.session.scalars(select(Audit)).all()
        audits_by_dept = {}
        for a in all_audits:
            status_val = getattr(a.status, 'value', None) or str(a.status)
            is_completed = status_val == "COMPLETED"
            audits_by_dept.setdefault(a.department_id, {"total": 0, "completed": 0})
            audits_by_dept[a.department_id]["total"] += 1
            if is_completed:
                audits_by_dept[a.department_id]["completed"] += 1

        all_policies = self.session.scalars(select(ESGPolicy).where(ESGPolicy.is_deleted == False)).all()
        policies_by_dept = {}
        for p in all_policies:
            policies_by_dept.setdefault(p.department_id, []).append(p)

        global_issues_query = select(ComplianceIssue)
        global_issues = self.session.scalars(global_issues_query).all()
        global_open_issues_count = len([i for i in global_issues if i.status == "OPEN" or getattr(i.status, 'value', None) == "OPEN"])

        # Compute real department scores leaderboard
        depts_query = select(Department)
        depts = self.session.scalars(depts_query).all()
        dept_scores = []
        for d in depts:
            # E-score
            d_goals = goals_by_dept.get(d.id, [])
            d_env = sum(d_goals) / len(d_goals) if d_goals else 0.0

            # S-score
            d_div = div_by_dept.get(d.id, 0.0)
            d_has_div = d_div > 0.0
            d_has_train = global_training_rate > 0.0
            
            if d_has_div and d_has_train:
                d_soc = (d_div + global_training_rate) / 2.0
            elif d_has_div:
                d_soc = d_div
            elif d_has_train:
                d_soc = global_training_rate
            else:
                d_soc = 0.0

            # G-score
            d_aud_info = audits_by_dept.get(d.id, {"total": 0, "completed": 0})
            d_total_audits = d_aud_info["total"]
            d_active_policies_cnt = len(policies_by_dept.get(d.id, []))
            
            if d_total_audits > 0:
                d_audit_completion = (d_aud_info["completed"] / d_total_audits) * 100.0
                d_gov = max(d_audit_completion - (global_open_issues_count * 10), 0.0)
            else:
                if d_active_policies_cnt > 0:
                    d_gov = max(100.0 - (global_open_issues_count * 15), 0.0)
                else:
                    d_gov = 0.0

            d_overall = (d_env * env_w) + (d_soc * soc_w) + (d_gov * gov_w)

            dept_scores.append({
                "id": str(d.id),
                "name": d.name,
                "overall_esg_score": float(d_overall),
                "environmental_score": float(d_env),
                "social_score": float(d_soc),
                "governance_score": float(d_gov)
            })

        dept_scores.sort(key=lambda x: x["overall_esg_score"], reverse=True)

        return {
            "overall_esg_score": float(overall),
            "environmental_score": float(env_score),
            "social_score": float(soc_score),
            "governance_score": float(gov_score),
            "weights": {
                "environmental": env_w,
                "social": soc_w,
                "governance": gov_w
            },
            "department_scores": dept_scores
        }

    # Save Custom templates
    def create_template(self, name: str, description: Optional[str], config: dict, user_id: UUID) -> ReportTemplate:
        template = ReportTemplate(
            name=name,
            description=description,
            config=config,
            created_by=user_id
        )
        self.session.add(template)
        self.session.flush()
        return template

    def get_templates(self) -> List[ReportTemplate]:
        return list(self.session.scalars(select(ReportTemplate)).all())

    # Log export audits
    def log_export(self, report_type: str, export_format: str, user_id: UUID) -> ExportAuditLog:
        log = ExportAuditLog(
            report_type=report_type,
            export_format=export_format,
            exported_by=user_id
        )
        self.session.add(log)
        self.session.flush()
        return log
