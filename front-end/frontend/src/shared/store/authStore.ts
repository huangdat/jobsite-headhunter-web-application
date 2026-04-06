/**
 * Auth State Management (Zustand)
 * Replaces scattered localStorage access with centralized auth state
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  validateToken,
  logout as logoutApi,
} from "@/features/auth/services/authApi";

export interface AuthUser {
  id: string;
  username: string;
  role: string;
  status: string;
}

interface AuthState {
  // State
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
  checkAuth: () => Promise<boolean>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
}

/**
 * Auth Store with localStorage persistence
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      /**
       * Set authenticated user and token
       * Call this after successful login
       */
      setAuth: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      /**
       * Clear auth state
       * Call this on logout or token expiry
       */
      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      /**
       * Validate current token and update state
       * Returns true if valid, false otherwise
       */
      checkAuth: async () => {
        const { token } = get();

        if (!token) {
          get().clearAuth();
          return false;
        }

        set({ isLoading: true });

        try {
          const result = await validateToken({ token });

          if (result.valid) {
            set({
              user: {
                id: result.id,
                username: result.username,
                role: result.role,
                status: result.status,
              },
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          } else {
            get().clearAuth();
            set({ isLoading: false });
            return false;
          }
        } catch {
          get().clearAuth();
          set({ isLoading: false });
          return false;
        }
      },

      /**
       * Logout user and clear session
       */
      logout: async () => {
        const { token } = get();

        try {
          if (token) {
            await logoutApi({ token });
          }
        } catch {
          // Silently continue logout even if API fails
        } finally {
          get().clearAuth();
        }
      },

      /**
       * Check if current user has specific role
       */
      hasRole: (role: string) => {
        const { user, isAuthenticated } = get();
        return isAuthenticated && user?.role === role;
      },
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        // Only persist these fields
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
