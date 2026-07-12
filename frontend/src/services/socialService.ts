import apiClient from '@/lib/apiClient';
import type { CsrActivity, EmployeeParticipation, DiversityMetric, TrainingRecord } from '@/modules/social/types/social.types';

const BASE = '/api/v1/social';

export const socialApi = {
  // CSR Activities
  listActivities: async (): Promise<CsrActivity[]> => {
    const res = await apiClient.get<CsrActivity[]>(`${BASE}/activities`);
    return res.data;
  },

  getActivity: async (id: string): Promise<CsrActivity> => {
    const res = await apiClient.get<CsrActivity>(`${BASE}/activities/${id}`);
    return res.data;
  },

  createActivity: async (payload: Partial<CsrActivity>): Promise<CsrActivity> => {
    const res = await apiClient.post<CsrActivity>(`${BASE}/activities`, payload);
    return res.data;
  },

  updateActivity: async (id: string, payload: Partial<CsrActivity>): Promise<CsrActivity> => {
    const res = await apiClient.put<CsrActivity>(`${BASE}/activities/${id}`, payload);
    return res.data;
  },

  deleteActivity: async (id: string): Promise<void> => {
    await apiClient.delete(`${BASE}/activities/${id}`);
  },

  // Employee Participation
  joinActivity: async (activityId: string): Promise<EmployeeParticipation> => {
    const res = await apiClient.post<EmployeeParticipation>(`${BASE}/activities/${activityId}/join`);
    return res.data;
  },

  getActivityParticipation: async (activityId: string): Promise<EmployeeParticipation[]> => {
    const res = await apiClient.get<EmployeeParticipation[]>(`${BASE}/activities/${activityId}/participation`);
    return res.data;
  },

  getEmployeeParticipation: async (employeeId: string): Promise<EmployeeParticipation[]> => {
    const res = await apiClient.get<EmployeeParticipation[]>(`${BASE}/employees/${employeeId}/participation`);
    return res.data;
  },

  approveParticipation: async (participationId: string, status: 'APPROVED' | 'REJECTED', points: number): Promise<EmployeeParticipation> => {
    const res = await apiClient.put<EmployeeParticipation>(`${BASE}/participation/${participationId}/approve`, {
      approval_status: status,
      points_earned: points,
    });
    return res.data;
  },

  // Diversity Metrics
  listDiversityMetrics: async (): Promise<DiversityMetric[]> => {
    const res = await apiClient.get<DiversityMetric[]>(`${BASE}/diversity`);
    return res.data;
  },

  createDiversityMetric: async (payload: Partial<DiversityMetric>): Promise<DiversityMetric> => {
    const res = await apiClient.post<DiversityMetric>(`${BASE}/diversity`, payload);
    return res.data;
  },

  // Training Records
  listTrainingRecords: async (): Promise<TrainingRecord[]> => {
    const res = await apiClient.get<TrainingRecord[]>(`${BASE}/training`);
    return res.data;
  },

  getEmployeeTrainingRecords: async (employeeId: string): Promise<TrainingRecord[]> => {
    const res = await apiClient.get<TrainingRecord[]>(`${BASE}/employees/${employeeId}/training`);
    return res.data;
  },

  createTrainingRecord: async (payload: Partial<TrainingRecord>): Promise<TrainingRecord> => {
    const res = await apiClient.post<TrainingRecord>(`${BASE}/training`, payload);
    return res.data;
  },

  updateTrainingRecord: async (id: string, payload: Partial<TrainingRecord>): Promise<TrainingRecord> => {
    const res = await apiClient.put<TrainingRecord>(`${BASE}/training/${id}`, payload);
    return res.data;
  },
};
