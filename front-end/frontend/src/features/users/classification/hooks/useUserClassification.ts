import { useState, useCallback, useEffect } from "react";
import type { UserDetail } from "../../types/user.types";
import type {
  ClassificationGroupData,
  ClassificationGroupBy,
  ClassificationOverviewStats,
} from "../types/classification.types";
import { usersApi } from "../../services/usersApi";
import { useUsersTranslation } from "@/shared/hooks";
import {
  classifyUsers,
  calculateOverviewStatistics,
} from "../utils/classificationUtils";

export interface UseUserClassificationReturn {
  // Data
  groups: ClassificationGroupData[];
  overviewStats: ClassificationOverviewStats;

  // UI State
  loading: boolean;
  error: string | null;
  groupBy: ClassificationGroupBy;

  // Actions
  setGroupBy: (field: ClassificationGroupBy) => void;
  toggleGroup: (groupId: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  refetch: () => Promise<void>;
}

const PAGE_SIZE = 1000; // Load all users for classification (adjust if needed)

/**
 * Extract error message from axios error
 * Handles 403, 401, and generic errors appropriately
 */
const getErrorMessage = (err: any, t: any): string => {
  const status = err?.response?.status;
  const errorCode = err?.response?.data?.errorCode;

  // 403 Forbidden - User doesn't have permission
  if (status === 403 || errorCode === "FORBIDDEN") {
    return t("users.classification.error.permissionDeniedDescription");
  }

  // 401 Unauthorized - Session expired
  if (status === 401 || errorCode === "UNAUTHORIZED") {
    return t("users.classification.error.unauthorizedDescription");
  }

  // Generic error
  return err instanceof Error
    ? err.message
    : t("users.classification.error.loadFailedDescription");
};

/**
 * Hook for managing user classification logic
 * Handles grouping, statistics calculation, and UI state
 */
export const useUserClassification = (): UseUserClassificationReturn => {
  const { t } = useUsersTranslation();

  // Data state
  const [allUsers, setAllUsers] = useState<UserDetail[]>([]);
  const [groups, setGroups] = useState<ClassificationGroupData[]>([]);
  const [overviewStats, setOverviewStats] =
    useState<ClassificationOverviewStats>({
      totalUsers: 0,
      activeRate: 0,
      groupCount: 0,
      totalActiveUsers: 0,
      totalInactiveUsers: 0,
    });

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupBy, setGroupByState] = useState<ClassificationGroupBy>("role");
  const [shouldRetry, setShouldRetry] = useState(true);

  /**
   * Fetch all users from API
   */
  const fetchAllUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setShouldRetry(true);

      // Fetch all users (we need all for proper statistics)
      // Note: If backend provides a dedicated classification API, use that instead
      const response = await usersApi.searchUsers({
        page: 1,
        size: PAGE_SIZE,
      });

      setAllUsers(response.items);
      setShouldRetry(true); // Success - can retry next time if user refreshes
    } catch (err) {
      const status = (err as any)?.response?.status;
      const errorMessage = getErrorMessage(err, t);

      setError(errorMessage);
      console.error("Error fetching users for classification:", err);
      setAllUsers([]);

      // If 403 or 401, don't retry automatically
      // User needs to fix permissions or login again
      if (status === 403 || status === 401) {
        setShouldRetry(false);
      }
    } finally {
      setLoading(false);
    }
  }, [t]);

  /**
   * Reclassify users when groupBy changes or users are fetched
   */
  const reclassifyUsers = useCallback(() => {
    if (allUsers.length === 0) {
      setGroups([]);
      setOverviewStats({
        totalUsers: 0,
        activeRate: 0,
        groupCount: 0,
        totalActiveUsers: 0,
        totalInactiveUsers: 0,
      });
      return;
    }

    // Classify users
    const classified = classifyUsers(allUsers, groupBy);

    // Calculate overview statistics
    const stats = calculateOverviewStatistics(classified);

    setGroups(classified);
    setOverviewStats(stats);
  }, [allUsers, groupBy]);

  /**
   * Fetch users on mount (only if shouldRetry is true)
   */
  useEffect(() => {
    if (shouldRetry) {
      fetchAllUsers();
    }
  }, [fetchAllUsers, shouldRetry]);

  /**
   * Reclassify when groupBy or allUsers changes
   */
  useEffect(() => {
    reclassifyUsers();
  }, [reclassifyUsers]);

  /**
   * Handle groupBy change
   */
  const setGroupBy = useCallback((field: ClassificationGroupBy) => {
    setGroupByState(field);
  }, []);

  /**
   * Toggle group expansion state
   */
  const toggleGroup = useCallback((groupId: string) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? { ...group, isExpanded: !group.isExpanded }
          : group
      )
    );
  }, []);

  /**
   * Expand all groups
   */
  const expandAll = useCallback(() => {
    setGroups((prevGroups) =>
      prevGroups.map((group) => ({ ...group, isExpanded: true }))
    );
  }, []);

  /**
   * Collapse all groups
   */
  const collapseAll = useCallback(() => {
    setGroups((prevGroups) =>
      prevGroups.map((group) => ({ ...group, isExpanded: false }))
    );
  }, []);

  /**
   * Refetch users (allows manual retry even after permission denied)
   */
  const refetch = useCallback(async () => {
    setShouldRetry(true);
    await fetchAllUsers();
  }, [fetchAllUsers]);

  return {
    groups,
    overviewStats,
    loading,
    error,
    groupBy,
    setGroupBy,
    toggleGroup,
    expandAll,
    collapseAll,
    refetch,
  };
};
