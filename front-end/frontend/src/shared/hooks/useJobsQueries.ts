import { useQuery } from "@tanstack/react-query";
import {
  fetchSkills,
  getJobs,
  getMyJobs,
  getJobDetail,
  fetchSavedJobs,
} from "@/features/jobs/services/jobsApi";
import type { JobFilterParams } from "@/features/jobs/types";

/**
 * Fetch all available job skills
 * Cache: 5 minutes
 */
export const useSkillsQuery = () => {
  return useQuery({
    queryKey: ["jobs", "skills"],
    queryFn: fetchSkills,
  });
};

/**
 * Fetch jobs list with filters
 * Cache: 5 minutes
 * Auto-refetch when params change
 */
export const useJobsQuery = (params: JobFilterParams) => {
  return useQuery({
    queryKey: ["jobs", "list", params],
    queryFn: () => getJobs(params),
  });
};

/**
 * Fetch current user's jobs
 * Cache: 5 minutes
 * Auto-refetch when page/size change
 */
export const useMyJobsQuery = (page = 1, size = 10) => {
  return useQuery({
    queryKey: ["jobs", "myJobs", { page, size }],
    queryFn: () => getMyJobs(page, size),
  });
};

/**
 * Fetch single job detail
 * Cache: 10 minutes
 * Auto-refetch when id change
 */
export const useJobDetailQuery = (id: number | null) => {
  return useQuery({
    queryKey: ["jobs", "detail", id],
    queryFn: () => getJobDetail(id!),
    enabled: id !== null, // Only run query when id is set
  });
};

/**
 * Fetch user's saved jobs
 * Cache: 5 minutes
 */
export const useSavedJobsQuery = (enabled = true) => {
  return useQuery({
    queryKey: ["jobs", "savedJobs"],
    queryFn: fetchSavedJobs,
    enabled, // Only run when enabled (e.g., when authenticated)
  });
};
