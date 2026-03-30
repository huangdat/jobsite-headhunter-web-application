/**
 * Headhunter Applications Management API Service
 * Handles job pipeline, application reviews, and status updates
 */

import { apiClient } from "@/shared/utils/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import type { ApiResponse } from "@/features/auth/types/api.types";

/**
 * Application Status Types
 * MUST match backend ApplicationStatus enum:
 * APPLIED, SCREENING, INTERVIEW, PASSED, REJECTED, CANCELLED
 */
export type ApplicationStatusType =
  | "APPLIED"
  | "SCREENING"
  | "INTERVIEW"
  | "PASSED"
  | "REJECTED"
  | "CANCELLED";

/**
 * Application Data Types
 */
export interface CandidateInfo {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  currentTitle?: string;
  profilePicture?: string;
}

export interface ApplicationListItem {
  id: number;
  candidate: CandidateInfo;
  appliedAt: string;
  status: ApplicationStatusType;
  lastUpdatedAt: string;
  rating?: number;
}

export interface ApplicationDetails extends ApplicationListItem {
  cvUrl?: string;
  coverLetter?: string;
  interviewScheduled: boolean;
  interviewDate?: string;
  notes?: string;
}

export interface ApplicationsPageResponse {
  content: ApplicationListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface UpdateApplicationStatusRequest {
  status: ApplicationStatusType;
  reason?: string; // For rejection reason
  notes?: string; // Internal notes
  rating?: number; // Candidate rating
}

/**
 * Get all applications for a specific job (pipeline view)
 * GET /api/headhunter/jobs/{jobId}/applications
 * Supports filtering by status and keyword search
 */
export const getJobPipeline = async (
  jobId: number,
  params?: {
    page?: number;
    size?: number;
    status?: ApplicationStatusType;
    keyword?: string;
  }
): Promise<ApplicationsPageResponse> => {
  const response = await apiClient.get<ApiResponse<ApplicationsPageResponse>>(
    API_ENDPOINTS.HEADHUNTER.GET_JOB_APPLICATIONS.replace(
      "{jobId}",
      String(jobId)
    ),
    {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 10,
        ...(params?.status && { status: params.status }),
        ...(params?.keyword && { keyword: params.keyword }),
      },
    }
  );

  return response.data.result;
};

/**
 * Get detailed information about a specific application
 * GET /api/headhunter/applications/{id}
 */
export const getApplicationDetail = async (
  applicationId: number
): Promise<ApplicationDetails> => {
  const response = await apiClient.get<ApiResponse<ApplicationDetails>>(
    API_ENDPOINTS.HEADHUNTER.GET_APPLICATION_DETAIL.replace(
      "{id}",
      String(applicationId)
    )
  );

  return response.data.result;
};

/**
 * Update application status (approve, reject, hire, etc.)
 * PATCH /api/headhunter/applications/{id}/status
 */
export const updateApplicationStatus = async (
  applicationId: number,
  data: UpdateApplicationStatusRequest
): Promise<ApplicationDetails> => {
  const response = await apiClient.patch<ApiResponse<ApplicationDetails>>(
    API_ENDPOINTS.HEADHUNTER.UPDATE_APPLICATION_STATUS.replace(
      "{id}",
      String(applicationId)
    ),
    data
  );

  return response.data.result;
};

/**
 * Convenience methods for common status updates
 * MUST align with backend ApplicationStatus enum
 */

/**
 * Move application to screening phase
 */
export const screeningApplication = async (
  applicationId: number,
  notes?: string
): Promise<ApplicationDetails> => {
  return updateApplicationStatus(applicationId, {
    status: "SCREENING",
    notes,
  });
};

/**
 * Schedule interview for candidate (move to INTERVIEW phase)
 */
export const scheduleInterviewPhase = async (
  applicationId: number,
  notes?: string
): Promise<ApplicationDetails> => {
  return updateApplicationStatus(applicationId, {
    status: "INTERVIEW",
    notes,
  });
};

/**
 * Pass/Hire the candidate (move to PASSED phase)
 */
export const passCandidate = async (
  applicationId: number,
  notes?: string
): Promise<ApplicationDetails> => {
  return updateApplicationStatus(applicationId, {
    status: "PASSED",
    notes,
  });
};

/**
 * Reject the application
 */
export const rejectApplication = async (
  applicationId: number,
  reason?: string
): Promise<ApplicationDetails> => {
  return updateApplicationStatus(applicationId, {
    status: "REJECTED",
    reason,
  });
};

/**
 * Cancel the application
 */
export const cancelApplication = async (
  applicationId: number,
  reason?: string
): Promise<ApplicationDetails> => {
  return updateApplicationStatus(applicationId, {
    status: "CANCELLED",
    reason,
  });
};

/**
 * Schedule an interview for a candidate
 * PATCH /api/headhunter/applications/{id}/interview
 */
export const scheduleInterviewFromApplication = async (
  applicationId: number,
  data: {
    interviewDate: string; // ISO datetime format
    interviewType?: "ONLINE" | "OFFLINE";
    location?: string;
    meetingLink?: string;
    notes?: string;
  }
): Promise<ApplicationDetails> => {
  const response = await apiClient.patch(
    API_ENDPOINTS.HEADHUNTER.SCHEDULE_INTERVIEW.replace(
      "{id}",
      String(applicationId)
    ),
    data
  );

  return response.data.result;
};

export default {
  getJobPipeline,
  getApplicationDetail,
  updateApplicationStatus,
  screeningApplication,
  scheduleInterviewPhase,
  passCandidate,
  rejectApplication,
  cancelApplication,
  scheduleInterviewFromApplication,
};
