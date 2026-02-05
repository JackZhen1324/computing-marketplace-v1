import { useState } from 'react';
import { useInquiries } from '../contexts/InquiryContext';
import type { InquiryFormData } from '../types/inquiry';

interface Product {
  id: string;
  name: string;
  category: string;
}

export const useInquiryDialog = () => {
  const { addInquiry } = useInquiries();
  const [visible, setVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const openDialog = (product: Product) => {
    setSelectedProduct(product);
    setVisible(true);
  };

  const closeDialog = () => {
    setVisible(false);
    setSelectedProduct(null);
  };

  const handleSubmit = (data: InquiryFormData) => {
    if (selectedProduct) {
      addInquiry(
        selectedProduct.id,
        selectedProduct.name,
        selectedProduct.category,
        data
      );
    }
  };

  return {
    visible,
    selectedProduct,
    openDialog,
    closeDialog,
    handleSubmit,
  };
};
