import axiosClient from './axiosClient';
import type { ApiResponse } from './categoryApi';

export interface BillSummary {
  id: number;
  billNumber: string;
  createdAt: string;
  orderType: 'DINE_IN' | 'TAKE_AWAY';
  paymentMode: 'CASH' | 'UPI' | 'CARD';
  totalItems: number;
  grandTotal: number;
  status: 'COMPLETED' | 'CANCELLED';
}

export interface SalesPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedBillsResponse {
  bills: BillSummary[];
  pagination: SalesPagination;
}

export interface BillItem {
  id: number;
  menuItemId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface BillDetails {
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
  billItems: BillItem[];
  subtotal: number;
  discount: number;
  gst: number;
  grandTotal: number;
}

export const salesApi = {
  getBills: async (filters: {
    page?: number;
    limit?: number;
    date?: string;
    billNumber?: string;
    paymentMode?: string;
    orderType?: string;
    status?: string;
  }): Promise<PaginatedBillsResponse> => {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.date) params.append('date', filters.date);
    if (filters.billNumber) params.append('billNumber', filters.billNumber);
    if (filters.paymentMode) params.append('paymentMode', filters.paymentMode);
    if (filters.orderType) params.append('orderType', filters.orderType);
    if (filters.status) params.append('status', filters.status);

    const response = await axiosClient.get<ApiResponse<PaginatedBillsResponse>>('/v1/sales/bills', {
      params,
    });
    return response.data.data;
  },

  getBillById: async (billId: number): Promise<BillDetails> => {
    const response = await axiosClient.get<ApiResponse<BillDetails>>(`/v1/sales/bills/${billId}`);
    return response.data.data;
  },

  cancelBill: async (billId: number): Promise<void> => {
    await axiosClient.patch<ApiResponse<void>>(`/v1/sales/bills/${billId}/cancel`);
  },
};
