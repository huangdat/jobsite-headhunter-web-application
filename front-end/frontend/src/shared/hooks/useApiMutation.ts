/**
 * Wrapper around React Query mutation with standardized error handling
 * Use this for all API mutations (POST, PUT, PATCH, DELETE)
 */

import { useMutation } from "@tanstack/react-query";
import type {
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import { handleError } from "@/shared/api/errorHandler";
import type { ErrorContext } from "@/shared/api/errorHandler";
import { toast } from "sonner";

export interface ApiMutationOptions<
  TData,
  TVariables,
  TContext = unknown,
> extends Omit<
  UseMutationOptions<TData, Error, TVariables, TContext>,
  "mutationFn" | "onError"
> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  errorContext?: ErrorContext;
  successMessage?: string | ((data: TData) => string);
  errorMessage?: string;
  showSuccessToast?: boolean;
}

/**
 * Enhanced mutation hook with automatic error handling and success toasts
 *
 * @example
 * const loginMutation = useApiMutation({
 *   mutationFn: (data) => loginApi(data),
 *   successMessage: "Login successful!",
 *   errorContext: { service: "auth", action: "login" },
 *   onSuccess: (data) => {
 *     // Navigate to dashboard
 *   }
 * });
 */
export function useApiMutation<
  TData = unknown,
  TVariables = void,
  TContext = unknown,
>(
  options: ApiMutationOptions<TData, TVariables, TContext>
): UseMutationResult<TData, Error, TVariables, TContext> {
  const {
    mutationFn,
    errorContext,
    successMessage,
    showSuccessToast = true,
    onSuccess,
    ...restOptions
  } = options;

  return useMutation<TData, Error, TVariables, TContext>({
    mutationFn,
    onSuccess: (data, variables, context, ...args) => {
      // Show success toast
      if (showSuccessToast && successMessage) {
        const message =
          typeof successMessage === "function"
            ? successMessage(data)
            : successMessage;
        toast.success(message);
      }

      // Call custom onSuccess with all arguments
      onSuccess?.(data, variables, context, ...args);
    },
    onError: (error) => {
      // Handle error with centralized handler
      handleError(error, {
        ...errorContext,
        silent: false, // Always show toast unless specified
      });
    },
    ...restOptions,
  });
}
