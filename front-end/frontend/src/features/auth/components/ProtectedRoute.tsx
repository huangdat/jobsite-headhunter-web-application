import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "@/features/auth/context/useAuth";

type UserRole = "CANDIDATE" | "HEADHUNTER" | "COLLABORATOR" | "ADMIN";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, isInitializing, user } = useAuth();

  if (isInitializing) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Check role if allowedRoles is specified
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role as UserRole;
    if (!userRole || !allowedRoles.includes(userRole)) {
      // Redirect to home or unauthorized page
      return <Navigate to="/home" replace />;
    }
  }

  return <>{children}</>;
}
