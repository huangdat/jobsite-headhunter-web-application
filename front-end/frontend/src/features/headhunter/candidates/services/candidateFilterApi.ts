import { apiClient } from "@/shared/utils/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { extractPagedResponse } from "@/shared/api/responseAdapter";
import { CANDIDATE_FILTER_QUERY_KEYS } from "@/features/headhunter/api/constants";
import type { ApiResponse } from "@/features/auth/types/api.types";
import type { CandidateAccount } from "../types";

export interface CandidateFilterRequest {
  status?: string[];
  locations?: string[];
  industries?: string[];
  expMin?: number | null;
  expMax?: number | null;
  registeredFrom?: string | null;
  registeredTo?: string | null;
  page?: number;
  size?: number;
  signal?: AbortSignal;
}

export interface CandidateFilterResponse {
  items: CandidateAccount[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const buildParams = (request: CandidateFilterRequest) => {
  const params = new URLSearchParams();

  request.status?.forEach((value) => params.append("status", value));
  request.locations?.forEach((value) => params.append("locations", value));
  request.industries?.forEach((value) => params.append("industries", value));

  if (request.expMin !== null && request.expMin !== undefined) {
    params.set("expMin", String(request.expMin));
  }
  if (request.expMax !== null && request.expMax !== undefined) {
    params.set("expMax", String(request.expMax));
  }
  if (request.registeredFrom) {
    params.set(
      CANDIDATE_FILTER_QUERY_KEYS.REGISTERED_FROM,
      request.registeredFrom
    );
  }
  if (request.registeredTo) {
    params.set(
      CANDIDATE_FILTER_QUERY_KEYS.REGISTERED_TO,
      request.registeredTo
    );
  }
  if (request.page) {
    params.set("page", String(request.page));
  }
  if (request.size) {
    params.set("size", String(request.size));
  }

  return params;
};

export const filterCandidates = async (
  request: CandidateFilterRequest
): Promise<CandidateFilterResponse> => {
  const res = await apiClient.get<
    ApiResponse<{
      data: CandidateAccount[];
      totalElements: number;
      page: number;
      size: number;
      totalPages: number;
    }>
  >(API_ENDPOINTS.HEADHUNTER.CANDIDATE_FILTER, {
    params: buildParams(request),
    signal: request.signal,
  });

  return extractPagedResponse(res);
};
