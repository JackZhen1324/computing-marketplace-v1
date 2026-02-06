import apiClient from './client';
import { ApiResponse, ProductWithDetails } from '../types/api';

export interface ProductFilters {
  category?: string;
  tags?: string[];
  region?: string;
  search?: string;
}

export const productsService = {
  async getProducts(filters?: ProductFilters): Promise<ProductWithDetails[]> {
    const params: Record<string, string> = {};

    if (filters?.category) params.category = filters.category;
    if (filters?.region) params.region = filters.region;
    if (filters?.search) params.search = filters.search;
    if (filters?.tags?.length) params.tags = filters.tags.join(',');

    const response = await apiClient.get<ApiResponse<ProductWithDetails[]>>('/products', {
      params,
    });

    return response.data.data;
  },

  async getProductById(id: string): Promise<ProductWithDetails> {
    const response = await apiClient.get<ApiResponse<ProductWithDetails>>(`/products/${id}`);

    return response.data.data;
  },

  async getProductsByCategory(category: string): Promise<ProductWithDetails[]> {
    return this.getProducts({ category });
  },
};
