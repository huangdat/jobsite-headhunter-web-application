/**
 * Candidate Applications API Service
 * Handles job application submissions and application history tracking
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
 * Candidate Application Data Types
 */
export interface ApplicationCreateRequest {
  // CV file or ID
  cvId?: number;
  // Application message/cover letter
  message?: string;
  // Additional custom fields based on backend requirements
  [key: string]: unknown;
}

export interface ApplicationResponse {
  id: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  appliedAt: string;
  status: ApplicationStatusType;
  lastUpdatedAt: string;
  interviewScheduled?: boolean;
  interviewDate?: string;
}

export interface ApplicationDetailResponse extends ApplicationResponse {
  jobDescription: string;
  requirements: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  applicationMessage?: string;
  recruiterId: string;
  recruiterName: string;
}

export interface ApplicationsListResponse {
  content: ApplicationResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

/**
 * Apply for a job position
 * POST /api/jobs/{jobId}/applications
 */
export const applyForJob = async (
  jobId: number,
  data: ApplicationCreateRequest
): Promise<ApplicationDetailResponse> => {
  const formData = new FormData();

  // Add fields to form data
  if (data.cvId) {
    formData.append("cvId", String(data.cvId));
  }
  if (data.message) {
    formData.append("message", data.message);
  }

  // Add any additional fields
  Object.entries(data).forEach(([key, value]) => {
    if (key !== "cvId" && key !== "message" && value !== undefined) {
      if (typeof value === "string" || typeof value === "number") {
        formData.append(key, String(value));
      }
    }
  });

  const response = await apiClient.post<ApiResponse<ApplicationDetailResponse>>(
    API_ENDPOINTS.CANDIDATE.APPLY_JOB.replace("{jobId}", String(jobId)),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.result;
};

/**
 * Get all applications submitted by the current candidate
 * GET /api/candidates/me/applications
 * Supports pagination and filtering by status
 */
export const getMyApplications = async (params?: {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: "ASC" | "DESC";
  status?: ApplicationStatusType;
}): Promise<ApplicationsListResponse> => {
  const response = await apiClient.get<ApiResponse<ApplicationsListResponse>>(
    API_ENDPOINTS.CANDIDATE.GET_MY_APPLICATIONS,
    {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 10,
        ...(params?.sortBy && { sortBy: params.sortBy }),
        ...(params?.direction && { direction: params.direction }),
        ...(params?.status && { status: params.status }),
      },
    }
  );

  return response.data.result;
};

/**
 * Convenience method: Get applications with default pagination
 */
export const fetchApplications = async (
  page = 0,
  size = 10
): Promise<ApplicationsListResponse> => {
  return getMyApplications({ page, size });
};

export default {
  applyForJob,
  getMyApplications,
  fetchApplications,
};
