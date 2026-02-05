import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Inquiry, InquiryFormData } from '../types/inquiry';

interface InquiryContextType {
  inquiries: Inquiry[];
  addInquiry: (productId: string, productName: string, productCategory: string, data: InquiryFormData) => void;
  updateInquiry: (id: string, updates: Partial<Inquiry>) => void;
  deleteInquiry: (id: string) => void;
  getInquiriesByStatus: (status: Inquiry['status']) => Inquiry[];
  getInquiriesByProduct: (productId: string) => Inquiry[];
}

const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

const STORAGE_KEY = 'computing_marketplace_inquiries';

export const InquiryProvider = ({ children }: { children: ReactNode }) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // Load inquiries from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setInquiries(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load inquiries:', error);
      }
    }
  }, []);

  // Save inquiries to localStorage whenever they change
  useEffect(() => {
    if (inquiries.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inquiries));
    }
  }, [inquiries]);

  const addInquiry = (
    productId: string,
    productName: string,
    productCategory: string,
    data: InquiryFormData
  ) => {
    const newInquiry: Inquiry = {
      id: `INQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productId,
      productName,
      productCategory,
      ...data,
      status: 'pending',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setInquiries(prev => [newInquiry, ...prev]);
  };

  const updateInquiry = (id: string, updates: Partial<Inquiry>) => {
    setInquiries(prev =>
      prev.map(inquiry =>
        inquiry.id === id
          ? { ...inquiry, ...updates, updatedAt: new Date().toISOString() }
          : inquiry
      )
    );
  };

  const deleteInquiry = (id: string) => {
    setInquiries(prev => prev.filter(inquiry => inquiry.id !== id));
  };

  const getInquiriesByStatus = (status: Inquiry['status']) => {
    return inquiries.filter(inquiry => inquiry.status === status);
  };

  const getInquiriesByProduct = (productId: string) => {
    return inquiries.filter(inquiry => inquiry.productId === productId);
  };

  return (
    <InquiryContext.Provider
      value={{
        inquiries,
        addInquiry,
        updateInquiry,
        deleteInquiry,
        getInquiriesByStatus,
        getInquiriesByProduct,
      }}
    >
      {children}
    </InquiryContext.Provider>
  );
};

export const useInquiries = () => {
  const context = useContext(InquiryContext);
  if (!context) {
    throw new Error('useInquiries must be used within an InquiryProvider');
  }
  return context;
};
