import api from '@/lib/apiClient';
import type {
  ESGPolicy,
  ESGPolicyCreate,
  ESGPolicyUpdate,
  Audit,
  AuditCreate,
  AuditUpdate,
  PaginatedResponse,
  GovernanceQueryParams,
} from '../types/governance';

const BASE = '/api/v1/governance';

export const governanceService = {
  // --- Policies ---
  async getPolicies(params?: GovernanceQueryParams): Promise<PaginatedResponse<ESGPolicy>> {
    const { data } = await api.get(`${BASE}/policies`, { params });
    return data;
  },
  
  async getPolicy(id: string): Promise<ESGPolicy> {
    const { data } = await api.get(`${BASE}/policies/${id}`);
    return data;
  },
  
  async createPolicy(payload: ESGPolicyCreate): Promise<ESGPolicy> {
    const { data } = await api.post(`${BASE}/policies`, payload);
    return data;
  },
  
  async updatePolicy(id: string, payload: ESGPolicyUpdate): Promise<ESGPolicy> {
    const { data } = await api.put(`${BASE}/policies/${id}`, payload);
    return data;
  },
  
  async deletePolicy(id: string): Promise<void> {
    await api.delete(`${BASE}/policies/${id}`);
  },

  // --- Audits ---
  async getAudits(params?: GovernanceQueryParams): Promise<PaginatedResponse<Audit>> {
    const { data } = await api.get(`${BASE}/audits`, { params });
    return data;
  },
  
  async getAudit(id: string): Promise<Audit> {
    const { data } = await api.get(`${BASE}/audits/${id}`);
    return data;
  },
  
  async createAudit(payload: AuditCreate): Promise<Audit> {
    const { data } = await api.post(`${BASE}/audits`, payload);
    return data;
  },
  
  async updateAudit(id: string, payload: AuditUpdate): Promise<Audit> {
    const { data } = await api.put(`${BASE}/audits/${id}`, payload);
    return data;
  },
  
  async deleteAudit(id: string): Promise<void> {
    await api.delete(`${BASE}/audits/${id}`);
  }
};
