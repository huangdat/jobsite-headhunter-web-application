/**
 * API Mock Helpers
 * Functions to mock API calls with vitest
 */
/* eslint-disable @typescript-eslint/no-explicit-any, security/detect-object-injection */

import { vi } from "vitest";
import type { AxiosInstance, AxiosResponse } from "axios";

/**
 * Mock successful API response
 */
export function mockApiResponse<T>(
  data: T,
  status: number = 200
): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: "OK",
    config: {} as any,
    headers: {},
  };
}

/**
 * Mock API error response
 */
export function mockApiError(
  message: string = "API Error",
  status: number = 500
) {
  const error = new Error(message);
  (error as any).response = {
    status,
    statusText: "Error",
    data: { message },
  };
  return error;
}

/**
 * Mock axios instance with common methods
 */
export function createMockAxiosInstance(): Partial<AxiosInstance> {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  };
}

/**
 * Mock React Query hooks
 */
export const mockReactQuery = {
  useQuery: vi.fn((options) => ({
    data: undefined,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
    ...options,
  })),
  useMutation: vi.fn((options) => ({
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    isPending: false,
    isError: false,
    error: null,
    ...options,
  })),
  useQueries: vi.fn(() => []),
  useInfiniteQuery: vi.fn((options) => ({
    data: undefined,
    isLoading: false,
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    ...options,
  })),
};

/**
 * Mock React Router hooks
 */
export const mockReactRouter = {
  useNavigate: vi.fn(() => vi.fn()),
  useParams: vi.fn(() => ({})),
  useSearchParams: vi.fn(() => [new URLSearchParams(), vi.fn()]),
  useLocation: vi.fn(() => ({
    pathname: "/",
    search: "",
    hash: "",
    state: null,
    key: "default",
  })),
};

/**
 * Mock localStorage
 */
export function createMockLocalStorage() {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
}

/**
 * Mock fetch API
 */
export function mockFetch(
  response: any,
  status: number = 200,
  options?: Partial<Response>
) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(response),
    text: vi.fn().mockResolvedValue(JSON.stringify(response)),
    headers: new Headers(),
    ...options,
  });
}
