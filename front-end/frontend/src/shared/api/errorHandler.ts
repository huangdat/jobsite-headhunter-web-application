/**
 * API Error Handler Utility
 * Provides consistent error handling and normalization across API services
 */

import type { AxiosError } from "axios";

export interface ApiErrorDetails {
  message: string;
  code?: string;
  status?: number;
  data?: unknown;
  isNetworkError: boolean;
  isTimeoutError: boolean;
  isServerError: boolean;
  isClientError: boolean;
  isAxiosError: boolean;
}

/**
 * Normalize API error to consistent format
 */
export const normalizeApiError = (error: unknown): ApiErrorDetails & Error => {
  const axiosError = error as AxiosError;

  if (axiosError.response) {
    // Server responded with error status
    const status = axiosError.response.status;
    const isServerError = status >= 500;
    const isClientError = status >= 400 && status < 500;

    const errorMessage =
      (axiosError.response.data as Record<string, unknown> | undefined)
        ?.message || axiosError.message;

    return Object.assign(
      new Error(typeof errorMessage === "string" ? errorMessage : "API Error"),
      {
        message: errorMessage,
        code: axiosError.code,
        status: axiosError.response.status,
        data: axiosError.response.data,
        isNetworkError: false,
        isTimeoutError: axiosError.code === "ECONNABORTED",
        isServerError,
        isClientError,
        isAxiosError: true,
      }
    ) as ApiErrorDetails & Error;
  } else if (axiosError.request) {
    // Request was made but no response
    return Object.assign(new Error("No response from server"), {
      message: axiosError.message,
      code: axiosError.code,
      isNetworkError: true,
      isTimeoutError: axiosError.code === "ECONNABORTED",
      isServerError: false,
      isClientError: false,
      isAxiosError: true,
    }) as ApiErrorDetails & Error;
  } else if (error instanceof Error) {
    // Something else happened
    return Object.assign(error, {
      message: error.message,
      isNetworkError: false,
      isTimeoutError: false,
      isServerError: false,
      isClientError: false,
      isAxiosError: false,
    }) as ApiErrorDetails & Error;
  }

  return Object.assign(new Error("Unknown error occurred"), {
    message: "Unknown error",
    isNetworkError: false,
    isTimeoutError: false,
    isServerError: false,
    isClientError: false,
    isAxiosError: false,
  }) as ApiErrorDetails & Error;
};

/**
 * Get user-friendly error message from API error
 */
export const getErrorMessage = (
  error: unknown,
  defaultMessage = "An unexpected error occurred"
): string => {
  const normalized = normalizeApiError(error);

  if (normalized.isNetworkError) {
    return "Network connection error. Please check your connection.";
  }

  if (normalized.isTimeoutError) {
    return "Request timeout. Please try again.";
  }

  if (normalized.isServerError) {
    return `Server error: ${normalized.message}`;
  }

  if (normalized.isClientError) {
    return normalized.message || defaultMessage;
  }

  return normalized.message || defaultMessage;
};

/**
 * Check if error is retryable
 */
export const isRetryableError = (error: unknown): boolean => {
  const normalized = normalizeApiError(error);

  // Retry on network errors, timeouts, and 5xx errors
  return (
    normalized.isNetworkError ||
    normalized.isTimeoutError ||
    (normalized.isServerError && normalized.status !== 501)
  );
};

/**
 * Create custom API error class for type-safe error handling
 */
export class ApiError extends Error implements ApiErrorDetails {
  message: string;
  code?: string;
  status?: number;
  data?: unknown;
  isNetworkError: boolean;
  isTimeoutError: boolean;
  isServerError: boolean;
  isClientError: boolean;
  isAxiosError: boolean;

  constructor(details: ApiErrorDetails) {
    super(details.message);
    this.message = details.message;
    this.code = details.code;
    this.status = details.status;
    this.data = details.data;
    this.isNetworkError = details.isNetworkError;
    this.isTimeoutError = details.isTimeoutError;
    this.isServerError = details.isServerError;
    this.isClientError = details.isClientError;
    this.isAxiosError = details.isAxiosError;
    this.name = "ApiError";
  }
}

/**
 * Throw API error if condition fails
 */
export const throwIfError = (error: unknown): never => {
  throw normalizeApiError(error);
};
