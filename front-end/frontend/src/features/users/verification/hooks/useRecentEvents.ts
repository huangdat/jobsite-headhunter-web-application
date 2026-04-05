import { useState, useCallback, useEffect } from "react";
import { getRecentEvents } from "../services/verificationApi";
import type { RecentEvent } from "../types/verification.types";

export interface UseRecentEventsReturn {
  events: RecentEvent[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch recent verification events
 */
export const useRecentEvents = (
  limit = 10,
  autoFetch = true
): UseRecentEventsReturn => {
  // State management
  const [events, setEvents] = useState<RecentEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch recent events
   */
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getRecentEvents(limit);
      setEvents(response);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to fetch events";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  /**
   * Refetch events
   */
  const refetch = useCallback(async () => {
    await fetchEvents();
  }, [fetchEvents]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchEvents();
    }
  }, [autoFetch, fetchEvents]);

  return {
    events,
    isLoading,
    error,
    refetch,
  };
};
