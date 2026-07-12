import api from '@/lib/apiClient';

export interface ESGConfiguration {
  id: string;
  environmental_weight: number;
  social_weight: number;
  governance_weight: number;
  auto_carbon_calculation: boolean;
  evidence_required: boolean;
  auto_badge_award: boolean;
  updated_at: string;
}

export interface NotificationSettings {
  id: string;
  profile_id: string;
  email_alerts: boolean;
  compliance_alerts: boolean;
  challenge_updates: boolean;
  badge_milestones: boolean;
  updated_at: string;
}

export const settingsService = {
  async getESGConfig(): Promise<ESGConfiguration> {
    const { data } = await api.get('/settings/esg');
    return data;
  },

  async updateESGConfig(payload: Omit<ESGConfiguration, 'id' | 'updated_at'>): Promise<ESGConfiguration> {
    const { data } = await api.put('/settings/esg', payload);
    return data;
  },

  async getNotificationSettings(): Promise<NotificationSettings> {
    const { data } = await api.get('/settings/notifications');
    return data;
  },

  async updateNotificationSettings(payload: Omit<NotificationSettings, 'id' | 'profile_id' | 'updated_at'>): Promise<NotificationSettings> {
    const { data } = await api.put('/settings/notifications', payload);
    return data;
  },
};
