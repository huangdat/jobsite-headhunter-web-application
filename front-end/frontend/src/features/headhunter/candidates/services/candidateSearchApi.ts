import { apiClient } from "@/shared/utils/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { extractResult } from "@/shared/api/responseAdapter";
import type { ApiResponse } from "@/features/auth/types/api.types";
import type { CandidateDetail, CandidateSuggestion } from "../types";

export const searchCandidates = async (params: {
  keyword: string;
  limit?: number;
  signal?: AbortSignal;
}): Promise<CandidateSuggestion[]> => {
  const res = await apiClient.get<ApiResponse<CandidateSuggestion[]>>(
    API_ENDPOINTS.HEADHUNTER.CANDIDATE_SEARCH,
    {
      params: {
        keyword: params.keyword,
        limit: params.limit ?? 10,
      },
      signal: params.signal,
    }
  );

  return extractResult(res);
};

export const getCandidateDetail = async (
  id: string
): Promise<CandidateDetail> => {
  const res = await apiClient.get<ApiResponse<CandidateDetail>>(
    API_ENDPOINTS.USERS.GET_BY_ID.replace("{id}", id)
  );

  return extractResult(res);
};
