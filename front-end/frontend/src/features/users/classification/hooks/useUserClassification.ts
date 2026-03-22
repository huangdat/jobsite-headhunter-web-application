import { useState, useCallback, useEffect } from "react";
import type { UserDetail } from "../../types/user.types";
import type {
  ClassificationGroupData,
  ClassificationGroupBy,
  ClassificationOverviewStats,
} from "../types/classification.types";
import { usersApi } from "../../services/usersApi";
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

const PAGE_SIZE = 20; // Load users for classification (small page to avoid lag)

/**
 * Hook for managing user classification logic
 * Handles grouping, statistics calculation, and UI state
 */
export const useUserClassification = (): UseUserClassificationReturn => {
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
      let errorMessage = "Failed to load users";
      
      // 403 Forbidden - User doesn't have permission
      if (status === 403) {
        errorMessage = "You do not have permission to access the classification feature.";
      }
      // 401 Unauthorized - Session expired
      else if (status === 401) {
        errorMessage = "Your session has expired. Please login again.";
      }
      // Generic error
      else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      console.error("Error fetching users for classification:", err);
      setAllUsers([]);
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
   * Fetch users on mount
   */
  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

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
