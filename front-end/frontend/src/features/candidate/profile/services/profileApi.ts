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

  updateProfile: async (
    payload: CandidateProfilePayload
  ): Promise<CandidateProfile> => {
    // Sanitize payload: coerce text fields to trimmed strings and
    // ensure numeric fields are numbers or null (not empty strings)
    const sanitized: Record<string, any> = {};

    if (payload.currentTitle !== undefined) {
      sanitized.currentTitle = String(payload.currentTitle ?? "").trim();
    }

    if (payload.bio !== undefined) {
      sanitized.bio = String(payload.bio ?? "").trim();
    }

    if (payload.city !== undefined) {
      sanitized.city = String(payload.city ?? "").trim();
    }

    if (payload.yearsOfExperience !== undefined) {
      const v = payload.yearsOfExperience as any;
      sanitized.yearsOfExperience = v === "" || v === null ? null : Number(v);
    }

    if (payload.expectedSalaryMin !== undefined) {
      const v = payload.expectedSalaryMin as any;
      sanitized.expectedSalaryMin = v === "" || v === null ? null : Number(v);
    }

    if (payload.expectedSalaryMax !== undefined) {
      const v = payload.expectedSalaryMax as any;
      sanitized.expectedSalaryMax = v === "" || v === null ? null : Number(v);
    }

    if (payload.openForWork !== undefined) {
      sanitized.openForWork = payload.openForWork;
    }

    const response = await apiClient.put<ApiResponse<CandidateProfile>>(
      API_ENDPOINTS.ACCOUNT.UPDATE_PROFILE,
      sanitized
    );

    return mapProfileResponse(response.data?.result);
  },
  // Upload CV: send multipart/form-data to backend controller /api/cv/MyCv
  uploadCV: async (file: File): Promise<string> => {
    const form = new FormData();
    form.append("cvFile", file);

    // Use the controller endpoint that expects a ModelAttribute with 'cvFile'
    const response = await apiClient.put<ApiResponse<any>>(
      "/api/cv/MyCv",
      form,
      // do not force JSON Content-Type; let axios set multipart boundary
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data?.result?.cvUrl ?? "";
  },
  fetchCVs: async (): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any>>("/api/cv");
    return response.data?.result || [];
  },
};
