/**
 * Business Profile API Service
 * Handles all API calls for PROF-03 Business Profile & Verification
 * ✅ Uses shared apiClient with centralized auth & error handling
 */

import { apiClient } from "@/shared/utils/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { cachedApiCall } from "@/shared/utils/apiCache";
import type {
  BusinessProfile,
  SubmittedDocument,
  VerificationStep,
  ProfileStrengthData,
  SubmitProfileRequest,
  SubmitProfileResponse,
  GetProfileStatusResponse,
  ValidateFieldResponse,
  ValidateFieldRequest,
  ValidateFieldRequest2,
} from "../types/business.types";
import type { ApiResponse } from "@/features/auth/types/api.types";

/**
 * Submit Business Profile for Verification
 * POST /api/business/profile/submit
 */
export const submitProfile = async (
  data: SubmitProfileRequest
): Promise<SubmitProfileResponse> => {
  const formData = new FormData();

  formData.append("companyName", data.companyName);
  formData.append("taxId", data.taxId);
  formData.append("companySize", data.companySize);
  formData.append("website", data.website);
  formData.append("headquartersAddress", data.headquartersAddress);

  // Add documents if provided
  if (data.documents && data.documents.length > 0) {
    data.documents.forEach((doc, index) => {
      formData.append(`documents[${index}]`, doc);
    });
  }

  const response = await apiClient.post<ApiResponse<SubmitProfileResponse>>(
    API_ENDPOINTS.BUSINESS.SUBMIT_PROFILE,
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
 * Get Business Profile Status & Details
 * GET /api/business/profile/status
 */
export const getProfileStatus = async (): Promise<GetProfileStatusResponse> => {
  return cachedApiCall(
    "business-profile-status",
    async () => {
      const response = await apiClient.get<
        ApiResponse<GetProfileStatusResponse>
      >(API_ENDPOINTS.BUSINESS.GET_STATUS);
      return response.data.result;
    },
    { ttl: 300000 } // Cache for 5 minutes
  );
};

/**
 * Get Profile Strength Data
 * GET /api/business/profile/strength
 */
export const getProfileStrength = async (): Promise<ProfileStrengthData> => {
  return cachedApiCall(
    "business-profile-strength",
    async () => {
      const response = await apiClient.get<ApiResponse<ProfileStrengthData>>(
        API_ENDPOINTS.BUSINESS.GET_STRENGTH
      );
      return response.data.result;
    },
    { ttl: 600000 } // Cache for 10 minutes (static data)
  );
};

/**
 * Validate a Single Field
 * POST /api/business/validate
 */
export const validateField = async (
  request: ValidateFieldRequest | ValidateFieldRequest2
): Promise<ValidateFieldResponse> => {
  const response = await apiClient.post<ApiResponse<ValidateFieldResponse>>(
    API_ENDPOINTS.BUSINESS.VALIDATE_FIELD,
    request
  );
  return response.data.result;
};

/**
 * Get Verification Steps
 * GET /api/business/profile/verification-steps
 */
export const getVerificationSteps = async (): Promise<VerificationStep[]> => {
  return cachedApiCall(
    "business-verification-steps",
    async () => {
      const response = await apiClient.get<ApiResponse<VerificationStep[]>>(
        API_ENDPOINTS.BUSINESS.GET_VERIFICATION_STEPS
      );
      return response.data.result;
    },
    { ttl: 600000 } // Cache for 10 minutes (static data)
  );
};

/**
 * Get Submitted Documents
 * GET /api/business/profile/documents
 */
export const getSubmittedDocuments = async (): Promise<SubmittedDocument[]> => {
  return cachedApiCall(
    "business-submitted-documents",
    async () => {
      const response = await apiClient.get<ApiResponse<SubmittedDocument[]>>(
        API_ENDPOINTS.BUSINESS.GET_DOCUMENTS
      );
      return response.data.result;
    },
    { ttl: 300000 } // Cache for 5 minutes
  );
};

/**
 * Download Document
 * GET /api/business/profile/documents/:id/download
 */
export const downloadDocument = async (documentId: string): Promise<Blob> => {
  const response = await apiClient.get(
    API_ENDPOINTS.BUSINESS.DOWNLOAD_DOCUMENT.replace("{id}", documentId),
    {
      responseType: "blob",
    }
  );
  return response.data;
};

/**
 * Delete Document
 * DELETE /api/business/profile/documents/:id
 */
export const deleteDocument = async (
  documentId: string
): Promise<{ success: boolean }> => {
  const response = await apiClient.delete<ApiResponse<{ success: boolean }>>(
    API_ENDPOINTS.BUSINESS.DELETE_DOCUMENT.replace("{id}", documentId)
  );
  return response.data.result;
};

/**
 * Update Profile (for drafts)
 * PUT /api/business/profile/update
 */
export const updateProfile = async (
  data: Partial<SubmitProfileRequest>
): Promise<BusinessProfile> => {
  const response = await apiClient.put<ApiResponse<BusinessProfile>>(
    API_ENDPOINTS.BUSINESS.UPDATE_PROFILE,
    data
  );
  return response.data.result;
};

/**
 * Get Optimization Tips
 * GET /api/business/profile/optimization-tips
 */
export const getOptimizationTips = async (): Promise<string[]> => {
  const response = await apiClient.get<ApiResponse<string[]>>(
    API_ENDPOINTS.BUSINESS.GET_OPTIMIZATION_TIPS
  );
  return response.data.result;
};

// Export as namespace for backward compatibility
export const businessApi = {
  submitProfile,
  getProfileStatus,
  getProfileStrength,
  validateField,
  getVerificationSteps,
  getSubmittedDocuments,
  downloadDocument,
  deleteDocument,
  updateProfile,
  getOptimizationTips,
};

export default businessApi;
