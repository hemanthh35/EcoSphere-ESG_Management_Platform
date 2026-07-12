export type Role = 'Admin' | 'ESG Manager' | 'Department Head' | 'Auditor' | 'Employee';

export type Status = 'Active' | 'Inactive' | 'Suspended';

export interface User {
  id: string;
  email: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  status: Status;
  department_id?: string;
  employee_code?: string;
  designation?: string;
  profile_image?: string;
  phone?: string;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}
