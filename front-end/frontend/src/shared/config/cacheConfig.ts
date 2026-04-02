/**
 * Tiered Cache Configuration for React Query
 *
 * Optimizes API caching based on data volatility:
 * - STATIC: Rarely changes (skills, categories, enums)
 * - SEMI_STATIC: Moderate updates (job details, profiles)
 * - DYNAMIC: Frequent changes (lists, search results)
 * - REAL_TIME: Time-sensitive (notifications, status)
 *
 * ============================================
 * REQUEST DEDUPLICATION (Built-in TanStack Query v5)
 * ============================================
 *
 * React Query automatically deduplicates requests:
 * - If multiple components call the same query key simultaneously,
 *   only ONE network request is made
 * - All components receive the same response
 * - No additional configuration needed
 *
 * Example:
 * ```tsx
 * // Component A
 * const { data } = useJobsQuery({ status: 'OPEN' });
 *
 * // Component B (rendered at same time)
 * const { data } = useJobsQuery({ status: 'OPEN' });
 *
 * // Result: Only 1 API call to /api/jobs?status=OPEN
 * ```
 *
 * How to verify:
 * 1. Open DevTools Network tab
 * 2. Navigate to a page with multiple components using same query
 * 3. Check that only 1 network request appears (not N requests for N components)
 *
 * ============================================
 */

import type { UseQueryOptions } from "@tanstack/react-query";

/**
 * STATIC_DATA: For data that rarely changes
 * Examples: Skills, categories, enums, system configurations
 *
 * - staleTime: 30 minutes - Data considered fresh for 30 min
 * - gcTime: 60 minutes - Keep in memory for 1 hour
 * - refetchOnMount: false - Don't refetch on component mount if cached
 * - refetchOnWindowFocus: false - Don't refetch on window focus
 */
export const STATIC_DATA_CONFIG = {
  staleTime: 30 * 60 * 1000, // 30 minutes
  gcTime: 60 * 60 * 1000, // 60 minutes
  refetchOnMount: false,
  refetchOnWindowFocus: false,
} as const;

/**
 * SEMI_STATIC_DATA: For data that updates occasionally
 * Examples: Job details, company profiles, user profiles
 *
 * - staleTime: 10 minutes - Data considered fresh for 10 min
 * - gcTime: 30 minutes - Keep in memory for 30 min
 * - refetchOnMount: false - Don't refetch on every mount (rely on stale time)
 */
export const SEMI_STATIC_DATA_CONFIG = {
  staleTime: 10 * 60 * 1000, // 10 minutes
  gcTime: 30 * 60 * 1000, // 30 minutes
  refetchOnMount: false,
  refetchOnWindowFocus: true,
} as const;

/**
 * DYNAMIC_DATA: For frequently changing data
 * Examples: Job listings, user lists, search results, paginated data
 *
 * - staleTime: 2 minutes - Data considered fresh for 2 min
 * - gcTime: 10 minutes - Keep in memory for 10 min
 * - refetchOnMount: false - Don't refetch on every mount (rely on stale time)
 */
export const DYNAMIC_DATA_CONFIG = {
  staleTime: 2 * 60 * 1000, // 2 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  refetchOnMount: false,
  refetchOnWindowFocus: true,
} as const;

/**
 * REAL_TIME_DATA: For time-sensitive data
 * Examples: Notifications, application status, live updates
 *
 * - staleTime: 30 seconds - Data considered fresh for 30 sec
 * - gcTime: 2 minutes - Keep in memory for 2 min
 * - refetchOnMount: true - Always refetch on mount
 * - refetchOnWindowFocus: true - Refetch when user returns
 */
export const REAL_TIME_DATA_CONFIG = {
  staleTime: 30 * 1000, // 30 seconds
  gcTime: 2 * 60 * 1000, // 2 minutes
  refetchOnMount: true,
  refetchOnWindowFocus: true,
} as const;

/**
 * Helper type for cache configs
 */
export type CacheConfig = Partial<UseQueryOptions>;

/**
 * Export all configs as a single object for easy access
 */
export const CACHE_CONFIGS = {
  STATIC: STATIC_DATA_CONFIG,
  SEMI_STATIC: SEMI_STATIC_DATA_CONFIG,
  DYNAMIC: DYNAMIC_DATA_CONFIG,
  REAL_TIME: REAL_TIME_DATA_CONFIG,
} as const;
