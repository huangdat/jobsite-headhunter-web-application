/**
 * API Wrapper Utility
 * Provides a consistent, type-safe wrapper for all API calls
 * Features:
 * - Automatic error handling (logging + toast)
 * - Consistent response extraction
 * - Type safety
 * - Automatic context logging (service + action)
 *
 * Usage:
 * const user = await apiCall<User>({
 *   endpoint: API_ENDPOINTS.ACCOUNT.GET_PROFILE,
 *   method: 'get',
 *   context: { service: 'auth', action: 'getProfile' },
 * });
 */

import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { apiClient } from "@/shared/utils/axios";
import { handleError } from "@/shared/api/errorHandler";
import { extractResult } from "@/shared/api/responseAdapter";
import type { ApiResponse } from "@/features/auth/types/api.types";

/**
 * Error context for API calls
 */
export interface ApiErrorContext {
  service?: string;
  action?: string;
  silent?: boolean; // Don't show error toast
}

/**
 * API call options
 */
export interface ApiCallOptions {
  /**
   * API endpoint URL
   * @example "/api/users/profile"
   */
  endpoint: string;

  /**
   * HTTP method
   * @default 'get'
   */
  method?: "get" | "post" | "put" | "delete" | "patch";

  /**
   * Request data (for POST, PUT, PATCH)
   */
  data?: unknown;

  /**
   * Query parameters (automatically converted to params)
   */
  queryParams?: Record<string, unknown>;

  /**
   * Error context for logging
   * Helps track which service/action failed
   */
  context?: ApiErrorContext;

  /**
   * Additional axios config options
   */
  headers?: AxiosRequestConfig["headers"];
  timeout?: AxiosRequestConfig["timeout"];
  params?: AxiosRequestConfig["params"];
  responseType?: AxiosRequestConfig["responseType"];
  withCredentials?: AxiosRequestConfig["withCredentials"];
}

/**
 * Main API wrapper function
 * Handles all common patterns: error handling, response extraction, logging
 *
 * @template T - Expected response type
 * @param options - API call configuration
 * @returns Extracted result from response.data.result
 *
 * @example
 * // Simple GET
 * const user = await apiCall<User>({
 *   endpoint: '/api/users/profile',
 *   context: { service: 'users', action: 'getProfile' },
 * });
 *
 * @example
 * // POST with data
 * const result = await apiCall<LoginResult>({
 *   endpoint: '/api/auth/login',
 *   method: 'post',
 *   data: { email, password },
 *   context: { service: 'auth', action: 'login' },
 * });
 *
 * @example
 * // With query parameters
 * const results = await apiCall<SearchResults>({
 *   endpoint: '/api/search',
 *   queryParams: { q: 'javascript', limit: 10 },
 *   context: { service: 'search', action: 'search' },
 * });
 */
export async function apiCall<T = unknown>(
  options: ApiCallOptions
): Promise<T> {
  try {
    const {
      endpoint,
      method = "get",
      data,
      queryParams,
      headers,
      timeout,
      params,
      responseType,
      withCredentials,
    } = options;

    // Build axios config
    const axiosConfig: AxiosRequestConfig = {};

    if (headers) axiosConfig.headers = headers;
    if (timeout) axiosConfig.timeout = timeout;
    if (responseType) axiosConfig.responseType = responseType;
    if (withCredentials !== undefined)
      axiosConfig.withCredentials = withCredentials;

    // Merge query parameters
    if (queryParams || params) {
      axiosConfig.params = { ...params, ...queryParams };
    }

    // Make the API call
    let response: AxiosResponse<ApiResponse<T>>;

    switch (method) {
      case "post":
        response = await apiClient.post<ApiResponse<T>>(
          endpoint,
          data,
          axiosConfig
        );
        break;
      case "put":
        response = await apiClient.put<ApiResponse<T>>(
          endpoint,
          data,
          axiosConfig
        );
        break;
      case "delete":
        response = await apiClient.delete<ApiResponse<T>>(
          endpoint,
          axiosConfig
        );
        break;
      case "patch":
        response = await apiClient.patch<ApiResponse<T>>(
          endpoint,
          data,
          axiosConfig
        );
        break;
      case "get":
      default:
        response = await apiClient.get<ApiResponse<T>>(endpoint, axiosConfig);
        break;
    }

    // Extract and return result
    return extractResult(response);
  } catch (error) {
    // Handle error with context logging
    handleError(error, (options as ApiCallOptions).context);
    throw error;
  }
}

/**
 * Wrapper for GET requests
 * Simplifies the most common case
 */
export async function apiGet<T = unknown>(
  endpoint: string,
  queryParams?: Record<string, unknown>,
  context?: ApiErrorContext
): Promise<T> {
  return apiCall<T>({
    endpoint,
    method: "get",
    queryParams,
    context,
  });
}

/**
 * Wrapper for POST requests
 */
export async function apiPost<T = unknown>(
  endpoint: string,
  data?: unknown,
  context?: ApiErrorContext,
  config?: Omit<ApiCallOptions, "endpoint" | "method" | "data" | "context">
): Promise<T> {
  return apiCall<T>({
    endpoint,
    method: "post",
    data,
    context,
    ...config,
  });
}

/**
 * Wrapper for PUT requests
 */
export async function apiPut<T = unknown>(
  endpoint: string,
  data?: unknown,
  context?: ApiErrorContext,
  config?: Omit<ApiCallOptions, "endpoint" | "method" | "data" | "context">
): Promise<T> {
  return apiCall<T>({
    endpoint,
    method: "put",
    data,
    context,
    ...config,
  });
}

/**
 * Wrapper for DELETE requests
 */
export async function apiDelete<T = unknown>(
  endpoint: string,
  context?: ApiErrorContext
): Promise<T> {
  return apiCall<T>({
    endpoint,
    method: "delete",
    context,
  });
}

/**
 * Wrapper for PATCH requests
 */
export async function apiPatch<T = unknown>(
  endpoint: string,
  data?: unknown,
  context?: ApiErrorContext,
  config?: Omit<ApiCallOptions, "endpoint" | "method" | "data" | "context">
): Promise<T> {
  return apiCall<T>({
    endpoint,
    method: "patch",
    data,
    context,
    ...config,
  });
}
