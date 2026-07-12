import api from '@/lib/apiClient';

export interface EnvironmentalReport {
  total_co2_reduction: number;
  total_energy_saved: number;
  total_water_conserved: number;
  total_waste_recycled: number;
  goals_progress: Array<{
    id: string;
    title: string;
    target_value: number;
    current_value: number;
    progress: number;
  }>;
}

export interface SocialReport {
  total_csr_hours: number;
  csr_participation_count: number;
  average_diversity_score: number;
  training_completion_rate: number;
  active_csr_initiatives: Array<{
    id: string;
    title: string;
    status: string;
    max_participants: number;
  }>;
}

export interface GovernanceReport {
  active_policies_count: number;
  total_audits_count: number;
  completed_audits_count: number;
  open_compliance_issues_count: number;
  compliance_issues: Array<{
    id: string;
    title: string;
    severity: string;
    due_date: string;
  }>;
}

export interface ESGSummaryReport {
  overall_esg_score: number;
  environmental_score: number;
  social_score: number;
  governance_score: number;
  weights: {
    environmental: number;
    social: number;
    governance: number;
  };
  department_scores: Array<any>;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description?: string;
  config: any;
  created_at: string;
  created_by: string;
}

export const reportsService = {
  async getEnvironmentalReport(params?: { department_id?: string; start_date?: string; end_date?: string }): Promise<EnvironmentalReport> {
    const { data } = await api.get('/reports/environmental', { params });
    return data;
  },

  async getSocialReport(params?: { department_id?: string; start_date?: string; end_date?: string }): Promise<SocialReport> {
    const { data } = await api.get('/reports/social', { params });
    return data;
  },

  async getGovernanceReport(params?: { department_id?: string; start_date?: string; end_date?: string }): Promise<GovernanceReport> {
    const { data } = await api.get('/reports/governance', { params });
    return data;
  },

  async getESGSummaryReport(params?: { department_id?: string }): Promise<ESGSummaryReport> {
    const { data } = await api.get('/reports/esg-summary', { params });
    return data;
  },

  async saveTemplate(payload: { name: string; description?: string; config: any }): Promise<ReportTemplate> {
    const { data } = await api.post('/reports/templates', payload);
    return data;
  },

  async getTemplates(): Promise<ReportTemplate[]> {
    const { data } = await api.get('/reports/templates');
    return data;
  },

  async downloadCSV(reportType: string, departmentId?: string): Promise<void> {
    const response = await api.get('/reports/export/csv', {
      params: { report_type: reportType, department_id: departmentId },
      responseType: 'blob'
    });
    
    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${reportType}_report.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};
