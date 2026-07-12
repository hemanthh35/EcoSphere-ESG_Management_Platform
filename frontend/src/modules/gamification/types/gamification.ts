export const ChallengeDifficulty = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
} as const;
export type ChallengeDifficulty = typeof ChallengeDifficulty[keyof typeof ChallengeDifficulty];

export const ChallengeStatus = {
  ACTIVE: 'ACTIVE',
  UPCOMING: 'UPCOMING',
  COMPLETED: 'COMPLETED',
  ARCHIVED: 'ARCHIVED',
} as const;
export type ChallengeStatus = typeof ChallengeStatus[keyof typeof ChallengeStatus];

export const ParticipationStatus = {
  IN_PROGRESS: 'IN_PROGRESS',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;
export type ParticipationStatus = typeof ParticipationStatus[keyof typeof ParticipationStatus];

export interface Challenge {
  id: string;
  challenge_code: string;
  title: string;
  description: string;
  category_id: string;
  xp_points: number;
  difficulty: ChallengeDifficulty;
  evidence_required: boolean;
  start_date: string;
  end_date?: string;
  status: ChallengeStatus;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface ChallengeCreate {
  challenge_code: string;
  title: string;
  description: string;
  category_id: string;
  xp_points?: number;
  difficulty?: ChallengeDifficulty;
  evidence_required?: boolean;
  start_date: string;
  end_date?: string;
  status?: ChallengeStatus;
}

export interface ChallengeUpdate extends Partial<ChallengeCreate> {}

export interface ChallengeParticipation {
  id: string;
  challenge_id: string;
  employee_id: string;
  progress: number;
  proof_url?: string;
  approval_status: ParticipationStatus;
  xp_awarded: number;
  completed_at?: string;
  created_at: string;
}

export interface LeaderboardEntry {
  employee_id: string;
  full_name: string;
  total_xp: number;
  rank: number;
}

export interface XpTransaction {
  id: string;
  employee_id: string;
  source_type: string;
  source_id?: string;
  xp: number;
  transaction_date: string;
  notes?: string;
}

export interface PaginatedChallengeResponse {
  items: Challenge[];
  total: number;
  skip: number;
  limit: number;
}

export interface GamificationQueryParams {
  skip?: number;
  limit?: number;
  search?: string;
}
