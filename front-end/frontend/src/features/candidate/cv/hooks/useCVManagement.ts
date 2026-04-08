/**
 * CV Management Hooks
 * Custom hooks for CV management functionality
 */

import { useState, useCallback, useEffect } from "react";
import type {
  CVManagementState,
  PrivacyLevel,
  UseCVManagementReturn,
} from "../types";
import {
  uploadCVFile,
  fetchCVList,
  deleteCVFile,
  downloadCVFile,
  makeCVActive,
  fetchProfileStrength,
  updatePrivacySettings,
  validateCVFile,
} from "../services";
import { DEFAULT_UPLOAD_CONFIG } from "../types";

/**
 * Main hook for CV Management
 * Handles state, API calls, and user interactions
 */
export const useCVManagement = (): UseCVManagementReturn => {
  const [state, setState] = useState<CVManagementState>({
    files: [],
    isLoading: false,
    isUploading: false,
    error: null,
    uploadProgress: 0,
    selectedFile: null,
    profile: {
      strength: {
        percentage: 0,
        items: [],
        lastUpdated: new Date(),
      },
      privacy: {
        level: "verified_recruiters",
        blockList: [],
      },
    },
    config: DEFAULT_UPLOAD_CONFIG,
  });

  /**
   * Fetch all CV files and profile strength data on component mount
   */
  useEffect(() => {
    let isActive = true;

    const loadData = async () => {
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        const [cvResponse, strengthResponse] = await Promise.all([
          fetchCVList(),
          fetchProfileStrength(),
        ]);

        if (isActive) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setState((prev: any) => ({
            ...prev,
            // Sửa lỗi: Bóc tách trường result từ data của ApiResponse
            files: cvResponse.success
              ? (
                  (cvResponse as Record<string, unknown>).data as Record<
                    string,
                    unknown
                  >
                )?.result || []
              : [],
            profile: {
              ...prev.profile,
              strength: strengthResponse.success
                ? (
                    (strengthResponse as unknown as Record<string, unknown>)
                      .data as Record<string, unknown>
                  )?.result || strengthResponse.data
                : prev.profile.strength,
            },
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error("Error loading CV data:", error);
        if (isActive) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: "messages.loadFailed",
          }));
        }
      }
    };

    loadData();

    return () => {
      isActive = false;
    };
  }, []);

  /**
   * Refresh all data (CVs and profile strength)
   */
  const refreshData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const [cvResponse, strengthResponse] = await Promise.all([
        fetchCVList(),
        fetchProfileStrength(),
      ]);

      setState(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (prev: any) => ({
          ...prev,
          files: cvResponse.success
            ? (
                (cvResponse as Record<string, unknown>).data as Record<
                  string,
                  unknown
                >
              )?.result || []
            : [],
          profile: {
            ...prev.profile,
            strength: strengthResponse.success
              ? (
                  (strengthResponse as unknown as Record<string, unknown>)
                    .data as Record<string, unknown>
                )?.result || strengthResponse.data
              : prev.profile.strength,
          },
          isLoading: false,
        })
      );
    } catch (error) {
      console.error("Error refreshing CV data:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "messages.loadFailed",
      }));
    }
  }, []);

  /**
   * Upload CV file
   */
  const uploadFile = useCallback(
    async (file: File) => {
      // Validate file
      const validation = validateCVFile(
        file,
        state.config.maxFileSize,
        state.config.supportedFormats
      );

      if (!validation.valid) {
        setState((prev) => ({
          ...prev,
          error: validation.error || "validation.invalidFile",
        }));
        return;
      }

      // Check if already at max resumes
      if (state.files.length >= state.config.maxResumes) {
        setState((prev) => ({
          ...prev,
          error: "validation.maxResumesReached",
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        isUploading: true,
        error: null,
        uploadProgress: 0,
      }));

      try {
        const response = await uploadCVFile(file);

        if (response.success) {
          // FIX LỖI: Gọi refreshData để đồng bộ mảng files chuẩn từ server (tránh lỗi lệch type)
          await refreshData();

          setState((prev) => ({
            ...prev,
            isUploading: false,
            uploadProgress: 100,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            isUploading: false,
            error: response.error?.message || "messages.uploadFailed",
          }));
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setState((prev) => ({
          ...prev,
          isUploading: false,
          error: "messages.uploadFailed",
        }));
      }
    },
    [state.config, state.files.length, refreshData]
  );

  /**
   * Delete CV file
   */
  const deleteFile = useCallback(async (fileId: string) => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
    }));

    try {
      const response = await deleteCVFile(fileId);

      if (response.success) {
        setState((prev) => ({
          ...prev,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          files: prev.files.filter((f: any) => f.id !== fileId),
          isLoading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "messages.deleteFailed",
        }));
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "messages.deleteFailed",
      }));
    }
  }, []);

  /**
   * Download CV file
   */
  const downloadFile = useCallback(async (fileId: string) => {
    try {
      const response = await downloadCVFile(fileId);

      if (response.success && response.url) {
        // Open download link in new window
        const link = document.createElement("a");
        link.href = response.url;
        link.click();
      } else {
        setState((prev) => ({
          ...prev,
          error: "messages.downloadFailed",
        }));
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      setState((prev) => ({
        ...prev,
        error: "messages.downloadFailed",
      }));
    }
  }, []);

  /**
   * Make CV file active
   */
  const makeFileActive = useCallback(async (fileId: string) => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
    }));

    try {
      const response = await makeCVActive(fileId);

      if (response.success) {
        // Update file active status
        setState((prev) => ({
          ...prev,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          files: prev.files.map((f: any) => ({
            ...f,
            isActive: f.id === fileId,
          })),
          isLoading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "messages.updateFailed",
        }));
      }
    } catch (error) {
      console.error("Error making file active:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "messages.updateFailed",
      }));
    }
  }, []);

  /**
   * Update privacy setting
   */
  const setPrivacy = useCallback(async (level: PrivacyLevel) => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
    }));

    try {
      const response = await updatePrivacySettings(level);

      if (response.success) {
        setState((prev) => ({
          ...prev,
          profile: {
            ...prev.profile,
            privacy: {
              ...prev.profile.privacy,
              level,
            },
          },
          isLoading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "messages.updateFailed",
        }));
      }
    } catch (error) {
      console.error("Error updating privacy:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "messages.updateFailed",
      }));
    }
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  return {
    state,
    uploadFile,
    deleteFile,
    downloadFile,
    makeFileActive,
    setPrivacy,
    clearError,
    refreshData,
  };
};

/**
 * Simplified hook for CV upload
 */
export const useCVUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File) => {
    // Validate file
    const validation = validateCVFile(file);
    if (!validation.valid) {
      setError(validation.error || "validation.invalidFile");
      return null;
    }

    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      setProgress(50);
      const response = await uploadCVFile(file);

      if (response.success && response.file) {
        setProgress(100);
        setIsUploading(false);
        return response.file;
      } else {
        setError(response.error?.message || "messages.uploadFailed");
        setIsUploading(false);
        return null;
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("messages.uploadFailed");
      setIsUploading(false);
      return null;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { uploadFile, isUploading, progress, error, clearError };
};
