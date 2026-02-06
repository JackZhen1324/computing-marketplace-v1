import apiClient from './client';
import { ApiResponse, SolutionWithBenefits } from '../types/api';

export const solutionsService = {
  async getSolutions(): Promise<SolutionWithBenefits[]> {
    const response = await apiClient.get<ApiResponse<SolutionWithBenefits[]>>('/solutions');

    return response.data.data;
  },

  async getSolutionById(id: string): Promise<SolutionWithBenefits> {
    const response = await apiClient.get<ApiResponse<SolutionWithBenefits>>(`/solutions/${id}`);

    return response.data.data;
  },
};
