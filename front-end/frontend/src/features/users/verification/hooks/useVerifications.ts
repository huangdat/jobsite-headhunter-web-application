/**
 * Hook: useVerifications
 * Manages verification list queries with pagination and filtering
 * PROF-05: Business Verification Admin Module
 */

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import {
  getVerifications,
  getVerificationStats,
} from "../services/verificationApi";
import type {
  Verification,
  VerificationStats,
  PaginatedVerifications,
  VerificationFilters,
} from "../types/verification.types";

export interface UseVerificationsReturn {
  verifications: Verification[];
  stats: VerificationStats | null;
  isLoading: boolean;
  isStatsLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
  filters: VerificationFilters;
  setFilters: (filters: VerificationFilters) => void;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
  refetch: () => Promise<void>;
}

/**
 * Hook to manage verification list with pagination and stats
 */
export const useVerifications = (autoFetch = true): UseVerificationsReturn => {
  const { t } = useAppTranslation();

  // State management
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [stats, setStats] = useState<VerificationStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [filters, setFilters] = useState<VerificationFilters>({
    page: 0,
    size: 10,
  });

  /**
   * Fetch verification list
   */
  const fetchVerifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response: PaginatedVerifications = await getVerifications(filters);
      setVerifications(response.content);
      setPagination({
        page: response.number,
        size: response.size,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
      });
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : t("verification.errors.fetchFailed");
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [filters, t]);

  /**
   * Fetch statistics
   */
  const fetchStats = useCallback(async () => {
    setIsStatsLoading(true);
    try {
      const response = await getVerificationStats();
      setStats(response);
    } catch (err) {
      // Silent fail for stats - not critical
      console.error("Failed to fetch verification stats:", err);
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  /**
   * Handle page change
   */
  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  /**
   * Handle page size change
   */
  const handlePageSizeChange = useCallback((size: number) => {
    setFilters((prev) => ({ ...prev, size, page: 0 })); // Reset to first page
  }, []);

  /**
   * Refetch all data
   */
  const refetch = useCallback(async () => {
    await Promise.all([fetchVerifications(), fetchStats()]);
  }, [fetchVerifications, fetchStats]);

  // Auto-fetch on mount and when filters change
  useEffect(() => {
    if (autoFetch) {
      fetchVerifications();
    }
  }, [autoFetch, fetchVerifications]);

  // Fetch stats on mount
  useEffect(() => {
    if (autoFetch) {
      fetchStats();
    }
  }, [autoFetch, fetchStats]);

  return {
    verifications,
    stats,
    isLoading,
    isStatsLoading,
    error,
    pagination,
    filters,
    setFilters,
    handlePageChange,
    handlePageSizeChange,
    refetch,
  };
};
