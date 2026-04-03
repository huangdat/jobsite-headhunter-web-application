import { useAuthStore } from "@/shared/store/authStore";

/**
 * IMPORTANT NAMING CONVENTION:
 *
 * Throughout the auth feature, the field name 'email' in LoginFormData and form state
 * is used to store BOTH username and email for consistency with form handling.
 *
 * - In UI: Users can input either username OR email
 * - In FormData: Stored in 'email' field (historical naming)
 * - When sending to API: Always sent as 'username' field (backend requirement)
 *
 * Example:
 * - User types: "john_doe123" → stored in formData.email
 * - API call: { username: "john_doe123", password: "..." }
 */

/**
 * Check if user is authenticated by validating token
 * Use this when app loads or on protected routes
 *
 * @deprecated Use useAuthStore().checkAuth() instead
 */
export const checkAuth = async () => {
  return useAuthStore
    .getState()
    .checkAuth()
    .then((valid) => {
      if (valid) {
        return useAuthStore.getState().user;
      }
      return null;
    });
};

/**
 * Logout user and clear session
 * Use this when user clicks logout button
 *
 * @deprecated Use useAuthStore().logout() or useAuthUser().logout() instead
 */
export const handleLogout = async () => {
  await useAuthStore.getState().logout();
};

/**
 * Get current user's token
 *
 * @deprecated Use useAuthStore().token instead
 */
export const getToken = () => {
  return useAuthStore.getState().token;
};

/**
 * Check if user has specific role
 *
 * @deprecated Use useAuthStore().hasRole() or useAuthUser().hasRole() instead
 */
export const hasRole = async (requiredRole: string): Promise<boolean> => {
  const isValid = await useAuthStore.getState().checkAuth();
  if (!isValid) return false;

  return useAuthStore.getState().hasRole(requiredRole);
};
