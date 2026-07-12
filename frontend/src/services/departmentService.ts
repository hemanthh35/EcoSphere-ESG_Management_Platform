import apiClient from '@/lib/apiClient';
import type {
  ApiResponse,
  Department,
  DepartmentCreatePayload,
  DepartmentQueryParams,
  DepartmentUpdatePayload,
  PaginatedDepartmentResponse,
  DepartmentTreeResponse,
  DepartmentDropdownResponse,
  DepartmentStatisticsResponse,
  DepartmentEmployeeResponse,
} from '@/types/department';

const BASE = '/api/v1/departments';

export const departmentApi = {
  list: async (params?: DepartmentQueryParams): Promise<ApiResponse<PaginatedDepartmentResponse>> => {
    const res = await apiClient.get<ApiResponse<PaginatedDepartmentResponse>>(BASE, { params });
    return res.data;
  },

  get: async (id: string): Promise<ApiResponse<Department>> => {
    const res = await apiClient.get<ApiResponse<Department>>(`${BASE}/${id}`);
    return res.data;
  },

  create: async (payload: DepartmentCreatePayload): Promise<ApiResponse<Department>> => {
    const res = await apiClient.post<ApiResponse<Department>>(BASE, payload);
    return res.data;
  },

  update: async (id: string, payload: DepartmentUpdatePayload): Promise<ApiResponse<Department>> => {
    const res = await apiClient.put<ApiResponse<Department>>(`${BASE}/${id}`, payload);
    return res.data;
  },

  delete: async (id: string): Promise<ApiResponse<Department>> => {
    const res = await apiClient.delete<ApiResponse<Department>>(`${BASE}/${id}`);
    return res.data;
  },

  getTree: async (): Promise<ApiResponse<DepartmentTreeResponse[]>> => {
    const res = await apiClient.get<ApiResponse<DepartmentTreeResponse[]>>(`${BASE}/tree`);
    return res.data;
  },

  getDropdown: async (): Promise<ApiResponse<DepartmentDropdownResponse[]>> => {
    const res = await apiClient.get<ApiResponse<DepartmentDropdownResponse[]>>(`${BASE}/dropdown`);
    return res.data;
  },

  getStatistics: async (): Promise<ApiResponse<DepartmentStatisticsResponse>> => {
    const res = await apiClient.get<ApiResponse<DepartmentStatisticsResponse>>(`${BASE}/statistics`);
    return res.data;
  },

  getEmployees: async (id: string): Promise<ApiResponse<DepartmentEmployeeResponse[]>> => {
    const res = await apiClient.get<ApiResponse<DepartmentEmployeeResponse[]>>(`${BASE}/${id}/employees`);
    return res.data;
  },

  getChildren: async (id: string): Promise<ApiResponse<Department[]>> => {
    const res = await apiClient.get<ApiResponse<Department[]>>(`${BASE}/${id}/children`);
    return res.data;
  },
};
