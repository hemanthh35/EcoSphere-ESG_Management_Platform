import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gamificationService } from '../services/gamificationService';
import type { GamificationQueryParams, ChallengeCreate, ChallengeUpdate } from '../types/gamification';

// --- Challenges ---
export const useChallenges = (params?: GamificationQueryParams) => {
  return useQuery({
    queryKey: ['gamification', 'challenges', params],
    queryFn: () => gamificationService.getChallenges(params),
  });
};

export const useCreateChallenge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ChallengeCreate) => gamificationService.createChallenge(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gamification', 'challenges'] });
    },
  });
};

export const useUpdateChallenge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ChallengeUpdate }) =>
      gamificationService.updateChallenge(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gamification', 'challenges'] });
    },
  });
};

export const useDeleteChallenge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => gamificationService.deleteChallenge(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gamification', 'challenges'] });
    },
  });
};

// --- Leaderboard ---
export const useLeaderboard = (limit?: number) => {
  return useQuery({
    queryKey: ['gamification', 'leaderboard', limit],
    queryFn: () => gamificationService.getLeaderboard(limit),
  });
};
