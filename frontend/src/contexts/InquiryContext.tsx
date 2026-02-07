import { createContext, useContext, ReactNode } from 'react';
import { message } from 'antd';
import { inquiriesService } from '../services/api/inquiries';
import type { InquiryFormData } from '../types/inquiry';

interface InquiryContextType {
  addInquiry: (productId: string, productName: string, productCategory: string, data: InquiryFormData) => Promise<void>;
}

const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

export const InquiryProvider = ({ children }: { children: ReactNode }) => {
  const addInquiry = async (
    productId: string,
    productName: string,
    productCategory: string,
    data: InquiryFormData
  ) => {
    try {
      await inquiriesService.submitInquiry({
        productId,
        productName,
        productCategory,
        ...data,
      });
      message.success('询价提交成功！我们会尽快联系您');
    } catch (error) {
      console.error('Failed to submit inquiry:', error);
      message.error('提交失败，请稍后重试');
      throw error;
    }
  };

  return (
    <InquiryContext.Provider
      value={{
        addInquiry,
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
