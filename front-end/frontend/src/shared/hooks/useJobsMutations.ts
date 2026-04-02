import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  toggleJobStatus,
  deleteJobSoft,
  saveJobPost,
  removeSavedJob,
  createJob,
  updateJob,
} from "@/features/jobs/services/jobsApi";
import type { JobFormValues } from "@/features/jobs/types";
import { jobKeys } from "@/shared/utils/queryKeys";
import {
  updateJobEverywhere,
  removeJobFromAllLists,
  addJobToLists,
} from "@/shared/utils/cacheUpdaters";

/**
 * Toggle job status (open/close)
 * Uses optimistic update - toggles status immediately
 * Note: Backend returns void, so we optimistically update the status field
 */
export const useToggleJobStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, deadline }: { jobId: number; deadline?: string }) =>
      toggleJobStatus(jobId, deadline),
    onSuccess: (_, { jobId }) => {
      // Optimistic update: toggle status in cache
      updateJobEverywhere(queryClient, jobId, (oldJob) => ({
        ...oldJob,
        status: oldJob.status === "OPEN" ? "CLOSED" : "OPEN",
      }));
      // Instant UI update - status changes immediately
    },
    onError: (_, { jobId }) => {
      // Revert on error by invalidating the cache
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(jobId) });
      queryClient.invalidateQueries({ queryKey: jobKeys.myJobs() });
    },
  });
};

/**
 * Delete/hide job (soft delete)
 * Uses smart cache update - removes job from lists without refetch
 */
export const useDeleteJobMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: number) => deleteJobSoft(jobId),
    onSuccess: (_, jobId) => {
      // Smart update: remove job from all list caches
      removeJobFromAllLists(queryClient, jobId);
      // Instant UI update - job disappears immediately
    },
  });
};

/**
 * Save a job post
 * Auto-invalidates saved jobs cache
 */
export const useSaveJobMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: number) => saveJobPost(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.savedJobs() });
    },
  });
};

/**
 * Remove a saved job
 * Auto-invalidates saved jobs cache
 */
export const useRemoveSavedJobMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: number) => removeSavedJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.savedJobs() });
    },
  });
};

/**
 * Create a new job
 * Uses smart cache update - adds job to lists without refetch
 */
export const useCreateJobMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: JobFormValues) => createJob(formData),
    onSuccess: (newJob) => {
      // Smart update: add new job to all list caches
      addJobToLists(queryClient, newJob);
      // Instant UI update - new job appears immediately in lists
    },
  });
};

/**
 * Update a job
 * Uses smart cache update - updates job everywhere without refetch
 */
export const useUpdateJobMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: JobFormValues }) =>
      updateJob(id, formData),
    onSuccess: (updatedJob, { id }) => {
      // Smart update: update job in detail cache and all lists
      updateJobEverywhere(queryClient, id, () => updatedJob);
      // Instant UI update - changes appear immediately everywhere
    },
  });
};
