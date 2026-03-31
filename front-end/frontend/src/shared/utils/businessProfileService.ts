import { apiClient } from "./axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { cachedApiCall } from "./apiCache";

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
 * Uses caching to prevent repeated API calls (10 min cache)
 */
export async function getTop10Companies(): Promise<BusinessProfileResp[]> {
  const cacheKey = "business-profile:top-10";

  try {
    const result = await cachedApiCall(
      cacheKey,
      async () => {
        const response = await apiClient.get<{ result: BusinessProfileResp[] }>(
          API_ENDPOINTS.BUSINESS_PROFILE.GET_TOP_10
        );
        return response.data.result || [];
      },
      { ttl: 10 * 60 * 1000 } // 10 minutes cache (companies don't change often)
    );

    return result;
  } catch (error) {
    console.error("Error fetching top companies:", error);
    throw error;
  }
}

export default {
  getTop10Companies,
};
