/**
 * Business Profile API Service (Read-only Version)
 * Handles fetching business profile data from GET /api/business-profile
 */

import { apiClient } from "@/shared/utils/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import type { BusinessProfile } from "../types/business.types";
import type { ApiResponse } from "@/features/auth/types/api.types";

/**
 * Get Business Profile Details
 * GET /api/business-profile
 * Returns array of profiles, we take the first element (headhunter's assigned business)
 */
export const getBusinessProfile = async (): Promise<BusinessProfile> => {
  const response = await apiClient.get<ApiResponse<BusinessProfile[]>>(
    API_ENDPOINTS.BUSINESS_PROFILE.GET_ALL
  );

  if (!response.data.result || response.data.result.length === 0) {
    throw new Error("No business profile found");
  }

  return response.data.result[0];
};

// Export as namespace for backward compatibility
export const businessApi = {
  getBusinessProfile,
};

export default businessApi;
