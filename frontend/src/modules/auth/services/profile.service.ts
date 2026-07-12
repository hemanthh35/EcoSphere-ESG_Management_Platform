import apiClient from '@/lib/apiClient';
import type { Profile } from '../types';
import type { ProfileFormData } from '../validation/schemas';

export const profileService = {
  getProfile: async (): Promise<Profile> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: ProfileFormData): Promise<Profile> => {
    const response = await apiClient.put('/auth/profile', data);
    return response.data;
  },

  uploadAvatar: async (file: File): Promise<Profile> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/auth/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
