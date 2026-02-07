import apiClient from './client';
import { ApiResponse } from '../types/api';

export interface NewsArticle {
  id: string;
  type: 'POLICY' | 'NEWS';
  title: string;
  summary: string | null;
  content: string | null;
  source: string | null;
  publishDate: string | null;
  tag: string | null;
  imageUrl: string | null;
  isPublished: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNewsRequest {
  type: 'POLICY' | 'NEWS';
  title: string;
  summary?: string;
  content?: string;
  source?: string;
  publishDate?: string;
  tag?: string;
  imageUrl?: string;
  isPublished?: boolean;
  displayOrder?: number;
}

export interface UpdateNewsRequest {
  type?: 'POLICY' | 'NEWS';
  title?: string;
  summary?: string;
  content?: string;
  source?: string;
  publishDate?: string;
  tag?: string;
  imageUrl?: string;
  isPublished?: boolean;
  displayOrder?: number;
}

export const newsService = {
  async getNews(params?: { type?: 'POLICY' | 'NEWS' }): Promise<NewsArticle[]> {
    const response = await apiClient.get<ApiResponse<NewsArticle[]>>('/news', {
      params,
    });

    return response.data.data;
  },

  async getNewsById(id: string): Promise<NewsArticle> {
    const response = await apiClient.get<ApiResponse<NewsArticle>>(`/news/${id}`);

    return response.data.data;
  },

  // Admin functions
  async createNews(data: CreateNewsRequest): Promise<NewsArticle> {
    const response = await apiClient.post<ApiResponse<NewsArticle>>('/news', data);
    return response.data.data;
  },

  async updateNews(id: string, data: UpdateNewsRequest): Promise<NewsArticle> {
    const response = await apiClient.put<ApiResponse<NewsArticle>>(`/news/${id}`, data);
    return response.data.data;
  },

  async deleteNews(id: string): Promise<void> {
    await apiClient.delete(`/news/${id}`);
  },
};
