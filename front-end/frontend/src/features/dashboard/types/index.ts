// Dashboard Types - Epic 9

// Admin Dashboard Stats
export interface UserRoleStats {
  ADMIN: number;
  HEADHUNTER: number;
  CANDIDATE: number;
}

export interface JobStatusStats {
  OPEN: number;
  CLOSED: number;
  DRAFT: number;
  [key: string]: number;
}

export interface SystemOverviewStats {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  activeHeadhunters: number;
  activeCandidates: number;
}

// Headhunter Dashboard KPIs
export interface HeadhunterKPI {
  totalJobs: number;
  totalApplications: number;
  timeToHire: number; // in days
  hiringSuccess: number; // percentage
}

export interface HiringFunnelData extends ChartDataPoint {
  percentage: number;
}

export interface UpcomingInterview {
  id: string;
  candidateName: string;
  jobTitle: string;
  scheduledDate: string;
  scheduledTime: string;
  interviewType: string;
}

export interface PendingCandidate {
  id: string;
  name: string;
  jobTitle: string;
  status: string;
  submittedDate: string;
}

// Common Dashboard Types
export interface DashboardLoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number | boolean;
}

export interface DashboardFilterOptions {
  jobId?: string;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  roleFilter?: string;
}
