export type DepartmentStatus = 'ACTIVE' | 'INACTIVE';

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  parent_department_id?: string | null;
  department_head_id?: string | null;
  employee_count: number;
  status: DepartmentStatus;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface DepartmentListItem {
  id: string;
  name: string;
  code: string;
  status: DepartmentStatus;
  employee_count: number;
  parent_department_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedDepartmentResponse {
  items: DepartmentListItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface DepartmentCreatePayload {
  name: string;
  code: string;
  description?: string;
  parent_department_id?: string | null;
  department_head_id?: string | null;
  employee_count?: number;
  status?: DepartmentStatus;
}

export interface DepartmentUpdatePayload {
  name?: string;
  code?: string;
  description?: string | null;
  parent_department_id?: string | null;
  department_head_id?: string | null;
  employee_count?: number;
  status?: DepartmentStatus;
}

export interface DepartmentQueryParams {
  skip?: number;
  limit?: number;
  search?: string;
  status?: DepartmentStatus;
  parent_id?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}
