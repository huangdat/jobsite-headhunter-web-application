/**
 * CV Management API Service
 * Handles all API calls for CV management feature
 */

import axios from "axios";
import type {
  CVFile,
  CVUploadResponse,
  CVListResponse,
  CVDeleteResponse,
  CVDownloadResponse,
  ProfileStrengthResponse,
  PrivacyLevel,
} from "../types";

// API Base URL (can be configured via env)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const API_ENDPOINTS = {
  CV_UPLOAD: `${API_BASE_URL}/candidate/cv/upload`,
  CV_LIST: `${API_BASE_URL}/candidate/cv/list`,
  CV_DETAIL: (id: string) => `${API_BASE_URL}/candidate/cv/${id}`,
  CV_DOWNLOAD: (id: string) => `${API_BASE_URL}/candidate/cv/${id}/download`,
  CV_DELETE: (id: string) => `${API_BASE_URL}/candidate/cv/${id}`,
  CV_MAKE_ACTIVE: (id: string) =>
    `${API_BASE_URL}/candidate/cv/${id}/make-active`,
  PROFILE_STRENGTH: `${API_BASE_URL}/candidate/profile/strength`,
  PRIVACY_SETTINGS: `${API_BASE_URL}/candidate/profile/privacy`,
} as const;

/**
 * Upload a new CV file
 */
export const uploadCVFile = async (file: File): Promise<CVUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post<CVUploadResponse>(
      API_ENDPOINTS.CV_UPLOAD,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error uploading CV:", error);
    return {
      success: false,
      message: "messages.uploadFailed",
      error: {
        code: "UPLOAD_FAILED",
        message: "messages.uploadFailed",
      },
    };
  }
};

/**
 * Fetch list of user's CVs
 */
export const fetchCVList = async (): Promise<CVListResponse> => {
  try {
    const response = await axios.get<CVListResponse>(API_ENDPOINTS.CV_LIST);
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
};

/**
 * Get single CV details
 */
export const fetchCVDetail = async (id: string): Promise<CVFile | null> => {
  try {
    const response = await axios.get<CVFile>(API_ENDPOINTS.CV_DETAIL(id));
    return response.data;
  } catch (error) {
    console.error("Error fetching CV detail:", error);
    return null;
  }
};

/**
 * Download CV file
 */
export const downloadCVFile = async (
  id: string
): Promise<CVDownloadResponse> => {
  try {
    const response = await axios.get<CVDownloadResponse>(
      API_ENDPOINTS.CV_DOWNLOAD(id)
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
    const response = await axios.delete<CVDeleteResponse>(
      API_ENDPOINTS.CV_DELETE(id)
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
    const response = await axios.patch<CVUploadResponse>(
      API_ENDPOINTS.CV_MAKE_ACTIVE(id)
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
    try {
      const response = await axios.get<ProfileStrengthResponse>(
        API_ENDPOINTS.PROFILE_STRENGTH
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
  };

/**
 * Update privacy settings
 */
export const updatePrivacySettings = async (
  level: PrivacyLevel
): Promise<CVUploadResponse> => {
  try {
    const response = await axios.patch<CVUploadResponse>(
      API_ENDPOINTS.PRIVACY_SETTINGS,
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
      error: "validation.fileTooLarge",
    };
  }

  // Check file format
  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  if (!fileExtension || !allowedFormats.includes(fileExtension)) {
    return {
      valid: false,
      error: "validation.invalidFileFormat",
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
    return "Yesterday";
  }

  return uploadDate.toLocaleDateString("vi-VN");
};
