import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { departmentApi } from '@/services/departmentService';
import type { DepartmentCreatePayload, DepartmentQueryParams, DepartmentUpdatePayload } from '@/types/department';

export const DEPARTMENT_KEYS = {
  all: ['departments'] as const,
  list: (params?: DepartmentQueryParams) => ['departments', 'list', params] as const,
  detail: (id: string) => ['departments', 'detail', id] as const,
  tree: () => ['departments', 'tree'] as const,
  dropdown: () => ['departments', 'dropdown'] as const,
  statistics: () => ['departments', 'statistics'] as const,
  employees: (id: string) => ['departments', 'employees', id] as const,
  children: (id: string) => ['departments', 'children', id] as const,
};

export function useDepartments(params?: DepartmentQueryParams) {
  return useQuery({
    queryKey: DEPARTMENT_KEYS.list(params),
    queryFn: () => departmentApi.list(params),
  });
}

export function useDepartment(id: string) {
  return useQuery({
    queryKey: DEPARTMENT_KEYS.detail(id),
    queryFn: () => departmentApi.get(id),
    enabled: !!id,
  });
}

export function useDepartmentTree() {
  return useQuery({
    queryKey: DEPARTMENT_KEYS.tree(),
    queryFn: () => departmentApi.getTree(),
  });
}

export function useDepartmentDropdown() {
  return useQuery({
    queryKey: DEPARTMENT_KEYS.dropdown(),
    queryFn: () => departmentApi.getDropdown(),
  });
}

export function useDepartmentStatistics() {
  return useQuery({
    queryKey: DEPARTMENT_KEYS.statistics(),
    queryFn: () => departmentApi.getStatistics(),
  });
}

export function useDepartmentEmployees(id: string) {
  return useQuery({
    queryKey: DEPARTMENT_KEYS.employees(id),
    queryFn: () => departmentApi.getEmployees(id),
    enabled: !!id,
  });
}

export function useDepartmentChildren(id: string) {
  return useQuery({
    queryKey: DEPARTMENT_KEYS.children(id),
    queryFn: () => departmentApi.getChildren(id),
    enabled: !!id,
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: DepartmentCreatePayload) => departmentApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_KEYS.all });
    },
  });
}

export function useUpdateDepartment(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: DepartmentUpdatePayload) => departmentApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_KEYS.all });
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => departmentApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_KEYS.all });
    },
  });
}
