import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceService } from '../services/governanceService';
import type { GovernanceQueryParams, ESGPolicyCreate, ESGPolicyUpdate, AuditCreate, AuditUpdate } from '../types/governance';

// --- Policies ---
export const usePolicies = (params?: GovernanceQueryParams) => {
  return useQuery({
    queryKey: ['governance', 'policies', params],
    queryFn: () => governanceService.getPolicies(params),
  });
};

export const useCreatePolicy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ESGPolicyCreate) => governanceService.createPolicy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governance', 'policies'] });
    },
  });
};

export const useUpdatePolicy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ESGPolicyUpdate }) => governanceService.updatePolicy(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governance', 'policies'] });
    },
  });
};

export const useDeletePolicy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => governanceService.deletePolicy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governance', 'policies'] });
    },
  });
};

// --- Audits ---
export const useAudits = (params?: GovernanceQueryParams) => {
  return useQuery({
    queryKey: ['governance', 'audits', params],
    queryFn: () => governanceService.getAudits(params),
  });
};

export const useCreateAudit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AuditCreate) => governanceService.createAudit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governance', 'audits'] });
    },
  });
};

export const useUpdateAudit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AuditUpdate }) => governanceService.updateAudit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governance', 'audits'] });
    },
  });
};

export const useDeleteAudit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => governanceService.deleteAudit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governance', 'audits'] });
    },
  });
};
