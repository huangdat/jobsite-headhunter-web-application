import { validateToken, logout } from "../services/authApi";

/**
 * Check if user is authenticated by validating token
 * Use this when app loads or on protected routes
 */
export const checkAuth = async () => {
  try {
    const token = localStorage.getItem("accessToken");

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
    localStorage.removeItem("accessToken");
    return null;
  } catch (error) {
    console.error("Auth check failed:", error);
    localStorage.removeItem("accessToken");
    return null;
  }
};

/**
 * Logout user and clear session
 * Use this when user clicks logout button
 */
export const handleLogout = async () => {
  try {
    const token = localStorage.getItem("accessToken");

    if (token) {
      await logout({ token });
    }
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    // Always clear local storage even if API fails
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
  }
};

/**
 * Get current user's token
 */
export const getToken = () => {
  return localStorage.getItem("accessToken");
};

/**
 * Check if user has specific role
 */
export const hasRole = async (requiredRole: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      return false;
    }

    const result = await validateToken({ token });

    return result.valid && result.role === requiredRole;
  } catch {
    return false;
  }
};
