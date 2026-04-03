/**
 * Test Utilities
 * Custom render functions and test helpers
 */
/* eslint-disable react-refresh/only-export-components */

import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

/**
 * Create a new QueryClient for each test
 * Prevents test pollution from shared cache
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries in tests
        gcTime: 0, // Disable cache
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * Test wrapper with all providers
 */
interface AllProvidersProps {
  children: React.ReactNode;
}

export function AllProviders({ children }: AllProvidersProps) {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
}

/**
 * Custom render with providers
 * Use this instead of @testing-library/react render
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

/**
 * Wait for loading to complete
 * Useful for async components
 */
export async function waitForLoadingToFinish() {
  const { waitFor } = await import("@testing-library/react");
  const { expect } = await import("vitest");
  await waitFor(() => {
    const loadingElements = document.querySelectorAll('[aria-busy="true"]');
    expect(loadingElements).toHaveLength(0);
  });
}

// Re-export everything from testing library
export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
