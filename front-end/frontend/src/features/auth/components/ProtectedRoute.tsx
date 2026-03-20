import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/useAuth";

type Props = {
  children: React.ReactNode;
  // allowedRoles can be e.g. ["headhunter"] or ["admin","headhunter"]; comparison is case-insensitive
  allowedRoles?: string[];
};

export function ProtectedRoute({ children, allowedRoles }: Props) {
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

  return <>{children}</>;
}
