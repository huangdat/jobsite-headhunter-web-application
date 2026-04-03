import { useState, useEffect, useCallback } from "react";
import type {
  HeadhunterKPI,
  HiringFunnelData,
  UpcomingInterview,
  PendingCandidate,
  DashboardLoadingState,
  DashboardFilterOptions,
} from "../../types";
import { headhunterDashboardApi } from "../../services/dashboardApi";

interface HeadhunterDashboardState extends DashboardLoadingState {
  kpis: HeadhunterKPI | undefined;
  hiringFunnel: HiringFunnelData[] | undefined;
  upcomingInterviews: UpcomingInterview[] | undefined;
  pendingCandidates: PendingCandidate[] | undefined;
}

/**
 * useHeadhunterDashboard
 * Logic Data Isolation (theo cá nhân HH) - DASH-03
 */
export const useHeadhunterDashboard = (
  headhunterId: string,
  filters?: DashboardFilterOptions
) => {
  const [state, setState] = useState<HeadhunterDashboardState>({
    kpis: undefined,
    hiringFunnel: undefined,
    upcomingInterviews: undefined,
    pendingCandidates: undefined,
    isLoading: false,
    error: null,
  });

  const fetchHeadhunterData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const [kpis, funnel, interviews, candidates] = await Promise.all([
        headhunterDashboardApi.getHeadhunterKPIs(headhunterId),
        headhunterDashboardApi.getHiringFunnel(headhunterId),
        headhunterDashboardApi.getUpcomingInterviews(headhunterId),
        headhunterDashboardApi.getPendingCandidates(headhunterId),
      ]);

      setState({
        kpis,
        hiringFunnel: funnel,
        upcomingInterviews: interviews,
        pendingCandidates: candidates,
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
  }, [headhunterId]);

  useEffect(() => {
    if (headhunterId) {
      fetchHeadhunterData();
    }
  }, [headhunterId, filters?.jobId, fetchHeadhunterData]);

  return {
    ...state,
    refetch: fetchHeadhunterData,
  };
};
