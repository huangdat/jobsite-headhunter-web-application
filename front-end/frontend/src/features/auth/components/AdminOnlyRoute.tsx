import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/useAuth";

/**
 * Route component that restricts access to admin users only.
 * Admin role should be 'admin' or contain 'SCOPE_ADMIN' authority.
 *
 * @param children - Child component to render for authorized users
 * @returns Rendered component or redirect to home if not admin
 */
export function AdminOnlyRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Check if user has admin role (backend returns uppercase: 'ADMIN')
  const isAdmin = user?.role === "ADMIN";

  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}
