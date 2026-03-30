/**
 * useCommissionManagement Hook
 * PROF-04: Collaborator Commission
 */

import { useState, useCallback, useEffect } from "react";
import { useCommissionTranslation } from "@/shared/hooks/useFeatureTranslation";
import type {
  CommissionProfile,
  CommissionFormData,
  CommissionStats,
} from "../types/commission.types";
import { commissionApi } from "../services/commissionApi";

interface CommissionManagementState {
  profile: CommissionProfile | null;
  stats: CommissionStats | null;
  formData: CommissionFormData | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  success: boolean;
}

export function useCommissionManagement() {
  const { t } = useCommissionTranslation();
  const [state, setState] = useState<CommissionManagementState>({
    profile: null,
    stats: null,
    formData: null,
    loading: true,
    saving: false,
    error: null,
    success: false,
  });

  // Fetch commission profile and stats on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const [profile, stats] = await Promise.all([
          commissionApi.getCommissionProfile(),
          commissionApi.getCommissionStats(),
        ]);

        const formData: CommissionFormData = {
          fullName: profile.fullName,
          phoneNumber: profile.phoneNumber,
          bankName: profile.bankName,
          accountNumber: profile.accountNumber,
          accountHolderName: profile.accountHolderName,
          swiftCode: profile.swiftCode,
        };

        setState((prev) => ({
          ...prev,
          profile,
          stats,
          formData,
          loading: false,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error:
            err instanceof Error ? err.message : t("failedToLoadCommission"),
          loading: false,
        }));
      }
    };

    fetchData();
  }, [t]);

  // Update form field
  const updateField = useCallback(
    (field: keyof CommissionFormData, value: string) => {
      setState((prev) => ({
        ...prev,
        formData: {
          ...prev.formData!,
          [field]: value,
        },
      }));
    },
    []
  );

  // Save commission profile
  const saveProfile = useCallback(async () => {
    if (!state.formData) return;

    try {
      setState((prev) => ({ ...prev, saving: true, error: null }));

      const updated = await commissionApi.updateCommissionProfile(
        state.formData
      );

      setState((prev) => ({
        ...prev,
        profile: updated,
        saving: false,
        success: true,
      }));

      // Auto-dismiss success message after 5 seconds
      setTimeout(() => {
        setState((prev) => ({ ...prev, success: false }));
      }, 5000);
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : t("failedToSaveProfile"),
        saving: false,
      }));
    }
  }, [state.formData, t]);

  // Clear error
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Request payout
  const requestPayout = useCallback(
    async (amount: number) => {
      try {
        setState((prev) => ({ ...prev, saving: true, error: null }));

        const result = await commissionApi.requestPayout(amount);

        setState((prev) => ({
          ...prev,
          saving: false,
          success: true,
        }));

        // Refresh stats after payout
        const updatedStats = await commissionApi.getCommissionStats();
        setState((prev) => ({ ...prev, stats: updatedStats }));

        return result;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error:
            err instanceof Error
              ? err.message
              : t("messages.failedToRequestPayout"),
          saving: false,
        }));
        throw err;
      }
    },
    [t]
  );

  return {
    ...state,
    updateField,
    saveProfile,
    clearError,
    requestPayout,
  };
}
