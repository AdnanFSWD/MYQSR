import axiosClient from '../../../api/axiosClient';
import type { ApiResponse } from '../../../api/categoryApi';

export interface DashboardKPIs {
  sales: number;
  orders: number;
  averageOrderValue: number;
  cancelledOrders: number;
}

export interface PaymentSummary {
  cash: number;
  upi: number;
  card: number;
}

export interface TopSellingItem {
  menuItemId: number;
  name: string;
  quantity: number;
  sales: number;
}

export interface HourlySales {
  hour: string;
  sales: number;
}

export interface RecentOrder {
  billId: number;
  billNumber: string;
  time: string;
  orderType: 'DINE_IN' | 'TAKE_AWAY';
  paymentMode: 'CASH' | 'UPI' | 'CARD';
  grandTotal: number;
  status: 'COMPLETED' | 'CANCELLED';
}

export interface DashboardResponse {
  today: DashboardKPIs;
  paymentSummary: PaymentSummary;
  topSellingItems: TopSellingItem[];
  hourlySales: HourlySales[];
  recentOrders: RecentOrder[];
}

export const dashboardApi = {
  getDashboardData: async (): Promise<DashboardResponse> => {
    const response = await axiosClient.get<ApiResponse<DashboardResponse>>('/v1/dashboard');
    return response.data.data;
  },
};
