/**
 * Commission API Service
 * PROF-04: Collaborator Commission
 */

import { apiClient } from "@/shared/utils/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import type {
  CommissionProfile,
  CommissionFormData,
  CommissionStats,
} from "../types/commission.types";

export const commissionApi = {
  /**
   * Fetch current collaborator's commission profile
   */
  async getCommissionProfile(): Promise<CommissionProfile> {
    const response = await apiClient.get<CommissionProfile>(
      API_ENDPOINTS.COLLABORATOR.GET_COMMISSION_PROFILE
    );
    return response.data;
  },

  /**
   * Update commission profile information
   */
  async updateCommissionProfile(
    data: CommissionFormData
  ): Promise<CommissionProfile> {
    const response = await apiClient.put<CommissionProfile>(
      API_ENDPOINTS.COLLABORATOR.UPDATE_COMMISSION_PROFILE,
      data
    );
    return response.data;
  },

  /**
   * Fetch commission statistics
   */
  async getCommissionStats(): Promise<CommissionStats> {
    const response = await apiClient.get<CommissionStats>(
      API_ENDPOINTS.COLLABORATOR.GET_COMMISSION_STATS
    );
    return response.data;
  },

  /**
   * Verify banking information
   */
  async verifyBankingInfo(
    bankName: string,
    accountNumber: string
  ): Promise<{ verified: boolean }> {
    const response = await apiClient.post<{ verified: boolean }>(
      API_ENDPOINTS.COLLABORATOR.VERIFY_BANKING_INFO,
      { bankName, accountNumber }
    );
    return response.data;
  },

  /**
   * Request payout
   */
  async requestPayout(
    amount: number
  ): Promise<{ success: boolean; payoutId: string }> {
    const response = await apiClient.post<{
      success: boolean;
      payoutId: string;
    }>("/collaborator/commission/payout", { amount });
    return response.data;
  },
};
