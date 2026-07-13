import axiosClient from './axiosClient';
import type { ApiResponse } from './categoryApi';

export interface MenuItem {
  id: number;
  code: string;
  categoryId: number;
  name: string;
  shortCode: string;
  description?: string | null;
  price: number;
  image: string;
  isAvailable: boolean;
  displayOrder: number;
}

export const menuItemApi = {
  /**
   * Fetch all available menu items
   */
  getAvailable: async (): Promise<MenuItem[]> => {
    const response = await axiosClient.get<ApiResponse<MenuItem[]>>('/v1/menu-items/available');
    return response.data.data;
  },

  /**
   * Fetch all menu items
   */
  getAll: async (): Promise<MenuItem[]> => {
    const response = await axiosClient.get<ApiResponse<MenuItem[]>>('/v1/menu-items');
    return response.data.data;
  },

  /**
   * Fetch menu items by category ID
   */
  getByCategory: async (categoryId: number): Promise<MenuItem[]> => {
    const response = await axiosClient.get<ApiResponse<MenuItem[]>>(`/v1/menu-items/category/${categoryId}`);
    return response.data.data;
  },
};
