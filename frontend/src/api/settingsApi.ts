import axiosClient from './axiosClient';
import type { ApiResponse } from './categoryApi';

export interface SettingsData {
  id: number;
  restaurantName: string;
  phone: string;
  email: string;
  gstNumber: string;
  fssaiNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstPercentage: number;
  currency: string;
  roundOffBills: boolean;
  defaultPaymentMode: 'CASH' | 'UPI' | 'CARD';
  billPrefix: string;
  receiptHeader?: string;
  receiptFooter?: string;
  printerWidth: number;
  timezone: string;
  dateFormat: string;
  timeFormat: '12-hour' | '24-hour';
}

export const settingsApi = {
  getSettings: async (): Promise<SettingsData> => {
    const response = await axiosClient.get<ApiResponse<SettingsData>>('/v1/settings');
    return response.data.data;
  },

  updateSettings: async (data: Partial<SettingsData>): Promise<SettingsData> => {
    const response = await axiosClient.put<ApiResponse<SettingsData>>('/v1/settings', data);
    return response.data.data;
  },
};
