import { apiClient } from "@/shared/utils/axios";
import type { BusinessProfileResp } from "@/shared/utils/businessProfileService";
import { API_ENDPOINTS } from "@/lib/constants";

export const getCompanyById = async (
  id: string | number
): Promise<BusinessProfileResp> => {
  const response = await apiClient.get<{ result: BusinessProfileResp }>(
    `${API_ENDPOINTS.BUSINESS_PROFILE}/${id}`
  );

  return response.data.result || response.data;
};
