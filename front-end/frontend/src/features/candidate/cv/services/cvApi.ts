/**
 * CV Management API Service
 * Handles all API calls for CV management feature
 */

import { apiClient } from "@/shared/utils/axios";
import type {
  CVFile,
  CVUploadResponse,
  CVListResponse,
  CVDeleteResponse,
  CVDownloadResponse,
  ProfileStrengthResponse,
  PrivacyLevel,
} from "../types";
import { API_ENDPOINTS } from "@/lib/constants";
import { cachedApiCall } from "@/shared/utils/apiCache";

/**
 * Upload a new CV file
 */
export const uploadCVFile = async (file: File): Promise<CVUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append("cvFile", file);

    const response = await apiClient.put<CVUploadResponse>( // Dùng apiClient để có Token
      API_ENDPOINTS.CANDIDATE.CV_UPLOAD,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error uploading CV:", error);
    return { success: false, message: "messages.uploadFailed" };
  }
};

/**
 * Fetch list of user's CVs
 */
export const fetchCVList = async (): Promise<CVListResponse> => {
  return cachedApiCall(
    "cv-list",
    async () => {
      try {
        const response = await apiClient.get<CVListResponse>(
          API_ENDPOINTS.CANDIDATE.CV_LIST
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching CV list:", error);
        return {
          success: false,
          data: [],
          total: 0,
          limit: 5,
        };
      }
    },
    { ttl: 300000 } // Cache for 5 minutes
  );
};

/**
 * Get single CV details
 */
export const fetchCVDetail = async (id: string): Promise<CVFile | null> => {
  return cachedApiCall(
    `cv-detail-${id}`,
    async () => {
      try {
        const response = await apiClient.get<CVFile>(
          API_ENDPOINTS.CANDIDATE.CV_DETAIL.replace("{id}", id)
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching CV detail:", error);
        return null;
      }
    },
    { ttl: 300000 } // Cache for 5 minutes
  );
};

/**
 * Download CV file
 */
export const downloadCVFile = async (
  id: string
): Promise<CVDownloadResponse> => {
  try {
    const response = await apiClient.get<CVDownloadResponse>(
      API_ENDPOINTS.CANDIDATE.CV_DOWNLOAD.replace("{id}", id)
    );
    return response.data;
  } catch (error) {
    console.error("Error downloading CV:", error);
    return {
      success: false,
      message: "messages.downloadFailed",
    };
  }
};

/**
 * Delete a CV file
 */
export const deleteCVFile = async (id: string): Promise<CVDeleteResponse> => {
  try {
    const response = await apiClient.delete<CVDeleteResponse>(
      API_ENDPOINTS.CANDIDATE.CV_DELETE.replace("{id}", id)
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting CV:", error);
    return {
      success: false,
      message: "messages.deleteFailed",
    };
  }
};

/**
 * Make a CV file as active/primary
 */
export const makeCVActive = async (id: string): Promise<CVUploadResponse> => {
  try {
    const response = await apiClient.patch<CVUploadResponse>(
      API_ENDPOINTS.CANDIDATE.CV_MAKE_ACTIVE.replace("{id}", id)
    );
    return response.data;
  } catch (error) {
    console.error("Error making CV active:", error);
    return {
      success: false,
      message: "messages.updateFailed",
      error: {
        code: "UPDATE_FAILED",
        message: "messages.updateFailed",
      },
    };
  }
};

/**
 * Fetch profile strength data
 */
export const fetchProfileStrength =
  async (): Promise<ProfileStrengthResponse> => {
    return cachedApiCall(
      "profile-strength",
      async () => {
        try {
          const response = await apiClient.get<ProfileStrengthResponse>(
            API_ENDPOINTS.CANDIDATE.PROFILE_STRENGTH
          );
          return response.data;
        } catch (error) {
          console.error("Error fetching profile strength:", error);
          return {
            success: false,
            data: {
              percentage: 0,
              items: [],
              lastUpdated: new Date(),
            },
          };
        }
      },
      { ttl: 300000 } // Cache for 5 minutes
    );
  };

/**
 * Update privacy settings
 */
export const updatePrivacySettings = async (
  level: PrivacyLevel
): Promise<CVUploadResponse> => {
  try {
    const response = await apiClient.patch<CVUploadResponse>(
      API_ENDPOINTS.CANDIDATE.PRIVACY_SETTINGS,
      { level }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating privacy settings:", error);
    return {
      success: false,
      message: "messages.updateFailed",
      error: {
        code: "UPDATE_FAILED",
        message: "messages.updateFailed",
      },
    };
  }
};

/**
 * Validate file before upload
 * @param file - File to validate
 * @param maxSizeBytes - Maximum allowed file size in bytes
 * @param allowedFormats - Allowed file formats (e.g., 'pdf', 'doc', 'docx')
 */
export const validateCVFile = (
  file: File,
  maxSizeBytes: number = 5 * 1024 * 1024, // 5MB default
  allowedFormats: string[] = ["pdf", "doc", "docx", "rtf"]
): { valid: boolean; error?: string } => {
  // Check file size
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Dung lượng tối đa: ${formatFileSize(maxSizeBytes)}`,
    };
  }

  // Check file format
  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  if (!fileExtension || !allowedFormats.includes(fileExtension)) {
    return {
      valid: false,
      error: "Định dạng file không hợp lệ. Vui lòng chọn PDF/DOC/DOCX/RTF",
    };
  }

  return { valid: true };
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  // eslint-disable-next-line security/detect-object-injection
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

/**
 * Format date for display
 */
export const formatUploadDate = (date: Date): string => {
  const now = new Date();
  const uploadDate = new Date(date);
  const diffTime = Math.abs(now.getTime() - uploadDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return uploadDate.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (diffDays === 1) {
    //new
    return "Yesterday";
  }

  return uploadDate.toLocaleDateString("vi-VN");
};
