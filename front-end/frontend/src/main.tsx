import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppRouter } from "@/app/router";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fetchSkills } from "@/features/jobs/services/jobsApi";
import { jobKeys } from "@/shared/utils/queryKeys";
import { ErrorBoundary } from "@/shared/common-blocks/ErrorBoundary";
import "./i18n/config"; // Initialize i18next

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - data considered fresh
      gcTime: 1000 * 60 * 10, // 10 minutes - keep in memory
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      retry: (failureCount, error: any) => {
        // Don't retry on 404 or 401 errors
        if (
          error?.response?.status === 404 ||
          error?.response?.status === 401
        ) {
          return false;
        }
        // Retry up to 2 times for other errors
        return failureCount < 2;
      },
      refetchOnWindowFocus: true, // Refetch when user returns to tab
      refetchOnReconnect: true, // Refetch when connection restored
      refetchOnMount: false, // Don't auto-refetch on mount if data is fresh
    },
  },
});

// P2-6: Prefetch critical static data on app load
// Skills data is static and used across multiple pages, prefetch immediately
queryClient.prefetchQuery({
  queryKey: jobKeys.skills(),
  queryFn: fetchSkills,
  staleTime: 1000 * 60 * 30, // Match STATIC_DATA_CONFIG
});

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <StrictMode>
          <AuthProvider>
            {/* Global toast notifications */}
            <Toaster position="top-right" richColors closeButton />
            <AppRouter />
          </AuthProvider>
        </StrictMode>
      </QueryClientProvider>
    </BrowserRouter>
  </ErrorBoundary>
);

