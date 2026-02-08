export interface DashboardStats {
  quickStats: {
    totalInquiries: number;
    pendingTasks: number;
    conversionRate: number;
    activeProducts: number;
    trends: {
      inquiriesChange: number;
      tasksChange: number;
      conversionChange: number;
    };
  };
}

export interface ConversionData {
  funnel: Array<{
    stage: string;
    count: number;
    conversionRate: number;
  }>;
}

export interface TrendData {
  daily: Array<{
    date: string;
    inquiries: number;
    conversions: number;
  }>;
  weekly: Array<{
    date: string;
    inquiries: number;
    conversions: number;
  }>;
  monthly: Array<{
    date: string;
    inquiries: number;
    conversions: number;
  }>;
}

export interface ProductRankingData {
  topProducts: Array<{
    productId: string;
    productName: string;
    inquiryCount: number;
    conversionCount: number;
    conversionRate: number;
  }>;
}

export interface Task {
  id: string;
  companyName: string;
  customerName: string;
  productName: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'CONTACTED' | 'NEGOTIATING' | 'CLOSED' | 'CANCELLED';
  createdAt: string;
  contactPhone: string;
}

export interface TasksData {
  tasks: Task[];
}

export type TimeRange = 'today' | 'week' | 'month' | 'all';
export type TrendGranularity = 'daily' | 'weekly' | 'monthly';
export type ViewMode = 'kanban' | 'list';
export type SortBy = 'priority' | 'date' | 'status';
