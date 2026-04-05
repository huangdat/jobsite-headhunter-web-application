/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/shared/utils/axios";
import { handleError } from "@/shared/api/errorHandler";
import type { Application, ApiResponse, PaginatedResponse } from "../types";

/**
 * APPL-01: Submit Application
 * Hỗ trợ cả JSON (Profile CV) và FormData (File Upload)
 */
export const submitApplication = async (
  jobId: number,
  data: any
): Promise<Application> => {
  try {
    const isFormData = data instanceof FormData;

    const response = await apiClient.post<ApiResponse<Application>>(
      `/api/jobs/${jobId}/applications`,
      data,
      isFormData
        ? {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        : {
            headers: {
              "Content-Type": "application/json",
            },
          }
    );

    return response.data.result;
  } catch (error) {
    handleError(error, {
      service: "applications",
      action: "submitApplication",
    });
    throw error;
  }
};

/**
 * APPL-02: Get Applications for Job (Headhunter)
 */
export const getApplicationsForJob = async (
  jobId: number,
  params?: any
): Promise<PaginatedResponse<Application>> => {
  const response = await apiClient.get<
    ApiResponse<PaginatedResponse<Application>>
  >(`/api/headhunter/jobs/${jobId}/applications`, { params });
  return response.data.result;
};

/**
 * APPL-02: Get All Applications (Headhunter)
 */
export const getHeadhunterApplications = async (
  params?: any
): Promise<PaginatedResponse<Application>> => {
  const response = await apiClient.get<
    ApiResponse<PaginatedResponse<Application>>
  >(`/api/headhunter/applications`, { params });
  return response.data.result;
};

/**
 * APPL-03: Get Application Detail
 */
export const getApplicationDetail = async (
  id: number
): Promise<Application> => {
  const response = await apiClient.get<ApiResponse<Application>>(
    `/api/headhunter/applications/${id}`
  );
  return response.data.result;
};

/**
 * APPL-03, APPL-05: Update Application Status
 */
export const updateApplicationStatus = async (
  id: number,
  status: string,
  note?: string
): Promise<Application> => {
  const response = await apiClient.patch<ApiResponse<Application>>(
    `/api/headhunter/applications/${id}/status`,
    { status, note }
  );
  return response.data.result;
};

/**
 * APPL-04: Create Interview
 */
export const createInterview = async (
  applicationId: number,
  data: any
): Promise<any> => {
  const response = await apiClient.post<ApiResponse<any>>(`/api/interviews`, {
    applicationId,
    ...data,
  });
  return response.data.result;
};

/**
 * APPL-04: Update Interview
 */
export const updateInterview = async (
  applicationId: number,
  data: any
): Promise<any> => {
  const response = await apiClient.patch<ApiResponse<any>>(
    `/api/headhunter/applications/${applicationId}/interview`,
    data
  );
  return response.data.result;
};

/**
 * APPL-07: Get Candidate Applications
 */
export const getCandidateApplications = async (
  params?: any
): Promise<PaginatedResponse<Application>> => {
  const response = await apiClient.get<
    ApiResponse<PaginatedResponse<Application>>
  >(`/api/candidates/me/applications`, { params });
  return response.data.result;
};

/**
 * Check if candidate can apply for this job
 */
export const validateApplicationEligibility = async (
  jobId: number
): Promise<boolean> => {
  const response = await apiClient.get<ApiResponse<boolean>>(
    `/api/jobs/${jobId}/can-apply`
  );
  return response.data.result;
};

/**
 * Get application by ID - use headhunter endpoint
 */
export const getApplicationById = async (id: number): Promise<Application> => {
  const response = await apiClient.get<ApiResponse<Application>>(
    `/api/headhunter/applications/${id}`
  );
  return response.data.result;
};

/**
 * Fetch current user's CV from profile
 */
export const fetchMyApplications = async (params: any = {}): Promise<any> => {
  try {
    const response = await apiClient.get<ApiResponse<any>>(
      `/api/candidates/me/applications`,
      { params }
    );
    return response.data.result;
  } catch (error) {
    handleError(error, {
      service: "applications",
      action: "fetchMyApplications",
    });
    throw error;
  }
};

export const fetchMyCurrentCV = async (): Promise<any> => {
  try {
    const response = await apiClient.get<ApiResponse<any>>(`/api/cv/myCv`);
    return response.data.result;
  } catch (error) {
    handleError(error, {
      service: "cv",
      action: "fetchMyCurrentCV",
      silent: true,
    });
    return null;
  }
};

export const getInterviewByApplicationId = async (
  applicationId: number
): Promise<any> => {
  try {
    const response = await apiClient.get<ApiResponse<any>>(
      `/api/interviews/application/${applicationId}`
    );
    return response.data.result;
  } catch (error) {
    handleError(error, {
      service: "interviews",
      action: "getInterviewByApplicationId",
    });
    throw error;
  }
};

export const getInterviewById = async (id: number): Promise<any> => {
  try {
    const response = await apiClient.get<ApiResponse<any>>(
      `/api/interviews/${id}`
    );
    return response.data.result;
  } catch (error) {
    handleError(error, {
      service: "interviews",
      action: "getInterviewById",
    });
    throw error;
  }
};

export const cancelApplication = async (id: number): Promise<void> => {
  try {
    // Use PATCH to update status to CANCELLED instead of DELETE
    await apiClient.patch(`/api/headhunter/applications/${id}/status`, {
      status: "CANCELLED",
    });
  } catch (error) {
    handleError(error, {
      service: "applications",
      action: "cancelApplication",
    });
    throw error;
  }
};
