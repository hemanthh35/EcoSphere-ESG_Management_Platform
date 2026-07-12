import api from '@/lib/apiClient';
import type {
  Category,
  CategoryCreate,
  CategoryUpdate,
  CategoryListItem,
  CategoryDropdownResponse,
  CategoryStatisticsResponse,
} from '@/types/category';

export const categoryService = {
  async getCategories(params: {
    skip?: number;
    limit?: number;
    search?: string;
    status?: string;
    category_type?: string;
    sort_by?: string;
    sort_order?: string;
  }): Promise<CategoryListItem[]> {
    const { data } = await api.get('/categories', { params });
    return data;
  },

  async getCategory(id: string): Promise<Category> {
    const { data } = await api.get(`/categories/${id}`);
    return data;
  },

  async createCategory(category: CategoryCreate): Promise<Category> {
    const { data } = await api.post('/categories', category);
    return data;
  },

  async updateCategory({ id, ...category }: CategoryUpdate & { id: string }): Promise<Category> {
    const { data } = await api.put(`/categories/${id}`, category);
    return data;
  },

  async deleteCategory(id: string): Promise<Category> {
    const { data } = await api.delete(`/categories/${id}`);
    return data;
  },

  async getDropdown(category_type?: string): Promise<CategoryDropdownResponse[]> {
    const { data } = await api.get('/categories/dropdown', { params: { category_type } });
    return data;
  },

  async getStatistics(): Promise<CategoryStatisticsResponse> {
    const { data } = await api.get('/categories/statistics');
    return data;
  },
};
