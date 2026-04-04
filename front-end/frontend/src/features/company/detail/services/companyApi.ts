import { apiClient } from "@/shared/utils/axios";
import type { BusinessProfileResp } from "@/shared/utils/businessProfileService";

export const getCompanyById = async (
  id: string | number
): Promise<BusinessProfileResp> => {
  const response = await apiClient.get<{ result: BusinessProfileResp }>(
    `/api/business-profile/${id}`
  );

  return response.data.result || response.data;
};
