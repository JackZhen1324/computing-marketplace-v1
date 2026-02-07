import apiClient from './client';
import { ApiResponse, SolutionWithBenefits } from '../types/api';

export interface CreateSolutionRequest {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  highlights?: string[];
  architecture?: string;
  imageUrl?: string;
  features?: any;
  isActive?: boolean;
}

export interface UpdateSolutionRequest {
  title?: string;
  subtitle?: string;
  description?: string;
  highlights?: string[];
  architecture?: string;
  imageUrl?: string;
  features?: any;
  isActive?: boolean;
}

export const solutionsService = {
  async getSolutions(): Promise<SolutionWithBenefits[]> {
    const response = await apiClient.get<ApiResponse<SolutionWithBenefits[]>>('/solutions');

    return response.data.data;
  },

  async getSolutionById(id: string): Promise<SolutionWithBenefits> {
    const response = await apiClient.get<ApiResponse<SolutionWithBenefits>>(`/solutions/${id}`);

    return response.data.data;
  },

  // Admin functions
  async createSolution(data: CreateSolutionRequest): Promise<SolutionWithBenefits> {
    const response = await apiClient.post<ApiResponse<SolutionWithBenefits>>('/solutions', data);
    return response.data.data;
  },

  async updateSolution(id: string, data: UpdateSolutionRequest): Promise<SolutionWithBenefits> {
    const response = await apiClient.put<ApiResponse<SolutionWithBenefits>>(`/solutions/${id}`, data);
    return response.data.data;
  },

  async deleteSolution(id: string): Promise<void> {
    await apiClient.delete(`/solutions/${id}`);
  },
};
