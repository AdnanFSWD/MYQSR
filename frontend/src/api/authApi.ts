import axiosClient from './axiosClient';
import type { ApiResponse } from './categoryApi';

export interface User {
  id: number;
  name: string;
  username: string;
  role: 'ADMIN' | 'CASHIER' | 'KITCHEN';
}

export interface LoginResponseData {
  user: User;
  accessToken: string;
}

export const authApi = {
  login: async (payload: { username: string; password: string }): Promise<LoginResponseData> => {
    const response = await axiosClient.post<ApiResponse<LoginResponseData>>('/v1/auth/login', payload);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await axiosClient.post<ApiResponse<void>>('/v1/auth/logout');
  },

  changePassword: async (payload: { oldPassword: string; newPassword: string }): Promise<void> => {
    await axiosClient.post<ApiResponse<void>>('/v1/auth/change-password', payload);
  },
};
