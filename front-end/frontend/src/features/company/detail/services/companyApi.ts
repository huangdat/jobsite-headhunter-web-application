import { apiClient } from "@/shared/utils/axios";
import type { BusinessProfileResp } from "@/shared/utils/businessProfileService";
import { API_ENDPOINTS } from "@/lib/constants";

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
