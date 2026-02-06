// Product Types
export interface Product {
  id: string;
  categoryId: string;
  name: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  imageUrl: string | null;
  priceDisplay: string | null;
  source: string | null;
  region: string | null;
  tags: string[];
  cpuMemoryRatio: string | null;
  vcpuRange: string | null;
  baseFreq: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFeature {
  productId: string;
  featureText: string;
  displayOrder: number;
}

export interface ProductSpecification {
  productId: string;
  specLabel: string;
  specValue: string;
  displayOrder: number;
}

export interface ProductPricing {
  id: string;
  productId: string;
  planName: string;
  price: string;
  features: string[];
  displayOrder: number;
}

export interface ProductUseCase {
  productId: string;
  useCase: string;
  displayOrder: number;
}

export interface ProductWithDetails extends Product {
  features: ProductFeature[];
  specifications: ProductSpecification[];
  pricing: ProductPricing[];
  useCases: ProductUseCase[];
}

// Inquiry Types
export interface Inquiry {
  id: string;
  productId: string | null;
  productName: string | null;
  productCategory: string | null;
  customerName: string;
  contactPhone: string;
  email: string | null;
  companyName: string | null;
  interestedProducts: string[];
  specification: string | null;
  status: 'PENDING' | 'CONTACTED' | 'NEGOTIATING' | 'CLOSED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  notes: string | null;
  assigneeId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryFormData {
  customerName: string;
  contactPhone: string;
  email: string;
  companyName: string;
  interestedProducts: string[];
  specification?: string;
}

// Solution Types
export interface Solution {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  highlights: string[];
  architecture: string | null;
  imageUrl: string | null;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SolutionBenefit {
  solutionId: string;
  benefitTitle: string;
  benefitDescription: string | null;
  iconUrl: string | null;
  displayOrder: number;
}

export interface SolutionWithBenefits extends Solution {
  benefits: SolutionBenefit[];
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}
