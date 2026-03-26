/**
 * Business Profile API Service
 * Handles all API calls for PROF-03 Business Profile & Verification
 */

import axios from "axios";
import type { AxiosInstance } from "axios";
import { API_ENDPOINTS } from "@/lib/constants";
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

class BusinessApiService {
  private api: AxiosInstance;
  private baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    // Add request interceptor for auth token
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle common errors globally if needed
        return Promise.reject(error);
      }
    );
  }

  /**
   * Submit Business Profile for Verification
   * POST /api/business/profile/submit
   */
  async submitProfile(
    data: SubmitProfileRequest
  ): Promise<SubmitProfileResponse> {
    try {
      const formData = new FormData();

      // Add form fields
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

      const response = await this.api.post<SubmitProfileResponse>(
        API_ENDPOINTS.BUSINESS.SUBMIT_PROFILE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get Business Profile Status & Details
   * GET /api/business/profile/status
   */
  async getProfileStatus(): Promise<GetProfileStatusResponse> {
    try {
      const response = await this.api.get<GetProfileStatusResponse>(
        API_ENDPOINTS.BUSINESS.GET_STATUS
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get Profile Strength Data
   * GET /api/business/profile/strength
   */
  async getProfileStrength(): Promise<ProfileStrengthData> {
    try {
      const response = await this.api.get<ProfileStrengthData>(
        API_ENDPOINTS.BUSINESS.GET_STRENGTH
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Validate a Single Field
   * POST /api/business/validate
   */
  async validateField(
    request: ValidateFieldRequest | ValidateFieldRequest2
  ): Promise<ValidateFieldResponse> {
    try {
      const response = await this.api.post<ValidateFieldResponse>(
        API_ENDPOINTS.BUSINESS.VALIDATE_FIELD,
        request
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get Verification Steps
   * GET /api/business/profile/verification-steps
   */
  async getVerificationSteps(): Promise<VerificationStep[]> {
    try {
      const response = await this.api.get<VerificationStep[]>(
        API_ENDPOINTS.BUSINESS.GET_VERIFICATION_STEPS
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get Submitted Documents
   * GET /api/business/profile/documents
   */
  async getSubmittedDocuments(): Promise<SubmittedDocument[]> {
    try {
      const response = await this.api.get<SubmittedDocument[]>(
        API_ENDPOINTS.BUSINESS.GET_DOCUMENTS
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Download Document
   * GET /api/business/profile/documents/:id/download
   */
  async downloadDocument(documentId: string): Promise<Blob> {
    try {
      const response = await this.api.get(
        API_ENDPOINTS.BUSINESS.DOWNLOAD_DOCUMENT.replace("{id}", documentId),
        {
          responseType: "blob",
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete Document
   * DELETE /api/business/profile/documents/:id
   */
  async deleteDocument(documentId: string): Promise<{ success: boolean }> {
    try {
      const response = await this.api.delete<{ success: boolean }>(
        API_ENDPOINTS.BUSINESS.DELETE_DOCUMENT.replace("{id}", documentId)
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update Profile (for drafts)
   * PUT /api/business/profile/update
   */
  async updateProfile(
    data: Partial<SubmitProfileRequest>
  ): Promise<BusinessProfile> {
    try {
      const response = await this.api.put<BusinessProfile>(
        API_ENDPOINTS.BUSINESS.UPDATE_PROFILE,
        data
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get Optimization Tips
   * GET /api/business/profile/optimization-tips
   */
  async getOptimizationTips(): Promise<string[]> {
    try {
      const response = await this.api.get<string[]>(
        API_ENDPOINTS.BUSINESS.GET_OPTIMIZATION_TIPS
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Error Handler
   */
  private handleError(error: unknown): Error & {
    status?: number;
    data?: unknown;
    isAxiosError?: boolean;
    isNetworkError?: boolean;
  } {
    const errorRecord = error as Record<string, unknown>;

    if (error instanceof Error && errorRecord.response) {
      // Server responded with error status
      const response = errorRecord.response as Record<string, unknown>;
      const { status, data } = response;
      const errorMessage =
        (data as Record<string, unknown> | undefined)?.message ||
        "common.messages.anErrorOccurred";

      return Object.assign(new Error(errorMessage as string), {
        status: status as number,
        data,
        isAxiosError: true,
      }) as Error & { status?: number; data?: unknown; isAxiosError?: boolean };
    } else if (error instanceof Error && errorRecord.request) {
      // Request was made but no response
      return Object.assign(new Error("common.messages.noResponseFromServer"), {
        isNetworkError: true,
      }) as Error & { isNetworkError?: boolean };
    } else if (error instanceof Error) {
      return error;
    }
    return new Error("common.messages.unknownError");
  }
}

// Export singleton instance
export const businessApi = new BusinessApiService();
export default businessApi;
