import { useState, useEffect } from 'react';
import { productsService, ProductFilters } from '../api/products';
import { ProductWithDetails } from '../types/api';

interface UseProductsResult {
  products: ProductWithDetails[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useProducts = (filters?: ProductFilters): UseProductsResult => {
  const [state, setState] = useState<{
    products: ProductWithDetails[];
    loading: boolean;
    error: string | null;
  }>({
    products: [],
    loading: true,
    error: null,
  });

  const fetchProducts = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await productsService.getProducts(filters);
      setState({
        products: data,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setState({
        products: [],
        loading: false,
        error: error.response?.data?.message || 'Failed to fetch products',
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(filters)]);

  return {
    ...state,
    refetch: fetchProducts,
  };
};

export const useProductById = (id: string) => {
  const [state, setState] = useState<{
    product: ProductWithDetails | null;
    loading: boolean;
    error: string | null;
  }>({
    product: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const data = await productsService.getProductById(id);
        setState({
          product: data,
          loading: false,
          error: null,
        });
      } catch (error: any) {
        setState({
          product: null,
          loading: false,
          error: error.response?.data?.message || 'Failed to fetch product',
        });
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return state;
};
