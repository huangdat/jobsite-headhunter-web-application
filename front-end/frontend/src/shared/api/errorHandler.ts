/**
 * API Error Handler Utility
 * Provides consistent error handling and normalization across API services
 * Enhanced with toast notifications and structured logging
 */

import type { AxiosError } from "axios";
import { toast } from "sonner";

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

/**
 * Error context for logging and tracking
 */
export interface ErrorContext {
  service?: string;
  action?: string;
  userId?: string;
  silent?: boolean; // Don't show toast
}

/**
 * Log error to console (development) or monitoring service (production)
 */
export function logError(error: ApiErrorDetails, context?: ErrorContext): void {
  const logData = {
    ...error,
    context,
    timestamp: new Date().toISOString(),
  };

  if (import.meta.env.DEV) {
    console.error("🚨 [ErrorHandler]", logData);
  } else {
    // TODO: Send to monitoring service (Sentry, DataDog, etc.)
    // For production, we can add error reporting here
  }
}

/**
 * Show error toast to user based on error type
 */
export function showErrorToast(error: ApiErrorDetails): void {
  const toastConfig = {
    duration: 4000,
  };

  if (error.isNetworkError) {
    toast.error(error.message, {
      ...toastConfig,
      description: "Check your internet connection",
    });
  } else if (error.status === 401) {
    toast.error("Session expired", {
      ...toastConfig,
      description: "Please login again",
    });
  } else if (error.status === 403) {
    toast.error("Access denied", {
      ...toastConfig,
      description: "Contact admin for access",
    });
  } else if (error.isClientError) {
    toast.warning(error.message, toastConfig);
  } else if (error.isServerError) {
    toast.error("Server error", {
      ...toastConfig,
      description: "Please try again later",
    });
  } else {
    toast.error(error.message, toastConfig);
  }
}

/**
 * Main error handler - use this everywhere
 * Combines normalization + logging + toast
 */
export function handleError(
  error: unknown,
  context?: ErrorContext
): ApiErrorDetails & Error {
  const normalized = normalizeApiError(error);

  // Log error
  logError(normalized, context);

  // Show toast unless silent
  if (!context?.silent) {
    showErrorToast(normalized);
  }

  return normalized;
}
