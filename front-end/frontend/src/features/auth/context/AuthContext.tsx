import { createContext, useCallback, useEffect, useState } from "react";

import {
  logout as logoutRequest,
  validateToken,
} from "@/features/auth/services/authApi";

const ACCESS_TOKEN_KEY = "accessToken";
const AUTH_USER_KEY = "authUser";

export interface AuthSession {
  id: string;
  username: string;
  role: string;
  status: string;
}

interface AuthContextValue {
  user: AuthSession | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  refreshAuth: () => Promise<AuthSession | null>;
  signIn: (accessToken: string) => Promise<AuthSession | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const clearAuthStorage = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthSession | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const refreshAuth = useCallback(async () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (!token) {
      clearAuthStorage();
      setUser(null);
      return null;
    }

    try {
      console.debug(
        // eslint-disable-next-line custom/no-hardcoded-strings
        "[Auth] refreshAuth: validating token (masked):",
        token ? `${token.slice(0, 8)}...${token.slice(-8)}` : null
      );
      const result = await validateToken({ token });
      console.debug(
        // eslint-disable-next-line custom/no-hardcoded-strings
        "[Auth] refreshAuth: validateToken result:",
        result
      );

      if (!result?.valid) {
        clearAuthStorage();
        setUser(null);
        return null;
      }

      const normalizedRole = result.role
        ? result.role.replace(/^roles\./i, "").toUpperCase()
        : result.role;

      const nextUser: AuthSession = {
        id: result.id,
        username: result.username,
        role: normalizedRole,
        status: result.status,
      };

      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
      setUser(nextUser);
      return nextUser;
    } catch {
      console.error(
        // eslint-disable-next-line custom/no-hardcoded-strings
        "[Auth] refreshAuth: validateToken failed, clearing auth storage"
      );
      clearAuthStorage();
      setUser(null);
      return null;
    }
  }, []);

  const signIn = useCallback(
    async (accessToken: string) => {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      return refreshAuth();
    },
    [refreshAuth]
  );

  const signOut = useCallback(async () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    try {
      if (token) {
        await logoutRequest({ token });
      }
    } catch {
      // Clear client session even if server-side logout fails.
    } finally {
      clearAuthStorage();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let active = true;

    refreshAuth().finally(() => {
      if (active) {
        setIsInitializing(false);
      }
    });

    const handleStorage = () => {
      void refreshAuth();
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      active = false;
      window.removeEventListener("storage", handleStorage);
    };
  }, [refreshAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isInitializing,
        refreshAuth,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
