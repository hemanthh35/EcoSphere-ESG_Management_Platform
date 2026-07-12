import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { environmentalService } from '../services/environmentalService';
import { EnvironmentalQueryParams, EmissionFactorCreate, EmissionFactorUpdate, CarbonTransactionCreate, CarbonTransactionUpdate, EnvironmentalGoalCreate, EnvironmentalGoalUpdate } from '../types/environmental';

// --- Emission Factors ---

export function useEmissionFactors(params?: EnvironmentalQueryParams) {
  return useQuery({
    queryKey: ['emissionFactors', params],
    queryFn: () => environmentalService.getEmissionFactors(params),
  });
}

export function useCreateEmissionFactor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EmissionFactorCreate) => environmentalService.createEmissionFactor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emissionFactors'] });
    },
  });
}

export function useUpdateEmissionFactor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EmissionFactorUpdate }) => 
      environmentalService.updateEmissionFactor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emissionFactors'] });
    },
  });
}

export function useDeleteEmissionFactor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => environmentalService.deleteEmissionFactor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emissionFactors'] });
    },
  });
}

// --- Carbon Transactions ---

export function useCarbonTransactions(params?: EnvironmentalQueryParams) {
  return useQuery({
    queryKey: ['carbonTransactions', params],
    queryFn: () => environmentalService.getCarbonTransactions(params),
  });
}

export function useCreateCarbonTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CarbonTransactionCreate) => environmentalService.createCarbonTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carbonTransactions'] });
      // Creating a transaction updates goals
      queryClient.invalidateQueries({ queryKey: ['environmentalGoals'] });
    },
  });
}

export function useUpdateCarbonTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CarbonTransactionUpdate }) => 
      environmentalService.updateCarbonTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carbonTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['environmentalGoals'] });
    },
  });
}

export function useDeleteCarbonTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => environmentalService.deleteCarbonTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carbonTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['environmentalGoals'] });
    },
  });
}

// --- Environmental Goals ---

export function useEnvironmentalGoals(params?: EnvironmentalQueryParams) {
  return useQuery({
    queryKey: ['environmentalGoals', params],
    queryFn: () => environmentalService.getEnvironmentalGoals(params),
  });
}

export function useCreateEnvironmentalGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EnvironmentalGoalCreate) => environmentalService.createEnvironmentalGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['environmentalGoals'] });
    },
  });
}

export function useUpdateEnvironmentalGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EnvironmentalGoalUpdate }) => 
      environmentalService.updateEnvironmentalGoal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['environmentalGoals'] });
    },
  });
}

export function useDeleteEnvironmentalGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => environmentalService.deleteEnvironmentalGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['environmentalGoals'] });
    },
  });
}
