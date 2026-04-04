/**
 * Hook: useVerificationDetail
 * Manages verification detail fetching, approval, and rejection
 * PROF-05: Business Verification Admin Module
 */

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import {
  getVerificationDetail,
  approveVerification,
  rejectVerification,
} from "../services/verificationApi";
import type {
  Verification,
  ApprovalRequest,
  RejectionRequest,
} from "../types/verification.types";

export interface UseVerificationDetailReturn {
  verification: Verification | null;
  isLoading: boolean;
  isApproving: boolean;
  isRejecting: boolean;
  error: string | null;
  fetchDetail: (id: number) => Promise<void>;
  approve: (data?: ApprovalRequest) => Promise<void>;
  reject: (data: RejectionRequest) => Promise<void>;
}

/**
 * Hook to manage verification detail with approval/rejection actions
 */
export const useVerificationDetail = (): UseVerificationDetailReturn => {
  const { t } = useAppTranslation();

  // State management
  const [verification, setVerification] = useState<Verification | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch verification detail
   */
  const fetchDetail = useCallback(
    async (id: number) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getVerificationDetail(id);
        setVerification(response);
      } catch (err) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : t("verification.errors.loadDetailFailed");
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [t]
  );

  /**
   * Approve verification
   */
  const approve = useCallback(
    async (data?: ApprovalRequest) => {
      if (!verification) {
        toast.error(t("verification.errors.noVerificationSelected"));
        return;
      }

      setIsApproving(true);
      try {
        const updated = await approveVerification(verification.id, data);
        setVerification(updated);
        toast.success(t("verification.approvalSuccess"));
      } catch (err) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : t("verification.errors.approvalFailed");
        toast.error(errorMsg);
      } finally {
        setIsApproving(false);
      }
    },
    [verification, t]
  );

  /**
   * Reject verification
   */
  const reject = useCallback(
    async (data: RejectionRequest) => {
      if (!verification) {
        toast.error(t("verification.errors.noVerificationSelected"));
        return;
      }

      setIsRejecting(true);
      try {
        const updated = await rejectVerification(verification.id, data);
        setVerification(updated);
        toast.success(t("verification.rejectionSuccess"));
      } catch (err) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : t("verification.errors.rejectionFailed");
        toast.error(errorMsg);
      } finally {
        setIsRejecting(false);
      }
    },
    [verification, t]
  );

  return {
    verification,
    isLoading,
    isApproving,
    isRejecting,
    error,
    fetchDetail,
    approve,
    reject,
  };
};
