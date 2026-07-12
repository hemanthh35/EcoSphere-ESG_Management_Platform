import api from '@/lib/api';
import {
  EmissionFactor,
  EmissionFactorCreate,
  EmissionFactorUpdate,
  CarbonTransaction,
  CarbonTransactionCreate,
  CarbonTransactionUpdate,
  EnvironmentalGoal,
  EnvironmentalGoalCreate,
  EnvironmentalGoalUpdate,
  PaginatedResponse,
  EnvironmentalQueryParams,
} from '../types/environmental';

const BASE_URL = '/api/v1/environmental';

export const environmentalService = {
  // Emission Factors
  getEmissionFactors: async (params?: EnvironmentalQueryParams) => {
    return api.get<PaginatedResponse<EmissionFactor>>(`${BASE_URL}/emission-factors`, { params });
  },
  getEmissionFactor: async (id: string) => {
    return api.get<EmissionFactor>(`${BASE_URL}/emission-factors/${id}`);
  },
  createEmissionFactor: async (data: EmissionFactorCreate) => {
    return api.post<EmissionFactor>(`${BASE_URL}/emission-factors`, data);
  },
  updateEmissionFactor: async (id: string, data: EmissionFactorUpdate) => {
    return api.put<EmissionFactor>(`${BASE_URL}/emission-factors/${id}`, data);
  },
  deleteEmissionFactor: async (id: string) => {
    return api.delete(`${BASE_URL}/emission-factors/${id}`);
  },

  // Carbon Transactions
  getCarbonTransactions: async (params?: EnvironmentalQueryParams) => {
    return api.get<PaginatedResponse<CarbonTransaction>>(`${BASE_URL}/carbon-transactions`, { params });
  },
  getCarbonTransaction: async (id: string) => {
    return api.get<CarbonTransaction>(`${BASE_URL}/carbon-transactions/${id}`);
  },
  createCarbonTransaction: async (data: CarbonTransactionCreate) => {
    return api.post<CarbonTransaction>(`${BASE_URL}/carbon-transactions`, data);
  },
  updateCarbonTransaction: async (id: string, data: CarbonTransactionUpdate) => {
    return api.put<CarbonTransaction>(`${BASE_URL}/carbon-transactions/${id}`, data);
  },
  deleteCarbonTransaction: async (id: string) => {
    return api.delete(`${BASE_URL}/carbon-transactions/${id}`);
  },

  // Environmental Goals
  getEnvironmentalGoals: async (params?: EnvironmentalQueryParams) => {
    return api.get<PaginatedResponse<EnvironmentalGoal>>(`${BASE_URL}/goals`, { params });
  },
  getEnvironmentalGoal: async (id: string) => {
    return api.get<EnvironmentalGoal>(`${BASE_URL}/goals/${id}`);
  },
  createEnvironmentalGoal: async (data: EnvironmentalGoalCreate) => {
    return api.post<EnvironmentalGoal>(`${BASE_URL}/goals`, data);
  },
  updateEnvironmentalGoal: async (id: string, data: EnvironmentalGoalUpdate) => {
    return api.put<EnvironmentalGoal>(`${BASE_URL}/goals/${id}`, data);
  },
  deleteEnvironmentalGoal: async (id: string) => {
    return api.delete(`${BASE_URL}/goals/${id}`);
  }
};
