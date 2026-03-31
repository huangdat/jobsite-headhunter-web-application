import { API_ENDPOINTS } from "@/lib/constants";
import { apiClient } from "@/shared/utils/axios";
import { cachedApiCall } from "@/shared/utils/apiCache";
import type { ApiResponse } from "@/features/auth/types";
import type {
  CandidateProfile,
  CandidateProfilePayload,
} from "@/features/candidate/profile/types/profile.types";

const mapProfileResponse = (payload: unknown): CandidateProfile => {
  const raw = (payload ?? {}) as Partial<CandidateProfile>;

  return {
    id: raw.id,
    fullName: raw.fullName ?? "",
    email: raw.email ?? "",
    phone: raw.phone ?? "",
    currentTitle: raw.currentTitle ?? "",
    yearsOfExperience: raw.yearsOfExperience ?? null,
    currentStatus: raw.currentStatus ?? "OPEN_FOR_WORK",
    expectedSalaryMin: raw.expectedSalaryMin ?? null,
    expectedSalaryMax: raw.expectedSalaryMax ?? null,
    bio: raw.bio ?? "",
    city: raw.city ?? "",
    openForWork: raw.openForWork ?? true,
  };
};

export const profileApi = {
  getProfile: async (): Promise<CandidateProfile> => {
    return cachedApiCall(
      "candidate-profile",
      async () => {
        const response = await apiClient.get<ApiResponse<CandidateProfile>>(
          API_ENDPOINTS.ACCOUNT.GET_PROFILE
        );
        return mapProfileResponse(response.data?.result);
      },
      { ttl: 300000 } // Cache for 5 minutes
    );
  },

  updateProfile: async (
    payload: CandidateProfilePayload
  ): Promise<CandidateProfile> => {
    const response = await apiClient.put<ApiResponse<CandidateProfile>>(
      API_ENDPOINTS.ACCOUNT.UPDATE_PROFILE,
      payload
    );

    return mapProfileResponse(response.data?.result);
  },
};
