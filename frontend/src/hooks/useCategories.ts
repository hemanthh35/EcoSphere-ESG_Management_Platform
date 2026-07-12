import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/services/categoryService';
import type { CategoryCreate, CategoryUpdate } from '@/types/category';

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...categoryKeys.lists(), { filters }] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
  dropdowns: () => [...categoryKeys.all, 'dropdown'] as const,
  statistics: () => [...categoryKeys.all, 'statistics'] as const,
};

export function useCategories(filters: {
  skip?: number;
  limit?: number;
  search?: string;
  status?: string;
  category_type?: string;
  sort_by?: string;
  sort_order?: string;
} = {}) {
  return useQuery({
    queryKey: categoryKeys.list(filters),
    queryFn: () => categoryService.getCategories(filters),
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.getCategory(id),
    enabled: !!id,
  });
}

export function useCategoryDropdown(category_type?: string) {
  return useQuery({
    queryKey: [...categoryKeys.dropdowns(), category_type],
    queryFn: () => categoryService.getDropdown(category_type),
  });
}

export function useCategoryStatistics() {
  return useQuery({
    queryKey: categoryKeys.statistics(),
    queryFn: () => categoryService.getStatistics(),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryCreate) => categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryUpdate & { id: string }) => categoryService.updateCategory(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
