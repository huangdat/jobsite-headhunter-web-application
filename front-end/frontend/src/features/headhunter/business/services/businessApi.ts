/**
 * Business Profile API Service (Read-only Version)
 * Fetches the current headhunter's business profile by businessProfileId.
 */

import { apiClient } from "@/shared/utils/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { getMyInfo } from "@/features/auth/services/authApi";
import type { ApiResponse } from "@/features/auth/types";
import type { BusinessProfile } from "../types/business.types";

/**
 * Fetch a specific business profile by ID
 */
export const getBusinessProfileById = async (
  id: number
): Promise<BusinessProfile> => {
  const response = await apiClient.get<ApiResponse<BusinessProfile>>(
    API_ENDPOINTS.BUSINESS_PROFILE.GET_BY_ID.replace("{id}", String(id))
  );

  if (!response.data.result) {
    throw new Error("No business profile found");
  }

  return response.data.result;
};

/**
 * Get the current headhunter's assigned business profile.
 * Uses /api/account/myInfo to read businessProfileId first, then loads that company.
 */
export const getBusinessProfile = async (): Promise<BusinessProfile> => {
  const account = await getMyInfo();
  const businessProfileId = account.businessProfileId;

  if (!businessProfileId) {
    throw new Error("No business profile assigned to this account.");
  }

  const profile = await getBusinessProfileById(businessProfileId);
  return profile;
};

// Export as namespace for backward compatibility
export const businessApi = {
  getBusinessProfile,
  getBusinessProfileById,
};

export default businessApi;
