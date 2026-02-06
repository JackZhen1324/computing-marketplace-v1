import apiClient from './client';
import { ApiResponse, Inquiry, InquiryFormData } from '../types/api';

export const inquiriesService = {
  async submitInquiry(data: InquiryFormData & { productId?: string }): Promise<Inquiry> {
    const response = await apiClient.post<ApiResponse<Inquiry>>('/inquiries', data);

    return response.data.data;
  },

  async getInquiries(params?: { status?: string; priority?: string }): Promise<Inquiry[]> {
    const response = await apiClient.get<ApiResponse<Inquiry[]>>('/inquiries', {
      params,
    });

    return response.data.data;
  },

  async getInquiryById(id: string): Promise<Inquiry> {
    const response = await apiClient.get<ApiResponse<Inquiry>>(`/inquiries/${id}`);

    return response.data.data;
  },

  async updateInquiry(
    id: string,
    data: Partial<InquiryFormData & { status?: string; priority?: string; notes?: string }>
  ): Promise<Inquiry> {
    const response = await apiClient.put<ApiResponse<Inquiry>>(`/inquiries/${id}`, data);

    return response.data.data;
  },
};
