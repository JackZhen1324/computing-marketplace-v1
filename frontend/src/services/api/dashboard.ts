import axios from 'axios';
import type {
  DashboardStats,
  ConversionData,
  TrendData,
  ProductRankingData,
  TasksData,
  TimeRange,
  TrendGranularity,
  SortBy,
} from '../../types/dashboard';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const dashboardService = {
  getQuickStats: async (timeRange?: TimeRange): Promise<DashboardStats> => {
    const params = timeRange ? { timeRange } : {};
    const response = await axios.get<DashboardStats>(`${API_BASE_URL}/dashboard/stats`, { params });
    return response.data;
  },

  getConversionData: async (timeRange?: TimeRange): Promise<ConversionData> => {
    const response = await axios.get<ConversionData>(`${API_BASE_URL}/dashboard/conversion`, {
      params: { timeRange },
    });
    return response.data;
  },

  getTrendData: async (granularity: TrendGranularity = 'daily'): Promise<TrendData> => {
    const response = await axios.get<TrendData>(`${API_BASE_URL}/dashboard/trends`, {
      params: { granularity },
    });
    return response.data;
  },

  getProductRanking: async (limit = 10, timeRange?: TimeRange): Promise<ProductRankingData> => {
    const response = await axios.get<ProductRankingData>(`${API_BASE_URL}/dashboard/products/rank`, {
      params: { limit, timeRange },
    });
    return response.data;
  },

  getPendingTasks: async (filters?: {
    timeRange?: TimeRange;
    sortBy?: SortBy;
  }): Promise<TasksData> => {
    const response = await axios.get<TasksData>(`${API_BASE_URL}/dashboard/tasks`, {
      params: filters,
    });
    return response.data;
  },

  updateTaskStatus: async (taskId: string, status: string): Promise<any> => {
    const response = await axios.patch(`${API_BASE_URL}/dashboard/tasks/${taskId}`, { status });
    return response.data;
  },
};
