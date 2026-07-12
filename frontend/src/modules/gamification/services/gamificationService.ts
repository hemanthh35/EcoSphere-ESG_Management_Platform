import api from '@/lib/apiClient';
import type {
  Challenge,
  ChallengeCreate,
  ChallengeUpdate,
  PaginatedChallengeResponse,
  LeaderboardEntry,
  GamificationQueryParams,
} from '../types/gamification';

const BASE = '/api/v1/gamification';

export const gamificationService = {
  // --- Challenges ---
  async getChallenges(params?: GamificationQueryParams): Promise<PaginatedChallengeResponse> {
    const { data } = await api.get(`${BASE}/challenges`, { params });
    return data;
  },

  async getChallenge(id: string): Promise<Challenge> {
    const { data } = await api.get(`${BASE}/challenges/${id}`);
    return data;
  },

  async createChallenge(payload: ChallengeCreate): Promise<Challenge> {
    const { data } = await api.post(`${BASE}/challenges`, payload);
    return data;
  },

  async updateChallenge(id: string, payload: ChallengeUpdate): Promise<Challenge> {
    const { data } = await api.put(`${BASE}/challenges/${id}`, payload);
    return data;
  },

  async deleteChallenge(id: string): Promise<void> {
    await api.delete(`${BASE}/challenges/${id}`);
  },

  // --- Leaderboard ---
  async getLeaderboard(limit?: number): Promise<LeaderboardEntry[]> {
    const { data } = await api.get(`${BASE}/leaderboard`, { params: { limit } });
    return data;
  },
};
