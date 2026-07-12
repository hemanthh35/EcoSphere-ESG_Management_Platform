export type FactorStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
export type TransactionStatus = 'DRAFT' | 'LOGGED' | 'VERIFIED';
export type GoalStatus = 'ACTIVE' | 'ON TRACK' | 'AT RISK' | 'COMPLETED' | 'MISSED';

export interface EmissionFactor {
  id: string;
  factor_code: string;
  factor_name: string;
  source: string;
  category: string;
  unit: string;
  co2e_factor: number;
  effective_from: string;
  effective_to?: string;
  status: FactorStatus;
  created_at: string;
  updated_at: string;
}

export type EmissionFactorCreate = Omit<EmissionFactor, 'id' | 'created_at' | 'updated_at'>;
export type EmissionFactorUpdate = Partial<EmissionFactorCreate>;

export interface CarbonTransaction {
  id: string;
  transaction_number: string;
  department_id: string;
  department_name?: string;
  product_esg_profile_id?: string;
  product_name?: string;
  emission_factor_id: string;
  emission_factor_name?: string;
  quantity: number;
  unit: string;
  calculated_emission: number;
  transaction_date: string;
  notes?: string;
  status: TransactionStatus;
  created_at: string;
  updated_at: string;
}

export type CarbonTransactionCreate = Omit<CarbonTransaction, 'id' | 'department_name' | 'product_name' | 'emission_factor_name' | 'calculated_emission' | 'created_at' | 'updated_at'>;
export type CarbonTransactionUpdate = Partial<CarbonTransactionCreate>;

export interface EnvironmentalGoal {
  id: string;
  goal_name: string;
  department_id: string;
  department_name?: string;
  target_co2: number;
  current_co2: number;
  progress_percentage: number;
  deadline: string;
  status: GoalStatus;
  created_at: string;
  updated_at: string;
}

export type EnvironmentalGoalCreate = Omit<EnvironmentalGoal, 'id' | 'department_name' | 'current_co2' | 'progress_percentage' | 'created_at' | 'updated_at'>;
export type EnvironmentalGoalUpdate = Partial<EnvironmentalGoalCreate>;

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

export interface EnvironmentalQueryParams {
  skip?: number;
  limit?: number;
  search?: string;
  department_id?: string;
}
