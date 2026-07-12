import api from '@/lib/apiClient';
import type {
  Employee,
  EmployeeCreate,
  EmployeeUpdate,
  EmployeeDropdown,
  EmployeeStatistics,
  EmployeePaginatedResponse,
  RoleEnum,
} from '@/types/employee';

class EmployeeService {
  private basePath = '/employees';

  async getAll(params?: {
    skip?: number;
    limit?: number;
    search?: string;
    department_id?: string;
    role?: RoleEnum;
  }): Promise<EmployeePaginatedResponse> {
    const response = await api.get<EmployeePaginatedResponse>(this.basePath, { params });
    return response.data;
  }

  async getById(id: string): Promise<Employee> {
    const response = await api.get<Employee>(`${this.basePath}/${id}`);
    return response.data;
  }

  async getDropdown(): Promise<EmployeeDropdown[]> {
    const response = await api.get<EmployeeDropdown[]>(`${this.basePath}/dropdown`);
    return response.data;
  }
  
  async getManagers(): Promise<EmployeeDropdown[]> {
    const response = await api.get<EmployeeDropdown[]>(`${this.basePath}/managers`);
    return response.data;
  }

  async getStatistics(): Promise<EmployeeStatistics> {
    const response = await api.get<EmployeeStatistics>(`${this.basePath}/statistics`);
    return response.data;
  }

  async create(data: EmployeeCreate): Promise<Employee> {
    const response = await api.post<Employee>(this.basePath, data);
    return response.data;
  }

  async update(id: string, data: EmployeeUpdate): Promise<Employee> {
    const response = await api.put<Employee>(`${this.basePath}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<Employee> {
    const response = await api.delete<Employee>(`${this.basePath}/${id}`);
    return response.data;
  }
}

export const employeeService = new EmployeeService();
