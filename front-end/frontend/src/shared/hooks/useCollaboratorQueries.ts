import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commissionApi } from "@/features/collaborator/commission/services/commissionApi";
import type { CommissionFormData } from "@/features/collaborator/commission/types/commission.types";

/**
 * Fetch collaborator commission profile
 */
export const useCommissionProfileQuery = () => {
  return useQuery({
    queryKey: ["collaborator", "commission", "profile"],
    queryFn: () => commissionApi.getCommissionProfile(),
  });
};

/**
 * Fetch collaborator commission statistics
 */
export const useCommissionStatsQuery = () => {
  return useQuery({
    queryKey: ["collaborator", "commission", "stats"],
    queryFn: () => commissionApi.getCommissionStats(),
  });
};

/**
 * Update commission profile
 */
export const useUpdateCommissionProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CommissionFormData) =>
      commissionApi.updateCommissionProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collaborator", "commission", "profile"],
      });
    },
  });
};

/**
 * Verify banking information
 */
export const useVerifyBankingInfoMutation = () => {
  return useMutation({
    mutationFn: ({
      bankName,
      accountNumber,
    }: {
      bankName: string;
      accountNumber: string;
    }) => commissionApi.verifyBankingInfo(bankName, accountNumber),
  });
};

/**
 * Request payout
 */
export const useRequestPayoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amount: number) => commissionApi.requestPayout(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collaborator", "commission", "stats"],
      });
    },
  });
};
