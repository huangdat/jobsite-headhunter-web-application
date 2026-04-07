import type {
  UserRoleStats,
  JobStatusStats,
  SystemOverviewStats,
  HeadhunterKPI,
  HiringFunnelData,
  UpcomingInterview,
  PendingCandidate,
} from "../types";

// Admin Dashboard APIs
export const adminDashboardApi = {
  getUserRoleDistribution: async (): Promise<UserRoleStats> => {
    throw new Error("Not implemented");
  },

  getJobStatusStats: async (): Promise<JobStatusStats> => {
    throw new Error("Not implemented");
  },

  getSystemOverviewStats: async (): Promise<SystemOverviewStats> => {
    throw new Error("Not implemented");
  },
};

// Headhunter Dashboard APIs
export const headhunterDashboardApi = {
  getHeadhunterKPIs: async (headhunterId: string): Promise<HeadhunterKPI> => {
    void headhunterId;
    throw new Error("Not implemented");
  },

  getHiringFunnel: async (
    headhunterId: string
  ): Promise<HiringFunnelData[]> => {
    void headhunterId;
    throw new Error("Not implemented");
  },

  getUpcomingInterviews: async (
    headhunterId: string
  ): Promise<UpcomingInterview[]> => {
    void headhunterId;
    throw new Error("Not implemented");
  },

  getPendingCandidates: async (
    headhunterId: string
  ): Promise<PendingCandidate[]> => {
    void headhunterId;
    throw new Error("Not implemented");
  },
};
