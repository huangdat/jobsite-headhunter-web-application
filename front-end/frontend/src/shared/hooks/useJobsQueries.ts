import { useQuery } from "@tanstack/react-query";
import {
  fetchSkills,
  getJobs,
  getMyJobs,
  getJobDetail,
  fetchSavedJobs,
} from "@/features/jobs/services/jobsApi";
import type { JobFilterParams } from "@/features/jobs/types";
import {
  STATIC_DATA_CONFIG,
  SEMI_STATIC_DATA_CONFIG,
  DYNAMIC_DATA_CONFIG,
} from "@/shared/config/cacheConfig";
import { jobKeys } from "@/shared/utils/queryKeys";

/**
 * Fetch all available job skills
 * Cache Strategy: STATIC_DATA (30 min stale, 60 min cache)
 * Rationale: Skills rarely change, safe to cache aggressively
 */
export const useSkillsQuery = () => {
  return useQuery({
    queryKey: jobKeys.skills(),
    queryFn: fetchSkills,
    ...STATIC_DATA_CONFIG,
  });
};

/**
 * Fetch jobs list with filters
 * Cache Strategy: DYNAMIC_DATA (2 min stale, 10 min cache)
 * Rationale: Job listings change frequently, need fresher data
 */
export const useJobsQuery = (params: JobFilterParams) => {
  return useQuery({
    queryKey: jobKeys.list(params),
    queryFn: () => getJobs(params),
    ...DYNAMIC_DATA_CONFIG,
  });
};

/**
 * Fetch current user's jobs
 * Cache Strategy: DYNAMIC_DATA (2 min stale, 10 min cache)
 * Rationale: User's own jobs may be edited/deleted frequently
 */
export const useMyJobsQuery = (page = 1, size = 10) => {
  return useQuery({
    queryKey: jobKeys.myJobsPage(page, size),
    queryFn: () => getMyJobs(page, size),
    ...DYNAMIC_DATA_CONFIG,
  });
};

/**
 * Fetch single job detail
 * Cache Strategy: SEMI_STATIC_DATA (10 min stale, 30 min cache)
 * Rationale: Job details update occasionally, balance freshness vs. performance
 */
export const useJobDetailQuery = (id: number | null) => {
  return useQuery({
    queryKey: jobKeys.detail(id!),
    queryFn: () => getJobDetail(id!),
    enabled: id !== null, // Only run query when id is set
    ...SEMI_STATIC_DATA_CONFIG,
  });
};

/**
 * Fetch user's saved jobs
 * Cache Strategy: DYNAMIC_DATA (2 min stale, 10 min cache)
 * Rationale: Saved jobs list changes when user bookmarks/unbookmarks
 */
export const useSavedJobsQuery = (enabled = true) => {
  return useQuery({
    queryKey: jobKeys.savedJobs(),
    queryFn: fetchSavedJobs,
    enabled, // Only run when enabled (e.g., when authenticated)
    ...DYNAMIC_DATA_CONFIG,
  });
};
