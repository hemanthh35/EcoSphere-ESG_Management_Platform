import apiClient from '@/lib/apiClient';
import type { LoginFormData, ForgotPasswordFormData, ResetPasswordFormData, PasswordFormData, RegisterFormData } from '../validation/schemas';
import type { LoginResponse } from '../types';

export const authService = {
  login: async (data: LoginFormData): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterFormData): Promise<void> => {
    await apiClient.post('/auth/register', data);
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  forgotPassword: async (data: ForgotPasswordFormData): Promise<void> => {
    await apiClient.post('/auth/forgot-password', data);
  },

  resetPassword: async (data: ResetPasswordFormData & { token: string }): Promise<void> => {
    await apiClient.post('/auth/reset-password', {
      token: data.token,
      new_password: data.password
    });
  },

  changePassword: async (data: PasswordFormData): Promise<void> => {
    await apiClient.put('/auth/change-password', {
      current_password: data.current_password,
      new_password: data.new_password
    });
  }
};
