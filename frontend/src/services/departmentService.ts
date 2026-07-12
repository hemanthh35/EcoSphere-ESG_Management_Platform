import apiClient from '@/lib/apiClient';
import type {
  ApiResponse,
  Department,
  DepartmentCreatePayload,
  DepartmentQueryParams,
  DepartmentUpdatePayload,
  PaginatedDepartmentResponse,
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
};
