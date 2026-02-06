import { useState, useEffect, useCallback } from 'react';
import { authService } from '../api/auth';
import { clearAuthTokens, getAccessToken } from '../api/client';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
    error: null,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = getAccessToken();
    // TODO: Verify token and fetch user data
    setState((prev) => ({
      ...prev,
      loading: false,
      isAuthenticated: !!token,
    }));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await authService.login({ email, password });
      setState({
        user: response.user,
        loading: false,
        isAuthenticated: true,
        error: null,
      });
      return response;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Login failed',
      }));
      throw error;
    }
  }, []);

  const register = useCallback(async (data: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    companyName?: string;
  }) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await authService.register(data);
      setState({
        user: response.user,
        loading: false,
        isAuthenticated: true,
        error: null,
      });
      return response;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Registration failed',
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthTokens();
      setState({
        user: null,
        loading: false,
        isAuthenticated: false,
        error: null,
      });
    }
  }, []);

  return {
    ...state,
    login,
    register,
    logout,
  };
};
