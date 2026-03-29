/**
 * API Response Adapter Utility
 * Provides helper functions for consistent response handling
 * Eliminates repeated extraction of nested response.data.result pattern
 */

import type { AxiosResponse } from "axios";
import type { ApiResponse } from "@/features/auth/types/api.types";

/**
 * Extract result from API response wrapper
 * Handles the common pattern: response.data.result
 * @example
 * const res = await apiClient.get<ApiResponse<User>>(endpoint);
 * const user = extractResult(res);
 */
export const extractResult = <T>(
  response: AxiosResponse<ApiResponse<T>>
): T => {
  return response.data.result;
};

/**
 * Extract and validate result from API response
 * Throws error if result is undefined
 */
export const extractResultOrThrow = <T>(
  response: AxiosResponse<ApiResponse<T>>,
  errorMessage = "Expected result in API response"
): T => {
  const result = response.data.result;

  if (result === undefined || result === null) {
    throw new Error(errorMessage);
  }

  return result;
};

/**
 * Extract result and apply transformation function
 */
export const extractAndTransform = <T, U>(
  response: AxiosResponse<ApiResponse<T>>,
  transform: (data: T) => U
): U => {
  return transform(response.data.result);
};

/**
 * Extract result with null coalescing (return default if undefined)
 */
export const extractResultWithDefault = <T>(
  response: AxiosResponse<ApiResponse<T>>,
  defaultValue: T
): T => {
  return response.data.result ?? defaultValue;
};

/**
 * Extract full response object (for cases needing status, headers, etc.)
 */
export const extractFullResponse = <T>(
  response: AxiosResponse<ApiResponse<T>>
) => {
  return {
    result: response.data.result,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Handle list/paginated response results
 */
export const extractList = <T>(
  response: AxiosResponse<
    ApiResponse<{
      data: T[];
      total?: number;
      page?: number;
      totalPages?: number;
    }>
  >
) => {
  const result = response.data.result;
  return {
    items: result.data ?? [],
    total: result.total ?? 0,
    page: result.page ?? 1,
    totalPages: result.totalPages ?? 1,
  };
};

/**
 * Handle paginated response with metadata
 */
export const extractPagedResponse = <T>(
  response: AxiosResponse<
    ApiResponse<{
      data: T[];
      totalElements: number;
      page: number;
      size: number;
      totalPages: number;
    }>
  >
) => {
  const result = response.data.result;
  return {
    items: result.data,
    total: result.totalElements,
    page: result.page,
    pageSize: result.size,
    totalPages: result.totalPages,
  };
};

/**
 * Create adapter function for a specific response type
 * @example
 * const getUserAdapter = createResponseAdapter<User>();
 * const user = getUserAdapter(response);
 */
export const createResponseAdapter = <T>() => {
  return (response: AxiosResponse<ApiResponse<T>>): T => {
    return response.data.result;
  };
};

/**
 * Create list adapter function
 */
export const createListAdapter = <T>() => {
  return (
    response: AxiosResponse<
      ApiResponse<{
        data: T[];
        total?: number;
        page?: number;
        totalPages?: number;
      }>
    >
  ) => {
    const result = response.data.result;
    return {
      items: result.data ?? [],
      total: result.total ?? 0,
      page: result.page ?? 1,
      totalPages: result.totalPages ?? 1,
    };
  };
};
