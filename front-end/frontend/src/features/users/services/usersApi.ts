import { apiClient } from "@/shared/utils/axios";
import type { UserDetail } from "../types/user.types";

export interface PagedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export const usersApi = {
  /**
   * Get all users
   */
  getUsers: async (): Promise<UserDetail[]> => {
    const res = await apiClient.get<any>("/api/account");
    return res.data.result;
  },

  /**
   * Get user by ID
   */
  getUserById: async (userId: string): Promise<UserDetail> => {
    const res = await apiClient.get<any>(`/api/account/${userId}`);
    return res.data.result;
  },

  /**
   * Search users with pagination and filters
   */
  searchUsers: async (params: {
    page?: number;
    size?: number;
    keyword?: string;
    role?: string;
    status?: string;
    sort?: string;
  }): Promise<PagedResponse<UserDetail>> => {
    const res = await apiClient.get<any>("/api/account/search", { params });
    return res.data.result;
  },
};
