export interface CsrActivity {
  id: string;
  activity_code: string;
  title: string;
  category_id?: string;
  department_id?: string;
  description?: string;
  start_date: string;
  end_date: string;
  location?: string;
  max_participants?: number;
  status: 'PLANNED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface EmployeeParticipation {
  id: string;
  employee_id: string;
  activity_id: string;
  proof_url?: string;
  approval_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  points_earned: number;
  completion_date?: string;
  created_at: string;
  updated_at: string;
}

export interface DiversityMetric {
  id: string;
  department_id: string;
  metric_name: string;
  metric_value: number;
  reporting_period: string;
  created_at: string;
  updated_at: string;
}

export interface TrainingRecord {
  id: string;
  employee_id: string;
  training_name: string;
  completion_date?: string;
  expiry_date?: string;
  status: 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED';
  certificate_url?: string;
  created_at: string;
  updated_at: string;
}
