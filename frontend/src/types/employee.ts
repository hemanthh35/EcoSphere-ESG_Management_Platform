export const RoleEnum = {
  ADMIN: 'Admin',
  ESG_MANAGER: 'ESG Manager',
  DEPARTMENT_HEAD: 'Department Head',
  AUDITOR: 'Auditor',
  EMPLOYEE: 'Employee',
} as const;

export type RoleEnum = typeof RoleEnum[keyof typeof RoleEnum];

export const StatusEnum = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  SUSPENDED: 'Suspended',
} as const;

export type StatusEnum = typeof StatusEnum[keyof typeof StatusEnum];

export const GenderEnum = {
  MALE: 'Male',
  FEMALE: 'Female',
  OTHER: 'Other',
} as const;

export type GenderEnum = typeof GenderEnum[keyof typeof GenderEnum];

export interface Employee {
  id: string;
  employee_code?: string;
  first_name?: string;
  last_name?: string;
  full_name: string;
  email: string;
  phone?: string;
  profile_image?: string;
  department_id?: string;
  department_name?: string;
  designation?: string;
  manager_id?: string;
  manager_name?: string;
  role: RoleEnum;
  gender?: GenderEnum;
  joining_date?: string;
  date_of_birth?: string;
  address?: string;
  status: StatusEnum;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EmployeeCreate {
  employee_code?: string;
  first_name?: string;
  last_name?: string;
  full_name: string;
  email: string;
  phone?: string;
  profile_image?: string;
  department_id?: string;
  designation?: string;
  manager_id?: string;
  role?: RoleEnum;
  gender?: GenderEnum;
  joining_date?: string;
  date_of_birth?: string;
  address?: string;
  status?: StatusEnum;
  password?: string;
}

export interface EmployeeUpdate {
  employee_code?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  phone?: string;
  profile_image?: string;
  department_id?: string;
  designation?: string;
  manager_id?: string;
  role?: RoleEnum;
  gender?: GenderEnum;
  joining_date?: string;
  date_of_birth?: string;
  address?: string;
  status?: StatusEnum;
}

export interface EmployeeDropdown {
  id: string;
  full_name: string;
  employee_code?: string;
}

export interface EmployeeStatistics {
  total: number;
  active: number;
  inactive: number;
  by_department: Record<string, number>;
}

export interface EmployeePaginatedResponse {
  items: Employee[];
  total: number;
}
