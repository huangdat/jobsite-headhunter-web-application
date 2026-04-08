import { useState, useCallback, useEffect } from "react";
import { getVerificationStats } from "../services/verificationApi";
import type { VerificationStats } from "../types/verification.types";

export interface UseVerificationStatsReturn {
  stats: VerificationStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch verification statistics
 */
export const useVerificationStats = (
  autoFetch = true
): UseVerificationStatsReturn => {
  // State management
  const [stats, setStats] = useState<VerificationStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch statistics
   */
  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getVerificationStats();
      setStats(response);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to fetch stats";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refetch stats
   */
  const refetch = useCallback(async () => {
    await fetchStats();
  }, [fetchStats]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchStats();
    }
  }, [autoFetch, fetchStats]);

  return {
    stats,
    isLoading,
    error,
    refetch,
  };
};
