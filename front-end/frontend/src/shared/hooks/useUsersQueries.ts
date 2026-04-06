import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/features/users/services/usersApi";
import {
  DYNAMIC_DATA_CONFIG,
  SEMI_STATIC_DATA_CONFIG,
} from "@/shared/config/cacheConfig";
import { userKeys } from "@/shared/utils/queryKeys";

/**
 * Search users with pagination and filtering
 * Cache Strategy: DYNAMIC_DATA (2 min stale, 10 min cache)
 * Rationale: User list changes as admins manage accounts
 */
export const useUsersQuery = (
  page: number = 1,
  size: number = 10,
  keyword?: string,
  role?: string,
  status?: string
) => {
  return useQuery({
    queryKey: userKeys.list({ page, size, keyword, role, status }),
    queryFn: () => usersApi.searchUsers({ page, size, keyword, role, status }),
    ...DYNAMIC_DATA_CONFIG,
  });
};

/**
 * Fetch single user by ID
 * Cache Strategy: SEMI_STATIC_DATA (10 min stale, 30 min cache)
 * Rationale: User details update occasionally
 */
export const useUserDetailQuery = (userId: string | null) => {
  return useQuery({
    queryKey: userKeys.detail(userId!),
    queryFn: () => usersApi.getUserById(userId!),
    enabled: userId !== null,
    ...SEMI_STATIC_DATA_CONFIG,
  });
};

/**
 * Update user status (ACTIVE, SUSPENDED, DELETED, PENDING)
 */
export const useUpdateUserStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      userId: string;
      status: "ACTIVE" | "SUSPENDED" | "DELETED" | "PENDING";
    }) => usersApi.updateUserStatus(userId, status),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

/**
 * Soft delete user (lock account, keep data)
 */
export const useSoftDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => usersApi.softDeleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};
