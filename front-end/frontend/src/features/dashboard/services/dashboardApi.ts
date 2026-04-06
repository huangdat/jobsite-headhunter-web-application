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
  // DASH-06 & DASH-07: Get system statistics
  getUserRoleDistribution: async (): Promise<UserRoleStats> => {
    // TODO: Implement GET /api/admin/stats/user-roles
    throw new Error("Not implemented");
  },

  getJobStatusStats: async (): Promise<JobStatusStats> => {
    // TODO: Implement GET /api/admin/stats/job-status
    throw new Error("Not implemented");
  },

  getSystemOverviewStats: async (): Promise<SystemOverviewStats> => {
    // TODO: Implement GET /api/admin/stats/system-overview
    throw new Error("Not implemented");
  },
};

// Headhunter Dashboard APIs
export const headhunterDashboardApi = {
  // DASH-03: Get personal performance KPIs
  getHeadhunterKPIs: async (headhunterId: string): Promise<HeadhunterKPI> => {
    // TODO: Implement GET /api/headhunter/dashboard/kpis/:id
    void headhunterId;
    throw new Error("Not implemented");
  },

  getHiringFunnel: async (
    headhunterId: string
  ): Promise<HiringFunnelData[]> => {
    // TODO: Implement GET /api/headhunter/dashboard/hiring-funnel/:id
    void headhunterId;
    throw new Error("Not implemented");
  },

  getUpcomingInterviews: async (
    headhunterId: string
  ): Promise<UpcomingInterview[]> => {
    // TODO: Implement GET /api/headhunter/dashboard/upcoming-interviews/:id
    void headhunterId;
    throw new Error("Not implemented");
  },

  getPendingCandidates: async (
    headhunterId: string
  ): Promise<PendingCandidate[]> => {
    // TODO: Implement GET /api/headhunter/dashboard/pending-candidates/:id
    void headhunterId;
    throw new Error("Not implemented");
  },
};
