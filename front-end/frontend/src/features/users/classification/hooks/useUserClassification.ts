import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { UserDetail } from "@/features/users/types/user.types";
import type {
  ClassificationGroupData,
  ClassificationGroupBy,
  ClassificationOverviewStats,
} from "@/features/users/classification/types/classification.types";
import { usersApi } from "@/features/users/services/usersApi";
import {
  classifyUsers,
  calculateOverviewStatistics,
} from "@/features/users/classification/utils/classificationUtils";

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

const PAGE_SIZE = 20; // Load users for classification (small page to avoid lag)

/**
 * Hook for managing user classification logic
 * Handles grouping, statistics calculation, and UI state
 */
export const useUserClassification = (): UseUserClassificationReturn => {
  const { t } = useTranslation();
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
  // Removed unused shouldRetry variable

  /**
   * Fetch all users from API
   */
  const fetchAllUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all users (we need all for proper statistics)
      // Note: If backend provides a dedicated classification API, use that instead
      const response = await usersApi.searchUsers({
        page: 1,
        size: PAGE_SIZE,
      });

      setAllUsers(response.items);
    } catch (err) {
      const status = (err as any)?.response?.status;
      let errorMessage = t("messages.failedToLoadUsers");

      // 403 Forbidden - User doesn't have permission
      if (status === 403) {
        errorMessage = t("messages.noPermissionAccess");
      }
      // 401 Unauthorized - Session expired
      else if (status === 401) {
        errorMessage = t("messages.sessionExpiredLoginAgain");
      }
      // Generic error
      else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      console.error("Error fetching users for classification:", err);
      setAllUsers([]);

      // User needs to fix permissions or login again
      if (status === 403 || status === 401) {
        // Skip retry for permission errors
      }
    } finally {
      setLoading(false);
    }
  }, []);

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
   * Fetch users on mount only (infinite loop fix: removed fetchAllUsers from dependencies)
   * This ensures the API is called only once when component mounts, not repeatedly
   */
  useEffect(() => {
    fetchAllUsers();
  }, []);

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
