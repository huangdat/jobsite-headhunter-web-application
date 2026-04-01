import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import type {
  Application,
  ApplicationFilterParams,
  PaginatedResponse,
} from "../types";
import {
  getApplicationsForJob,
  getHeadhunterApplications,
  getCandidateApplications,
} from "../services/applicationsApi";

interface UseApplicationsOptions {
  jobId?: number;
  isCandidateView?: boolean;
  autoFetch?: boolean;
}

export const useApplications = (options: UseApplicationsOptions = {}) => {
  const { jobId, isCandidateView = false, autoFetch = true } = options;

  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  });

  /**
   * Fetch applications
   */
  const fetchApplications = useCallback(
    async (params?: ApplicationFilterParams) => {
      setIsLoading(true);
      setError(null);
      try {
        let response: PaginatedResponse<Application>;
        const apiParams = params as Record<string, unknown> | undefined;

        if (isCandidateView) {
          response = await getCandidateApplications(apiParams);
        } else if (jobId) {
          response = await getApplicationsForJob(jobId, apiParams);
        } else {
          response = await getHeadhunterApplications(apiParams);
        }

        setApplications(response.content);
        setPagination({
          page: response.number,
          size: response.size,
          totalPages: response.totalPages,
          totalElements: response.totalElements,
        });
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to fetch applications";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [jobId, isCandidateView]
  );

  /**
   * Handle page change
   */
  const handlePageChange = useCallback(
    (newPage: number) => {
      fetchApplications({ page: newPage });
    },
    [fetchApplications]
  );

  /**
   * Handle page size change
   */
  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      fetchApplications({ page: 0, size: newSize });
    },
    [fetchApplications]
  );

  /**
   * Filter and search
   */
  const handleFilter = useCallback(
    (filters: ApplicationFilterParams) => {
      fetchApplications({ ...filters, page: 0 });
    },
    [fetchApplications]
  );

  /**
   * Refresh applications
   */
  const refetch = useCallback(() => {
    fetchApplications({
      page: pagination.page,
      size: pagination.size,
    });
  }, [fetchApplications, pagination]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchApplications();
    }
  }, [autoFetch, fetchApplications]);

  return {
    applications,
    isLoading,
    error,
    pagination,
    fetchApplications,
    handlePageChange,
    handlePageSizeChange,
    handleFilter,
    refetch,
  };
};
