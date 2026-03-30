import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppRouter } from "@/app/router";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./i18n/config"; // Initialize i18next

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});

createRoot(document.getElementById("root")!).render(
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
);
