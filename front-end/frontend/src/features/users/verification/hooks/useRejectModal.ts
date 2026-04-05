/**
 * Hook: useRejectModal
 * Manages rejection modal state and validation logic
 * PROF-05: Business Verification Admin Module - Phase 6
 */

import { useState, useCallback } from "react";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { toast } from "sonner";

export interface UseRejectModalReturn {
  isOpen: boolean;
  reason: string;
  open: () => void;
  close: () => void;
  setReason: (reason: string) => void;
  resetReason: () => void;
  validate: () => boolean;
  resetModal: () => void;
}

interface ValidationConfig {
  minLength: number;
  maxLength: number;
}

/**
 * Hook to manage rejection modal state with validation
 * @param config - Validation configuration (min/max length)
 */
export const useRejectModal = (
  config: ValidationConfig = { minLength: 20, maxLength: 500 }
): UseRejectModalReturn => {
  const { t } = useAppTranslation();

  // State management
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [reason, setReasonState] = useState<string>("");

  /**
   * Open modal
   */
  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  /**
   * Close modal without validation
   */
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  /**
   * Set reason with character count
   */
  const setReason = useCallback(
    (newReason: string) => {
      if (newReason.length <= config.maxLength) {
        setReasonState(newReason);
      }
    },
    [config.maxLength]
  );

  /**
   * Reset reason
   */
  const resetReason = useCallback(() => {
    setReasonState("");
  }, []);

  /**
   * Validate reason field
   */
  const validate = useCallback((): boolean => {
    if (reason.length < config.minLength) {
      toast.error(t("verification.modal.reject.reasonMinLength"));
      return false;
    }

    if (reason.length > config.maxLength) {
      toast.error(t("verification.modal.reject.reasonMaxLength"));
      return false;
    }

    return true;
  }, [reason, t, config.minLength, config.maxLength]);

  /**
   * Reset modal state entirely
   */
  const resetModal = useCallback(() => {
    setReasonState("");
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    reason,
    open,
    close,
    setReason,
    resetReason,
    validate,
    resetModal,
  };
};
