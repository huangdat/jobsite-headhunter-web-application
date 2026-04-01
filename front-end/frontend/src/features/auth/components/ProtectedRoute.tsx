import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/context/useAuth";

type UserRole = "CANDIDATE" | "HEADHUNTER" | "COLLABORATOR" | "ADMIN";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[] | string[];
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

  if (allowedRoles && allowedRoles.length > 0) {
    const role = (user?.role ?? "").toString().toLowerCase();
    const allowed = allowedRoles.map((r) => r.toString().toLowerCase());

    if (!allowed.includes(role)) {
      return <Navigate to="/home" replace />;
    }
  }

  return children;
}
