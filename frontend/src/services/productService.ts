import apiClient from '@/lib/apiClient';
import type {
  ProductESGProfile,
  ProductESGProfileCreate,
  ProductESGProfileUpdate,
  PaginatedProductESGResponse,
  ProductESGDropdownResponse,
  ProductESGStatisticsResponse,
  ProductQueryParams,
  ApiResponse,
} from '@/types/product';

const BASE = '/api/v1/products';

export const productService = {
  list: async (params?: ProductQueryParams): Promise<ApiResponse<PaginatedProductESGResponse>> => {
    const res = await apiClient.get<ApiResponse<PaginatedProductESGResponse>>(BASE, { params });
    return res.data;
  },

  get: async (id: string): Promise<ApiResponse<ProductESGProfile>> => {
    const res = await apiClient.get<ApiResponse<ProductESGProfile>>(`${BASE}/${id}`);
    return res.data;
  },

  create: async (payload: ProductESGProfileCreate): Promise<ApiResponse<ProductESGProfile>> => {
    const res = await apiClient.post<ApiResponse<ProductESGProfile>>(BASE, payload);
    return res.data;
  },

  update: async (id: string, payload: ProductESGProfileUpdate): Promise<ApiResponse<ProductESGProfile>> => {
    const res = await apiClient.put<ApiResponse<ProductESGProfile>>(`${BASE}/${id}`, payload);
    return res.data;
  },

  delete: async (id: string): Promise<ApiResponse<ProductESGProfile>> => {
    const res = await apiClient.delete<ApiResponse<ProductESGProfile>>(`${BASE}/${id}`);
    return res.data;
  },

  getDropdown: async (): Promise<ApiResponse<ProductESGDropdownResponse[]>> => {
    const res = await apiClient.get<ApiResponse<ProductESGDropdownResponse[]>>(`${BASE}/dropdown`);
    return res.data;
  },

  getStatistics: async (): Promise<ApiResponse<ProductESGStatisticsResponse>> => {
    const res = await apiClient.get<ApiResponse<ProductESGStatisticsResponse>>(`${BASE}/statistics`);
    return res.data;
  },
};
