import apiClient from './client';
import { ApiResponse, ProductWithDetails } from '../types/api';

export interface ProductFilters {
  category?: string;
  tags?: string[];
  region?: string;
  search?: string;
}

export interface CreateProductRequest {
  id: string;
  categoryId: string;
  name: string;
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  priceDisplay?: string;
  source?: string;
  region?: string;
  tags?: string[];
  cpuMemoryRatio?: string;
  vcpuRange?: string;
  baseFreq?: string;
  features?: string[];
  specifications?: Array<{ label: string; value: string }>;
  pricing?: Array<{ plan: string; price: string; features: string[] }>;
  useCases?: string[];
}

export interface UpdateProductRequest {
  categoryId?: string;
  name?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  priceDisplay?: string;
  source?: string;
  region?: string;
  tags?: string[];
  cpuMemoryRatio?: string;
  vcpuRange?: string;
  baseFreq?: string;
  isActive?: boolean;
  features?: string[];
  specifications?: Array<{ label: string; value: string }>;
  pricing?: Array<{ plan: string; price: string; features: string[] }>;
  useCases?: string[];
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

  // Admin functions
  async createProduct(data: CreateProductRequest): Promise<ProductWithDetails> {
    const response = await apiClient.post<ApiResponse<ProductWithDetails>>('/products', data);
    return response.data.data;
  },

  async updateProduct(id: string, data: UpdateProductRequest): Promise<ProductWithDetails> {
    const response = await apiClient.put<ApiResponse<ProductWithDetails>>(`/products/${id}`, data);
    return response.data.data;
  },

  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  },

  async toggleProductStatus(id: string): Promise<ProductWithDetails> {
    const response = await apiClient.patch<ApiResponse<ProductWithDetails>>(`/products/${id}/status`);
    return response.data.data;
  },
};
