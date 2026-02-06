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
};
