import { apiClient } from "@/shared/utils/axios";
import type { UserDetail } from "../types/user.types";
import { API_ENDPOINTS } from "../constants";

/**
 * Backend response format (different from frontend interface)
 * @internal - This adapter handles backend response transformation
 */
interface BackendPagedResponse<T> {
  data: T[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface PagedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

/**
 * Adapter: Transform backend AccountStatus enum to frontend UserStatus
 * @internal
 *
 * Mapping:
 * - Backend "ACTIVE" → Frontend "ACTIVE"
 * - Backend "SUSPENDED" → Frontend "LOCKED" (account is disabled/locked)
 * - Backend "PENDING" → Frontend "ACTIVE" (not yet verified but usable)
 * - Backend "DELETED" → Should not appear in search results
 */
const mapBackendStatus = (backendStatus: string): "ACTIVE" | "LOCKED" => {
  const statusMap: Record<string, "ACTIVE" | "LOCKED"> = {
    ACTIVE: "ACTIVE",
    PENDING: "ACTIVE", // Treat pending as active for display
    SUSPENDED: "LOCKED", // Backend suspended = frontend locked
    DELETED: "LOCKED", // Fallback for edge cases
  };
  return statusMap[backendStatus] || "ACTIVE";
};

/**
 * Adapter: Transform backend UserDetail to frontend UserDetail
 * @internal
 *
 * Handles:
 * - Status enum conversion (AccountStatus → UserStatus)
 * - Role array handling (backend returns Set<String>, frontend needs single role)
 */
const adaptUserDetail = (backendUser: any): UserDetail => {
  return {
    ...backendUser,
    // Convert backend AccountStatus enum to frontend UserStatus
    status: mapBackendStatus(backendUser.status),
    // If backend returns multiple roles (Set<String>), take first one
    // This assumes business logic: users can have multiple roles but we display primary
    role:
      Array.isArray(backendUser.roles) && backendUser.roles.length > 0
        ? backendUser.roles[0]
        : backendUser.role || "CANDIDATE",
  };
};

/**
 * Adapter: Transform backend response to frontend format
 * @internal
 *
 * Backend returns: { data, totalElements, page, size, totalPages }
 * Frontend expects: { items, total, page, size, totalPages }
 *
 * Also adapts individual user objects within the response.
 */
const adaptPagedResponse = (
  backendResp: BackendPagedResponse<any>
): PagedResponse<UserDetail> => {
  return {
    items: backendResp.data.map(adaptUserDetail),
    total: backendResp.totalElements,
    page: backendResp.page,
    size: backendResp.size,
    totalPages: backendResp.totalPages,
  };
};

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
    // Backend returns { data, totalElements, ... }
    // Frontend expects { items, total, ... }
    return adaptPagedResponse(res.data.result);
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

  /**
   * Lock user account
   * AC1: Lock successfully - Change status to INACTIVE, invalidate refresh token, audit log, send email
   * @param userId - User ID to lock
   * @param data - Lock data with reason, auto-unlock date, email and logout settings
   */
  lockUser: async (
    userId: string,
    data: {
      reason: string;
      autoUnlockDate?: string;
      sendEmail: boolean;
      logoutCurrentSession: boolean;
    }
  ): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.post<any>(
      API_ENDPOINTS.USERS.LOCK(userId),
      data
    );
    return res.data.result;
  },

  /**
   * Unlock user account
   * AC2: Unlock successfully - Change status to ACTIVE, send email, force password change
   * @param userId - User ID to unlock
   * @param data - Unlock data with reason and email/password change settings
   */
  unlockUser: async (
    userId: string,
    data: {
      reason: string;
      sendEmail: boolean;
      requirePasswordChange: boolean;
    }
  ): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.post<any>(
      API_ENDPOINTS.USERS.UNLOCK(userId),
      data
    );
    return res.data.result;
  },
};
