import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import type { ProductESGProfileCreate, ProductESGProfileUpdate, ProductQueryParams } from '@/types/product';

export const PRODUCT_KEYS = {
  all: ['products'] as const,
  list: (params?: ProductQueryParams) => ['products', 'list', params] as const,
  detail: (id: string) => ['products', 'detail', id] as const,
  dropdown: () => ['products', 'dropdown'] as const,
  statistics: () => ['products', 'statistics'] as const,
};

export function useProducts(params?: ProductQueryParams) {
  return useQuery({
    queryKey: PRODUCT_KEYS.list(params),
    queryFn: () => productService.list(params),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: PRODUCT_KEYS.detail(id),
    queryFn: () => productService.get(id),
    enabled: !!id,
  });
}

export function useProductDropdown() {
  return useQuery({
    queryKey: PRODUCT_KEYS.dropdown(),
    queryFn: () => productService.getDropdown(),
  });
}

export function useProductStatistics() {
  return useQuery({
    queryKey: PRODUCT_KEYS.statistics(),
    queryFn: () => productService.getStatistics(),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProductESGProfileCreate) => productService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & ProductESGProfileUpdate) => productService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
    },
  });
}
