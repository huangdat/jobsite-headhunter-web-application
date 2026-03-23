/**
 * Commission API Service
 * PROF-04: Collaborator Commission
 */

import { apiClient } from "@/shared/utils/axios";
import type { CommissionProfile, CommissionFormData, CommissionStats } from "../types/commission.types";

export const commissionApi = {
  /**
   * Fetch current collaborator's commission profile
   */
  async getCommissionProfile(): Promise<CommissionProfile> {
    const response = await apiClient.get<CommissionProfile>(
      "/collaborator/commission/profile"
    );
    return response.data;
  },

  /**
   * Update commission profile information
   */
  async updateCommissionProfile(data: CommissionFormData): Promise<CommissionProfile> {
    const response = await apiClient.put<CommissionProfile>(
      "/collaborator/commission/profile",
      data
    );
    return response.data;
  },

  /**
   * Fetch commission statistics
   */
  async getCommissionStats(): Promise<CommissionStats> {
    const response = await apiClient.get<CommissionStats>(
      "/collaborator/commission/stats"
    );
    return response.data;
  },

  /**
   * Verify banking information
   */
  async verifyBankingInfo(bankName: string, accountNumber: string): Promise<{ verified: boolean }> {
    const response = await apiClient.post<{ verified: boolean }>(
      "/collaborator/commission/verify-banking",
      { bankName, accountNumber }
    );
    return response.data;
  },

  /**
   * Request payout
   */
  async requestPayout(amount: number): Promise<{ success: boolean; payoutId: string }> {
    const response = await apiClient.post<{ success: boolean; payoutId: string }>(
      "/collaborator/commission/payout",
      { amount }
    );
    return response.data;
  },
};
