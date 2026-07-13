import axiosClient from '../../../api/axiosClient';
import type { ApiResponse } from '../../../api/categoryApi';

export interface CheckoutPayload {
  orderType: 'DINE_IN' | 'TAKE_AWAY';
  paymentMode: 'CASH' | 'UPI' | 'CARD';
  discountType: 'PERCENTAGE' | 'AMOUNT';
  discountValue: number;
  items: {
    menuItemId: number;
    quantity: number;
  }[];
}

export interface CheckoutResponseData {
  billId: number;
  billNumber: string;
  createdAt: string;
  orderType: 'DINE_IN' | 'TAKE_AWAY';
  paymentMode: 'CASH' | 'UPI' | 'CARD';
  subtotal: number;
  discount: number;
  gst: number;
  grandTotal: number;
  items: {
    menuItemId: number;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  receipt?: any;
}

export const checkoutApi = {
  /**
   * Submit pos checkout order
   */
  checkoutOrder: async (payload: CheckoutPayload): Promise<CheckoutResponseData> => {
    const response = await axiosClient.post<ApiResponse<CheckoutResponseData>>('/v1/pos/checkout', payload);
    return response.data.data;
  },
};
