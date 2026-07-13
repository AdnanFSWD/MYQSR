import axiosClient from '../../../api/axiosClient';
import type { ApiResponse } from '../../../api/categoryApi';

export interface OrderBill {
  billId: number;
  billNumber: string;
  date: string;
  time: string;
  orderType: 'DINE_IN' | 'TAKE_AWAY';
  paymentMode: 'CASH' | 'UPI' | 'CARD';
  totalItems: number;
  grandTotal: number;
  status: 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface OrderPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedOrdersResponse {
  orders: OrderBill[];
  pagination: OrderPagination;
}

export interface OrderItem {
  id: number;
  menuItemId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderDetails {
  billHeader: {
    billId: number;
    billNumber: string;
    createdAt: string;
    orderType: 'DINE_IN' | 'TAKE_AWAY';
    paymentMode: 'CASH' | 'UPI' | 'CARD';
    status: 'COMPLETED' | 'CANCELLED';
    cancelledAt?: string;
    cancelledBy?: number;
  };
  billItems: OrderItem[];
  subtotal: number;
  discount: number;
  gst: number;
  grandTotal: number;
  restaurant: {
    name: string;
    address: string;
    phone: string;
    footerMessage?: string;
  };
}

export const ordersApi = {
  getOrders: async (filters: {
    page?: number;
    limit?: number;
    date?: string;
    billNumber?: string;
    paymentMode?: string;
    orderType?: string;
    status?: string;
  }): Promise<PaginatedOrdersResponse> => {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.date) params.append('date', filters.date);
    if (filters.billNumber) params.append('billNumber', filters.billNumber);
    if (filters.paymentMode) params.append('paymentMode', filters.paymentMode);
    if (filters.orderType) params.append('orderType', filters.orderType);
    if (filters.status) params.append('status', filters.status);

    const response = await axiosClient.get<ApiResponse<PaginatedOrdersResponse>>('/v1/orders', {
      params,
    });
    return response.data.data;
  },

  getOrderById: async (id: number): Promise<OrderDetails> => {
    const response = await axiosClient.get<ApiResponse<OrderDetails>>(`/v1/orders/${id}`);
    return response.data.data;
  },

  cancelOrder: async (id: number): Promise<void> => {
    await axiosClient.patch<ApiResponse<void>>(`/v1/orders/${id}/cancel`);
  },
};
