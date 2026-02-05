export interface Inquiry {
  id: string;
  productId: string;
  productName: string;
  productCategory: string;
  customerName: string;
  contactPhone: string;
  email: string;
  companyName: string;
  interestedProducts: string[];
  specification?: string;
  status: 'pending' | 'contacted' | 'negotiating' | 'closed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  notes?: string;
  assignee?: string;
}

export interface InquiryFormData {
  customerName: string;
  contactPhone: string;
  email: string;
  companyName: string;
  interestedProducts: string[];
  specification?: string;
}
