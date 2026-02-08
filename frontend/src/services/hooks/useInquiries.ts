import { useState, useEffect } from 'react';
import { inquiriesService } from '../api/inquiries';

interface UseInquiriesResult {
  inquiries: any[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useInquiries = (params?: { status?: string; priority?: string }): UseInquiriesResult => {
  const [state, setState] = useState<{
    inquiries: any[];
    loading: boolean;
    error: string | null;
  }>({
    inquiries: [],
    loading: true,
    error: null,
  });

  const fetchInquiries = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await inquiriesService.getInquiries(params);
      setState({
        inquiries: data,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setState({
        inquiries: [],
        loading: false,
        error: error.response?.data?.message || 'Failed to fetch inquiries',
      });
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [JSON.stringify(params)]);

  return {
    ...state,
    refetch: fetchInquiries,
  };
};
