import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/features/users/services/usersApi";

/**
 * Search users with pagination and filtering
 */
export const useUsersQuery = (
  page: number = 1,
  size: number = 10,
  keyword?: string,
  role?: string,
  status?: string
) => {
  return useQuery({
    queryKey: ["users", { page, size, keyword, role, status }],
    queryFn: () => usersApi.searchUsers({ page, size, keyword, role, status }),
  });
};

/**
 * Fetch single user by ID
 */
export const useUserDetailQuery = (userId: string | null) => {
  return useQuery({
    queryKey: ["users", "detail", userId],
    queryFn: () => usersApi.getUserById(userId!),
    enabled: userId !== null,
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
      queryClient.invalidateQueries({ queryKey: ["users", "detail", userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
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
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
