import apiClient from './client';
import { setAuthTokens } from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  companyName?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<{ success: boolean; data: AuthResponse; message: string }>(
      '/auth/login',
      data
    );

    const { accessToken, refreshToken } = response.data.data;
    setAuthTokens(accessToken, refreshToken);

    return response.data.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<{ success: boolean; data: AuthResponse; message: string }>(
      '/auth/register',
      data
    );

    const { accessToken, refreshToken } = response.data.data;
    setAuthTokens(accessToken, refreshToken);

    return response.data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await apiClient.post<{
      success: boolean;
      data: { accessToken: string; refreshToken: string };
    }>('/auth/refresh-token', { refreshToken });

    return response.data.data;
  },
};
