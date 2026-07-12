export const PolicyStatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED'
} as const;
export type PolicyStatus = typeof PolicyStatus[keyof typeof PolicyStatus];

export const AcknowledgementStatus = {
  PENDING: 'PENDING',
  ACKNOWLEDGED: 'ACKNOWLEDGED'
} as const;
export type AcknowledgementStatus = typeof AcknowledgementStatus[keyof typeof AcknowledgementStatus];

export const AuditStatus = {
  PLANNED: 'PLANNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
} as const;
export type AuditStatus = typeof AuditStatus[keyof typeof AuditStatus];

export const IssueSeverity = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
} as const;
export type IssueSeverity = typeof IssueSeverity[keyof typeof IssueSeverity];

export const IssueStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED'
} as const;
export type IssueStatus = typeof IssueStatus[keyof typeof IssueStatus];

export interface ESGPolicy {
  id: string;
  policy_code: string;
  title: string;
  version: string;
  department_id: string;
  description?: string;
  effective_date: string;
  expiry_date?: string;
  attachment_url?: string;
  status: PolicyStatus;
  created_at: string;
  updated_at: string;
}

export interface ESGPolicyCreate {
  policy_code: string;
  title: string;
  version: string;
  department_id: string;
  description?: string;
  effective_date: string;
  expiry_date?: string;
  attachment_url?: string;
  status?: PolicyStatus;
}

export interface ESGPolicyUpdate extends Partial<ESGPolicyCreate> {}

export interface Audit {
  id: string;
  audit_code: string;
  title: string;
  department_id: string;
  auditor_id?: string;
  start_date: string;
  end_date?: string;
  findings?: string;
  status: AuditStatus;
  created_at: string;
  updated_at: string;
}

export interface AuditCreate {
  audit_code: string;
  title: string;
  department_id: string;
  auditor_id?: string;
  start_date: string;
  end_date?: string;
  findings?: string;
  status?: AuditStatus;
}

export interface AuditUpdate extends Partial<AuditCreate> {}

export interface ComplianceIssue {
  id: string;
  title: string;
  description: string;
  audit_id: string;
  severity: IssueSeverity;
  owner_id?: string;
  due_date: string;
  resolution?: string;
  status: IssueStatus;
  created_at: string;
  updated_at: string;
}

export interface ComplianceIssueCreate {
  title: string;
  description: string;
  audit_id: string;
  severity?: IssueSeverity;
  owner_id?: string;
  due_date: string;
  resolution?: string;
  status?: IssueStatus;
}

export interface ComplianceIssueUpdate extends Partial<ComplianceIssueCreate> {}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface GovernanceQueryParams {
  skip?: number;
  limit?: number;
  search?: string;
}
