import { apiClient } from "./axios";
import { API_ENDPOINTS } from "@/lib/constants";

export interface BusinessProfileResp {
  id: number;
  companyName: string;
  taxCode: string;
  websiteUrl: string;
  addressMain: string;
  companyScale: string;
  verificationStatus: string;
  noteByAdmin: string;
}

/**
 * Fetch top 10 best business profiles
 */
export async function getTop10Companies(): Promise<BusinessProfileResp[]> {
  try {
    const response = await apiClient.get<{ result: BusinessProfileResp[] }>(
      API_ENDPOINTS.BUSINESS_PROFILE.GET_TOP_10
    );
    return response.data.result || [];
  } catch (error) {
    console.error("Error fetching top companies:", error);
    throw error;
  }
}

export default {
  getTop10Companies,
};
