/**
 * useAuthUser Hook
 * Convenient hook to access current user and auth utilities
 * Replaces direct localStorage.getItem("userId") calls
 */

import { useAuthStore } from "@/shared/store/authStore";

export function useAuthUser() {
  const { user, isAuthenticated, isLoading, hasRole, logout } = useAuthStore();

  return {
    // User data
    user,
    userId: user?.id || null,
    username: user?.username || null,
    role: user?.role || null,

    // Auth state
    isAuthenticated,
    isLoading,

    // Utilities
    hasRole: (role: string) => hasRole(role),
    isAdmin: () => hasRole("ADMIN"),
    isHeadhunter: () => hasRole("HEADHUNTER"),
    isCandidate: () => hasRole("CANDIDATE"),
    isCollaborator: () => hasRole("COLLABORATOR"),

    // Actions
    logout,
  };
}
