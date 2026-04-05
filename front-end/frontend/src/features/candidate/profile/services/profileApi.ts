import { API_ENDPOINTS } from "@/lib/constants";
import { apiClient } from "@/shared/utils/axios";
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
    cvUrl: raw.cvUrl ?? "",
    openForWork: raw.openForWork ?? true,
  };
};

export const profileApi = {
  getProfile: async (): Promise<CandidateProfile> => {
    const response = await apiClient.get<ApiResponse<CandidateProfile>>(
      API_ENDPOINTS.ACCOUNT.GET_PROFILE
    );

    return mapProfileResponse(response.data?.result);
  },
  getCurrentCvUrl: async (): Promise<string> => {
    try {
      const response = await apiClient.get<ApiResponse<{ cvUrl?: string }>>(
        API_ENDPOINTS.CANDIDATE.CV_LIST
      );

      return response.data?.result?.cvUrl ?? "";
    } catch {
      return "";
    }
  },

  updateProfile: async (
    payload: CandidateProfilePayload
  ): Promise<CandidateProfile> => {
    const formData = new FormData();

    const appendIfPresent = (key: string, value: unknown) => {
      if (value === undefined || value === null || value === "") {
        return;
      }

      formData.append(key, String(value));
    };

    appendIfPresent("currentTitle", payload.currentTitle?.trim());
    appendIfPresent("yearsOfExperience", payload.yearsOfExperience);
    appendIfPresent("expectedSalaryMin", payload.expectedSalaryMin);
    appendIfPresent("expectedSalaryMax", payload.expectedSalaryMax);
    appendIfPresent("bio", payload.bio?.trim());
    appendIfPresent("city", payload.city?.trim());
    appendIfPresent("openForWork", payload.openForWork);
    appendIfPresent("cvUrl", payload.cvUrl?.trim());

    const response = await apiClient.put<ApiResponse<CandidateProfile>>(
      API_ENDPOINTS.ACCOUNT.UPDATE_PROFILE,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return mapProfileResponse(response.data?.result);
  },
  // Upload CV: send multipart/form-data to backend controller /api/cv/MyCv
  uploadCV: async (file: File): Promise<string> => {
    const form = new FormData();
    form.append("cvFile", file);

    const response = await apiClient.put<ApiResponse<{ cvUrl: string }>>(
      API_ENDPOINTS.CANDIDATE.CV_UPLOAD,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data?.result?.cvUrl ?? "";
  },
  fetchCVs: async (): Promise<{ id: string; name: string; url: string }[]> => {
    const response = await apiClient.get<
      ApiResponse<{ id: string; name: string; url: string }[]>
    >(API_ENDPOINTS.CANDIDATE.CV_LIST);
    return response.data?.result || [];
  },
};

export default profileApi;
