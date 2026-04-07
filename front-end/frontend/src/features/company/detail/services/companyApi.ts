import { apiClient } from "@/shared/utils/axios";
import type { BusinessProfileResp } from "@/shared/utils/businessProfileService";
import { API_ENDPOINTS } from "@/lib/constants";

export interface JobDetailResp {
  id: number;
  title: string;
  description: string;
  benefits: string;
  requirements: string;
  salary: string;
  location: string;
  workType: string;
  experienceLevel: string;
  deadline: string;
  createdAt: string;
}

export const getCompanyById = async (
  id: string | number
): Promise<BusinessProfileResp> => {
  const endpoint = API_ENDPOINTS.BUSINESS_PROFILE.GET_BY_ID.replace(
    "{id}",
    id.toString()
  );

  const response = await apiClient.get<{ result: BusinessProfileResp }>(
    endpoint
  );

  return response.data.result || response.data;
};

export const getJobsByBusinessProfileId = async (
  businessProfileId: string | number
): Promise<JobDetailResp[]> => {
  const endpoint = API_ENDPOINTS.BUSINESS_PROFILE.GET_JOBS.replace(
    "{id}",
    businessProfileId.toString()
  );

  const response = await apiClient.get<{ result: JobDetailResp[] }>(endpoint);

  return response.data.result || [];
};
