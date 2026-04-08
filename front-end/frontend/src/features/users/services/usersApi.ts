import { apiClient } from "@/shared/utils/axios";
import type {
  UserDetail,
  UserStatus,
  UserRole,
} from "@/features/users/types/user.types";
import { API_ENDPOINTS } from "@/lib/constants";

/**
 * Generic API response wrapper for backend responses
 * @internal - All API responses follow this structure with a nested result property
 */
interface ApiResponse<T> {
  result: T;
  success: boolean;
  message?: string;
}

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
 * - Backend "SUSPENDED" → Frontend "SUSPENDED" (account is disabled/locked)
 * - Backend "PENDING" → Frontend "PENDING" (not yet verified)
 * - Backend "DELETED" → Should not appear in search results
 */
const mapBackendStatus = (backendStatus: string): UserStatus => {
  const statusMap: Record<string, UserStatus> = {
    ACTIVE: "ACTIVE",
    PENDING: "PENDING",
    SUSPENDED: "SUSPENDED",
    DELETED: "DELETED",
  };
  // eslint-disable-next-line security/detect-object-injection
  return statusMap[backendStatus] || "ACTIVE";
};

/**
 * Adapter: Transform backend user response to frontend UserDetail
 * @internal
 *
 * Handles:
 * - Status enum conversion (AccountStatus → UserStatus)
 * - Role conversion: Backend returns roles (Set<String>), convert to single role string
 * - Takes first role from Set, or defaults to "CANDIDATE" if empty
 */
const adaptUserDetail = (backendUser: any): UserDetail => {
  // Backend returns roles as Set<String>, extract first one or default
  let role: UserRole = "CANDIDATE";

  if (
    backendUser.roles &&
    Array.isArray(backendUser.roles) &&
    backendUser.roles.length > 0
  ) {
    // roles is an array/set, take the first one
    const firstRole = backendUser.roles[0];
    if (
      ["ADMIN", "HEADHUNTER", "COLLABORATOR", "CANDIDATE"].includes(firstRole)
    ) {
      role = firstRole as UserRole;
    }
  } else if (backendUser.role) {
    // Fallback if single role field exists
    role = backendUser.role as UserRole;
  }

  return {
    id: backendUser.id,
    fullName: backendUser.fullName,
    email: backendUser.email,
    phone: backendUser.phone,
    username: backendUser.username,
    avatar: backendUser.imageUrl,
    role,
    status: mapBackendStatus(backendUser.status),
    createdAt: backendUser.createdAt,
    loginHistory: backendUser.loginHistory,
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
  backendResp: BackendPagedResponse<UserDetail>
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
    const res = await apiClient.get<ApiResponse<UserDetail[]>>(
      API_ENDPOINTS.USERS.GET_ALL
    );
    return res.data.result;
  },

  /**
   * Get user by ID
   */
  getUserById: async (userId: string): Promise<UserDetail> => {
    const res = await apiClient.get<ApiResponse<UserDetail>>(
      API_ENDPOINTS.USERS.GET_BY_ID.replace("{id}", userId)
    );
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
    company?: string;
    sort?: string;
  }): Promise<PagedResponse<UserDetail>> => {
    const res = await apiClient.get<
      ApiResponse<BackendPagedResponse<UserDetail>>
    >(API_ENDPOINTS.USERS.SEARCH, {
      params,
    });
    // Backend returns { data, totalElements, ... }
    // Frontend expects { items, total, ... }
    return adaptPagedResponse(res.data.result);
  },

  /**
   * Update user account status
   * Unified endpoint for all status changes:
   * - ACTIVE: Unlock/restore account
   * - SUSPENDED: Lock/soft delete account (keep data)
   * - DELETED: Permanent hard delete from database
   * - PENDING: Set to pending status
   *
   * @param userId - User ID to update
   * @param status - Target status from ACCOUNT_STATUS enum
   * @returns Updated user details
   */
  updateUserStatus: async (
    userId: string,
    status: "ACTIVE" | "SUSPENDED" | "DELETED" | "PENDING"
  ): Promise<UserDetail> => {
    const res = await apiClient.put<ApiResponse<UserDetail>>(
      API_ENDPOINTS.USERS.UPDATE_STATUS.replace("{id}", userId),
      {
        status,
      }
    );
    return adaptUserDetail(res.data.result);
  },

  /**
   * Convenience method: Soft delete user (lock account, keep data)
   * Internally uses updateUserStatus with SUSPENDED status
   * @param userId - User ID to soft delete
   */
  softDeleteUser: async (userId: string): Promise<UserDetail> => {
    return usersApi.updateUserStatus(userId, "SUSPENDED");
  },

  /**
   * Convenience method: Hard delete user (permanent deletion)
   * Internally uses updateUserStatus with DELETED status
   * @param userId - User ID to hard delete
   * @throws Error with 409 status when user has related data
   */
  hardDeleteUser: async (userId: string): Promise<UserDetail> => {
    return usersApi.updateUserStatus(userId, "DELETED");
  },

  /**
   * Convenience method: Lock user account
   * Internally uses updateUserStatus with SUSPENDED status
   * @param userId - User ID to lock
   */
  lockUser: async (userId: string): Promise<UserDetail> => {
    return usersApi.updateUserStatus(userId, "SUSPENDED");
  },

  /**
   * Convenience method: Unlock user account
   * Internally uses updateUserStatus with ACTIVE status
   * @param userId - User ID to unlock
   */
  unlockUser: async (userId: string): Promise<UserDetail> => {
    return usersApi.updateUserStatus(userId, "ACTIVE");
  },
};
