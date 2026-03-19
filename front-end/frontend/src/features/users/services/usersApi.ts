import { apiClient } from "@/shared/utils/axios";
import type { UserDetail } from "../types/user.types";
import { API_ENDPOINTS } from "../constants";

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
   * @deprecated Use searchUsers() instead for pagination, filtering, and sorting
   * This endpoint loads all users without pagination which is not scalable
   */
  getUsers: async (): Promise<UserDetail[]> => {
    const res = await apiClient.get<any>(API_ENDPOINTS.USERS.GET_ALL);
    return res.data.result;
  },

  /**
   * Get user by ID
   */
  getUserById: async (userId: string): Promise<UserDetail> => {
    const res = await apiClient.get<any>(API_ENDPOINTS.USERS.GET_BY_ID(userId));
    return res.data.result;
  },

  /**
   * Search users with server-side pagination, filtering, and sorting
   * @param params - Search parameters (all optional)
   * @returns Paginated response with total count and pages
   *
   * Sort format: "field1,asc;field2,desc" (use ; to separate multiple sorts)
   * Valid fields: name, email, role, status, createdAt, etc.
   */
  searchUsers: async (params: {
    page?: number;
    size?: number;
    keyword?: string;
    role?: string;
    status?: string;
    sort?: string;
  }): Promise<PagedResponse<UserDetail>> => {
    const res = await apiClient.get<any>(API_ENDPOINTS.USERS.SEARCH, {
      params,
    });
    return res.data.result;
  },

  /**
   * Soft delete user (lock account, keep data for 30 days)
   * @param userId - User ID to soft delete
   */
  softDeleteUser: async (
    userId: string
  ): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.post<any>(
      API_ENDPOINTS.USERS.SOFT_DELETE(userId)
    );
    return res.data.result;
  },

  /**
   * Hard delete user (permanent deletion, removes all user data)
   * @param userId - User ID to hard delete
   * @throws Error with 409 status when user has related data
   */
  hardDeleteUser: async (
    userId: string
  ): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.delete<any>(
      API_ENDPOINTS.USERS.HARD_DELETE(userId)
    );
    return res.data.result;
  },
};
