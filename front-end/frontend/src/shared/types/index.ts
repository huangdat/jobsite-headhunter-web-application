/**
 * Shared TypeScript Type Definitions
 */

/**
 * Generic paginated response structure from backend
 * Matches Spring Data Page response format
 */
export interface PagedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

/**
 * Generic API response wrapper
 */
export interface APIResponse<T> {
  status?: number | string;
  message?: string;
  result: T;
}

export type { ApiResponse } from "@/features/auth/types/api.types";
