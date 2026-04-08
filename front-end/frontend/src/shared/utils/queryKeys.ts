/**
 * Centralized Query Key Factory
 *
 * Provides type-safe, hierarchical query keys for React Query.
 * Benefits:
 * - Consistent key structure across the app
 * - Type-safe keys with TypeScript
 * - Easy partial invalidation (e.g., invalidate all jobs queries)
 * - Single source of truth for cache keys
 *
 * Usage:
 * ```tsx
 * // In a query hook
 * useQuery({
 *   queryKey: queryKeys.jobs.detail(123),
 *   queryFn: () => getJobDetail(123)
 * });
 *
 * // In a mutation (invalidate all job lists)
 * queryClient.invalidateQueries({
 *   queryKey: queryKeys.jobs.lists()
 * });
 *
 * // Invalidate everything related to jobs
 * queryClient.invalidateQueries({
 *   queryKey: queryKeys.jobs.all
 * });
 * ```
 */

import type { JobFilterParams } from "@/features/jobs/types";

/**
 * Jobs-related query keys
 */
export const jobKeys = {
  /** Base key for all job-related queries: ['jobs'] */
  all: ["jobs"] as const,

  /** All job detail queries: ['jobs', 'detail'] */
  details: () => [...jobKeys.all, "detail"] as const,

  /** Specific job detail: ['jobs', 'detail', id] */
  detail: (id: number) => [...jobKeys.details(), id] as const,

  /** All job list queries: ['jobs', 'list'] */
  lists: () => [...jobKeys.all, "list"] as const,

  /** Specific job list with filters: ['jobs', 'list', params] */
  list: (params: JobFilterParams) => [...jobKeys.lists(), params] as const,

  /** All "my jobs" queries: ['jobs', 'myJobs'] */
  myJobs: () => [...jobKeys.all, "myJobs"] as const,

  /** Specific "my jobs" page: ['jobs', 'myJobs', { page, size }] */
  myJobsPage: (page: number, size: number) =>
    [...jobKeys.myJobs(), { page, size }] as const,

  /** Saved jobs query: ['jobs', 'savedJobs'] */
  savedJobs: () => [...jobKeys.all, "savedJobs"] as const,

  /** Skills query: ['jobs', 'skills'] */
  skills: () => [...jobKeys.all, "skills"] as const,
} as const;

/**
 * Users-related query keys (Admin)
 */
export const userKeys = {
  /** Base key for all user-related queries: ['users'] */
  all: ["users"] as const,

  /** All user list queries: ['users', 'list'] */
  lists: () => [...userKeys.all, "list"] as const,

  /** Specific user list with filters: ['users', 'list', params] */
  list: (params: {
    page?: number;
    size?: number;
    keyword?: string;
    role?: string;
    status?: string;
  }) => [...userKeys.lists(), params] as const,

  /** All user detail queries: ['users', 'detail'] */
  details: () => [...userKeys.all, "detail"] as const,

  /** Specific user detail: ['users', 'detail', userId] */
  detail: (userId: string) => [...userKeys.details(), userId] as const,
} as const;

/**
 * Candidate-related query keys
 */
export const candidateKeys = {
  /** Base key for all candidate-related queries: ['candidate'] */
  all: ["candidate"] as const,

  /** Candidate profile: ['candidate', 'profile'] */
  profile: () => [...candidateKeys.all, "profile"] as const,

  /** Candidate CV: ['candidate', 'cv'] */
  cv: () => [...candidateKeys.all, "cv"] as const,

  /** Candidate applications: ['candidate', 'applications'] */
  applications: () => [...candidateKeys.all, "applications"] as const,
} as const;

/**
 * Collaborator-related query keys
 */
export const collaboratorKeys = {
  /** Base key for all collaborator-related queries: ['collaborator'] */
  all: ["collaborator"] as const,

  /** All commission queries: ['collaborator', 'commission'] */
  commission: () => [...collaboratorKeys.all, "commission"] as const,

  /** Commission profile: ['collaborator', 'commission', 'profile'] */
  commissionProfile: () =>
    [...collaboratorKeys.commission(), "profile"] as const,

  /** Commission stats: ['collaborator', 'commission', 'stats'] */
  commissionStats: () => [...collaboratorKeys.commission(), "stats"] as const,
} as const;

/**
 * Applications-related query keys
 */
export const applicationKeys = {
  /** Base key for all application-related queries: ['applications'] */
  all: ["applications"] as const,

  /** All application lists: ['applications', 'list'] */
  lists: () => [...applicationKeys.all, "list"] as const,

  /** Applications for specific job: ['applications', 'list', 'job', jobId] */
  forJob: (jobId: number) =>
    [...applicationKeys.lists(), "job", jobId] as const,

  /** Headhunter's all applications: ['applications', 'list', 'headhunter'] */
  headhunter: () => [...applicationKeys.lists(), "headhunter"] as const,

  /** Candidate's applications: ['applications', 'list', 'candidate'] */
  candidate: () => [...applicationKeys.lists(), "candidate"] as const,

  /** All application details: ['applications', 'detail'] */
  details: () => [...applicationKeys.all, "detail"] as const,

  /** Specific application: ['applications', 'detail', id] */
  detail: (id: number) => [...applicationKeys.details(), id] as const,
} as const;

/**
 * Interview-related query keys
 */
export const interviewKeys = {
  /** Base key for all interview-related queries: ['interviews'] */
  all: ["interviews"] as const,

  /** Interviews for application: ['interviews', 'application', applicationId] */
  forApplication: (applicationId: number) =>
    [...interviewKeys.all, "application", applicationId] as const,
} as const;

/**
 * Combined export of all query keys
 */
export const queryKeys = {
  jobs: jobKeys,
  users: userKeys,
  candidate: candidateKeys,
  collaborator: collaboratorKeys,
  applications: applicationKeys,
  interviews: interviewKeys,
} as const;
