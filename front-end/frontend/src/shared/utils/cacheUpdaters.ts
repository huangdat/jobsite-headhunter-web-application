/**
 * Smart Cache Updaters
 *
 * Helper functions for surgical cache updates in React Query.
 * Instead of invalidating entire query keys (causing refetches),
 * these functions directly update cached data for better performance.
 *
 * Benefits:
 * - No unnecessary network requests
 * - Instant UI updates
 * - Better user experience
 * - Reduced server load
 */

import type { QueryClient } from "@tanstack/react-query";
import { jobKeys } from "./queryKeys";

/**
 * Generic type for paginated responses
 */
interface PaginatedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/**
 * Job interface (minimum fields needed for cache updates)
 */
interface Job {
  id: number;
  status?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/**
 * Update a specific job in the detail cache
 *
 * Usage:
 * ```tsx
 * updateJobDetailCache(queryClient, jobId, (old) => ({
 *   ...old,
 *   status: 'CLOSED'
 * }));
 * ```
 */
export const updateJobDetailCache = (
  queryClient: QueryClient,
  jobId: number,
  updater: (oldJob: Job) => Job
): void => {
  queryClient.setQueryData(
    jobKeys.detail(jobId),
    (oldData: Job | undefined) => {
      if (!oldData) return oldData;
      return updater(oldData);
    }
  );
};

/**
 * Update a specific job across all job list caches
 *
 * Searches through all cached job lists and updates the job wherever it appears.
 * Useful after mutations like toggle status, update job, etc.
 *
 * Usage:
 * ```tsx
 * updateJobInAllLists(queryClient, jobId, (oldJob) => ({
 *   ...oldJob,
 *   status: 'CLOSED'
 * }));
 * ```
 */
export const updateJobInAllLists = (
  queryClient: QueryClient,
  jobId: number,
  updater: (oldJob: Job) => Job
): void => {
  // Update in all job list queries (with any filter params)
  queryClient.setQueriesData(
    { queryKey: jobKeys.lists() },
    (oldData: PaginatedResponse<Job> | undefined) => {
      if (!oldData?.content) return oldData;

      return {
        ...oldData,
        content: oldData.content.map((job) =>
          job.id === jobId ? updater(job) : job
        ),
      };
    }
  );

  // Update in myJobs queries
  queryClient.setQueriesData(
    { queryKey: jobKeys.myJobs() },
    (oldData: PaginatedResponse<Job> | undefined) => {
      if (!oldData?.content) return oldData;

      return {
        ...oldData,
        content: oldData.content.map((job) =>
          job.id === jobId ? updater(job) : job
        ),
      };
    }
  );
};

/**
 * Update job in both detail cache and all list caches
 *
 * Convenience function that combines updateJobDetailCache and updateJobInAllLists.
 * Use this when a mutation changes job data that appears in multiple places.
 *
 * Usage:
 * ```tsx
 * // After toggling job status
 * updateJobEverywhere(queryClient, jobId, (job) => ({
 *   ...job,
 *   status: job.status === 'OPEN' ? 'CLOSED' : 'OPEN'
 * }));
 * ```
 */
export const updateJobEverywhere = (
  queryClient: QueryClient,
  jobId: number,
  updater: (oldJob: Job) => Job
): void => {
  updateJobDetailCache(queryClient, jobId, updater);
  updateJobInAllLists(queryClient, jobId, updater);
};

/**
 * Remove a job from all list caches
 *
 * Useful after soft delete - removes job from UI without refetching.
 *
 * Usage:
 * ```tsx
 * // After deleting a job
 * removeJobFromAllLists(queryClient, jobId);
 * ```
 */
export const removeJobFromAllLists = (
  queryClient: QueryClient,
  jobId: number
): void => {
  // Remove from all job list queries
  queryClient.setQueriesData(
    { queryKey: jobKeys.lists() },
    (oldData: PaginatedResponse<Job> | undefined) => {
      if (!oldData?.content) return oldData;

      return {
        ...oldData,
        content: oldData.content.filter((job) => job.id !== jobId),
        totalElements: Math.max(0, oldData.totalElements - 1),
      };
    }
  );

  // Remove from myJobs queries
  queryClient.setQueriesData(
    { queryKey: jobKeys.myJobs() },
    (oldData: PaginatedResponse<Job> | undefined) => {
      if (!oldData?.content) return oldData;

      return {
        ...oldData,
        content: oldData.content.filter((job) => job.id !== jobId),
        totalElements: Math.max(0, oldData.totalElements - 1),
      };
    }
  );

  // Also invalidate the detail cache (job no longer exists)
  queryClient.removeQueries({ queryKey: jobKeys.detail(jobId) });
};

/**
 * Add or remove job from saved jobs cache
 *
 * Usage:
 * ```tsx
 * // After saving a job
 * updateSavedJobsCache(queryClient, job, 'add');
 *
 * // After unsaving a job
 * updateSavedJobsCache(queryClient, job, 'remove');
 * ```
 */
export const updateSavedJobsCache = (
  queryClient: QueryClient,
  job: Job,
  action: "add" | "remove"
): void => {
  queryClient.setQueryData(
    jobKeys.savedJobs(),
    (oldData: Job[] | undefined) => {
      if (!oldData) {
        return action === "add" ? [job] : [];
      }

      if (action === "add") {
        // Add job if not already in the list
        const exists = oldData.some((j) => j.id === job.id);
        return exists ? oldData : [...oldData, job];
      } else {
        // Remove job from the list
        return oldData.filter((j) => j.id !== job.id);
      }
    }
  );
};

/**
 * Add new job to the beginning of list caches
 *
 * Useful after creating a new job - adds it to lists without refetching.
 *
 * Usage:
 * ```tsx
 * // After creating a job
 * addJobToLists(queryClient, newJob);
 * ```
 */
export const addJobToLists = (queryClient: QueryClient, newJob: Job): void => {
  // Add to general job lists
  queryClient.setQueriesData(
    { queryKey: jobKeys.lists() },
    (oldData: PaginatedResponse<Job> | undefined) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        content: [newJob, ...oldData.content],
        totalElements: oldData.totalElements + 1,
      };
    }
  );

  // Add to myJobs
  queryClient.setQueriesData(
    { queryKey: jobKeys.myJobs() },
    (oldData: PaginatedResponse<Job> | undefined) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        content: [newJob, ...oldData.content],
        totalElements: oldData.totalElements + 1,
      };
    }
  );
};

/**
 * Invalidate only stale job queries
 *
 * More efficient than invalidating all - only refetches queries that are stale.
 * Use this when you want to refresh data but don't need it immediately.
 *
 * Usage:
 * ```tsx
 * // Refresh stale job data in the background
 * invalidateStaleJobQueries(queryClient);
 * ```
 */
export const invalidateStaleJobQueries = (
  queryClient: QueryClient
): Promise<void> => {
  return queryClient.invalidateQueries({
    queryKey: jobKeys.all,
    refetchType: "none", // Don't refetch active queries
  });
};

/**
 * Reset all job-related caches
 *
 * Nuclear option - use sparingly (e.g., after logout).
 *
 * Usage:
 * ```tsx
 * // Clear all job caches
 * resetJobCaches(queryClient);
 * ```
 */
export const resetJobCaches = (queryClient: QueryClient): void => {
  queryClient.removeQueries({ queryKey: jobKeys.all });
};
