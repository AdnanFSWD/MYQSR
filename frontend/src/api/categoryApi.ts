import axiosClient from './axiosClient';

export interface Category {
  id: number;
  code: string;
  name: string;
  displayOrder: number;
  isActive: boolean;
  itemCount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const categoryApi = {
  /**
   * Fetch all categories
   */
  getAll: async (): Promise<Category[]> => {
    const response = await axiosClient.get<ApiResponse<Category[]>>('/v1/categories');
    return response.data.data;
  },

  /**
   * Create a new category
   */
  create: async (data: { code: string; name: string; displayOrder: number; isActive: boolean }): Promise<Category> => {
    const response = await axiosClient.post<ApiResponse<Category>>('/v1/categories', data);
    return response.data.data;
  },

  /**
   * Update an existing category by ID
   */
  update: async (
    id: number,
    data: { code?: string; name?: string; displayOrder?: number; isActive?: boolean }
  ): Promise<Category> => {
    const response = await axiosClient.put<ApiResponse<Category>>(`/v1/categories/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete a category by ID
   */
  delete: async (id: number): Promise<Category> => {
    const response = await axiosClient.delete<ApiResponse<Category>>(`/v1/categories/${id}`);
    return response.data.data;
  },
};
