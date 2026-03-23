/**
 * Commission API Service
 * PROF-04: Collaborator Commission
 */

import type { CommissionProfile, CommissionFormData, CommissionStats } from "../types/commission.types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const commissionApi = {
  /**
   * Fetch current collaborator's commission profile
   */
  async getCommissionProfile(): Promise<CommissionProfile> {
    const response = await fetch(`${API_BASE_URL}/collaborator/commission/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch commission profile: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Update commission profile information
   */
  async updateCommissionProfile(data: CommissionFormData): Promise<CommissionProfile> {
    const response = await fetch(`${API_BASE_URL}/collaborator/commission/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update commission profile: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Fetch commission statistics
   */
  async getCommissionStats(): Promise<CommissionStats> {
    const response = await fetch(`${API_BASE_URL}/collaborator/commission/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch commission stats: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Verify banking information
   */
  async verifyBankingInfo(bankName: string, accountNumber: string): Promise<{ verified: boolean }> {
    const response = await fetch(`${API_BASE_URL}/collaborator/commission/verify-banking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ bankName, accountNumber }),
    });

    if (!response.ok) {
      throw new Error(`Failed to verify banking info: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Request payout
   */
  async requestPayout(amount: number): Promise<{ success: boolean; payoutId: string }> {
    const response = await fetch(`${API_BASE_URL}/collaborator/commission/payout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      throw new Error(`Failed to request payout: ${response.statusText}`);
    }

    return response.json();
  },
};
