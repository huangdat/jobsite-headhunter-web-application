import { validateToken, logout } from "../services/authApi";

const ACCESS_TOKEN_KEY = "accessToken";
const AUTH_USER_KEY = "authUser";

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
 */
export const checkAuth = async () => {
  try {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (!token) {
      return null;
    }

    const result = await validateToken({ token });

    if (result.valid) {
      return {
        id: result.id,
        username: result.username,
        role: result.role,
        status: result.status,
      };
    }

    // Token is invalid, clear storage
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    return null;
  } catch (error) {
    console.error("Auth check failed:", error);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    return null;
  }
};

/**
 * Logout user and clear session
 * Use this when user clicks logout button
 */
export const handleLogout = async () => {
  try {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (token) {
      await logout({ token });
    }
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    // Always clear local storage even if API fails
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  }
};

/**
 * Get current user's token
 */
export const getToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Check if user has specific role
 */
export const hasRole = async (requiredRole: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (!token) {
      return false;
    }

    const result = await validateToken({ token });

    return result.valid && result.role === requiredRole;
  } catch {
    return false;
  }
};
