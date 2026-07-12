import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '@/services/employeeService';
import type { EmployeeCreate, EmployeeUpdate, RoleEnum } from '@/types/employee';

export const EMPLOYEE_KEYS = {
  all: ['employees'] as const,
  lists: () => [...EMPLOYEE_KEYS.all, 'list'] as const,
  list: (filters: string) => [...EMPLOYEE_KEYS.lists(), { filters }] as const,
  details: () => [...EMPLOYEE_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...EMPLOYEE_KEYS.details(), id] as const,
  dropdown: () => [...EMPLOYEE_KEYS.all, 'dropdown'] as const,
  managers: () => [...EMPLOYEE_KEYS.all, 'managers'] as const,
  statistics: () => [...EMPLOYEE_KEYS.all, 'statistics'] as const,
};

export function useEmployees(params?: {
  skip?: number;
  limit?: number;
  search?: string;
  department_id?: string;
  role?: RoleEnum;
}) {
  return useQuery({
    queryKey: EMPLOYEE_KEYS.list(JSON.stringify(params)),
    queryFn: () => employeeService.getAll(params),
  });
}

export function useEmployee(id: string) {
  return useQuery({
    queryKey: EMPLOYEE_KEYS.detail(id),
    queryFn: () => employeeService.getById(id),
    enabled: !!id,
  });
}

export function useEmployeeDropdown() {
  return useQuery({
    queryKey: EMPLOYEE_KEYS.dropdown(),
    queryFn: () => employeeService.getDropdown(),
  });
}

export function useEmployeeManagers() {
  return useQuery({
    queryKey: EMPLOYEE_KEYS.managers(),
    queryFn: () => employeeService.getManagers(),
  });
}

export function useEmployeeStatistics() {
  return useQuery({
    queryKey: EMPLOYEE_KEYS.statistics(),
    queryFn: () => employeeService.getStatistics(),
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: EmployeeCreate) => employeeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_KEYS.statistics() });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EmployeeUpdate }) => 
      employeeService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_KEYS.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_KEYS.statistics() });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => employeeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_KEYS.statistics() });
    },
  });
}
