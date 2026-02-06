import apiClient from './client';
import { ApiResponse } from '../types/api';

export interface NavigationItem {
  id: string;
  label: string;
  path: string | null;
  parentId: string | null;
  icon: string | null;
  displayOrder: number;
  isVisible: boolean;
  requiresAuth: boolean;
  allowedRoles: string[] | null;
  createdAt: string;
  updatedAt: string;
  children?: NavigationItem[];
}

export const navigationService = {
  async getNavigation(): Promise<NavigationItem[]> {
    const response = await apiClient.get<ApiResponse<NavigationItem[]>>('/navigation');

    return response.data.data;
  },
};
