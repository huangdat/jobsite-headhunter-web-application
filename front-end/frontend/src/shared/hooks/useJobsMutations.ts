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

/**
 * Toggle job status (open/close)
 * Auto-invalidates myJobs cache
 */
export const useToggleJobStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, deadline }: { jobId: number; deadline?: string }) =>
      toggleJobStatus(jobId, deadline),
    onSuccess: () => {
      // Invalidate cached my jobs to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["jobs", "myJobs"] });
    },
  });
};

/**
 * Delete/hide job (soft delete)
 * Auto-invalidates myJobs cache
 */
export const useDeleteJobMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: number) => deleteJobSoft(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", "myJobs"] });
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
      queryClient.invalidateQueries({ queryKey: ["jobs", "savedJobs"] });
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
      queryClient.invalidateQueries({ queryKey: ["jobs", "savedJobs"] });
    },
  });
};

/**
 * Create a new job
 * Auto-invalidates myJobs cache
 */
export const useCreateJobMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: JobFormValues) => createJob(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", "myJobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs", "list"] });
    },
  });
};

/**
 * Update a job
 * Auto-invalidates detail and myJobs cache
 */
export const useUpdateJobMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: JobFormValues }) =>
      updateJob(id, formData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["jobs", "detail", id] });
      queryClient.invalidateQueries({ queryKey: ["jobs", "myJobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs", "list"] });
    },
  });
};
