import { Navigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";

export function GuestOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}
