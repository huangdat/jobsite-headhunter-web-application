/**
 * Commission API Service
 * PROF-04: Collaborator Commission
 * Uses shared utilities for consistent response handling
 */

import { apiClient } from "@/shared/utils/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { extractResult } from "@/shared/api/responseAdapter";
import type { ApiResponse } from "@/features/auth/types/api.types";
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
    const response = await apiClient.get<ApiResponse<CommissionProfile>>(
      API_ENDPOINTS.COLLABORATOR.GET_COMMISSION_PROFILE
    );
    return extractResult(response);
  },

  /**
   * Update commission profile information
   */
  async updateCommissionProfile(
    data: CommissionFormData
  ): Promise<CommissionProfile> {
    const response = await apiClient.put<ApiResponse<CommissionProfile>>(
      API_ENDPOINTS.COLLABORATOR.UPDATE_COMMISSION_PROFILE,
      data
    );
    return extractResult(response);
  },

  /**
   * Fetch commission statistics
   */
  async getCommissionStats(): Promise<CommissionStats> {
    const response = await apiClient.get<ApiResponse<CommissionStats>>(
      API_ENDPOINTS.COLLABORATOR.GET_COMMISSION_STATS
    );
    return extractResult(response);
  },

  /**
   * Verify banking information
   */
  async verifyBankingInfo(
    bankName: string,
    accountNumber: string
  ): Promise<{ verified: boolean }> {
    const response = await apiClient.post<ApiResponse<{ verified: boolean }>>(
      API_ENDPOINTS.COLLABORATOR.VERIFY_BANKING_INFO,
      { bankName, accountNumber }
    );
    return extractResult(response);
  },

  /**
   * Request payout
   */
  async requestPayout(
    amount: number
  ): Promise<{ success: boolean; payoutId: string }> {
    const response = await apiClient.post<
      ApiResponse<{ success: boolean; payoutId: string }>
    >(API_ENDPOINTS.COLLABORATOR.REQUEST_PAYOUT, { amount });
    return extractResult(response);
  },
};
