import { useState, useEffect } from "react";
import type {
  UserRoleStats,
  JobStatusStats,
  SystemOverviewStats,
  DashboardLoadingState,
} from "../../types";
import { adminDashboardApi } from "../../services/dashboardApi";

interface AdminDashboardState extends DashboardLoadingState {
  userRoleStats: UserRoleStats | undefined;
  jobStatusStats: JobStatusStats | undefined;
  systemOverviewStats: SystemOverviewStats | undefined;
}

/**
 * useAdminDashboard
 * Logic gọi API thống kê cho Admin (DASH-06 & DASH-07)
 */
export const useAdminDashboard = () => {
  const [state, setState] = useState<AdminDashboardState>({
    userRoleStats: undefined,
    jobStatusStats: undefined,
    systemOverviewStats: undefined,
    isLoading: false,
    error: null,
  });

  const fetchAdminStats = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const [userRoles, jobStatus, systemOverview] = await Promise.all([
        adminDashboardApi.getUserRoleDistribution(),
        adminDashboardApi.getJobStatusStats(),
        adminDashboardApi.getSystemOverviewStats(),
      ]);

      setState({
        userRoleStats: userRoles,
        jobStatusStats: jobStatus,
        systemOverviewStats: systemOverview,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "An error occurred",
      }));
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  return {
    ...state,
    refetch: fetchAdminStats,
  };
};
