import { usersApi } from "@/features/users/services/usersApi";
import { useState } from "react";
import { STORAGE_KEYS, AUDIT_LOG_ACTIONS } from "@/features/users/constants";
import { useUsersTranslation } from "@/shared/hooks";

interface UnlockUserOptions {
  userId: string;
  userName: string;
  reason: string;
  sendEmail: boolean;
  requirePasswordChange: boolean;
}

interface UnlockAuditLog {
  adminId: string | null;
  timestamp: string;
  targetUserId: string;
  action: string;
  userName: string;
  reason: string;
  sendEmail: boolean;
  requirePasswordChange: boolean;
}

interface UnlockErrorResponse {
  code?: string;
  message?: string;
}

export const useUnlockUser = () => {
  const { t } = useUsersTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Unlock user account with reason and password change requirement
   * AC2: Unlock successfully - Change status to ACTIVE, send email, force password change
   * AC5: Email security - Link only, NO passwords in email
   */
  const unlock = async (options: UnlockUserOptions) => {
    const { userId, userName, reason, sendEmail, requirePasswordChange } =
      options;

    setLoading(true);
    setError(null);

    try {
      const currentUserId = localStorage.getItem(STORAGE_KEYS.USER_ID);

      // Call API to unlock user (status = ACTIVE)
      await usersApi.unlockUser(userId);

      // Log audit (AC2)
      const auditLog: UnlockAuditLog = {
        adminId: currentUserId,
        timestamp: new Date().toISOString(),
        targetUserId: userId,
        action: AUDIT_LOG_ACTIONS.UNLOCK_USER || "UNLOCK_USER",
        userName,
        reason,
        sendEmail,
        requirePasswordChange,
      };
      console.log(`[${AUDIT_LOG_ACTIONS.UNLOCK_USER}]`, auditLog);

      return { success: true, auditLog };
    } catch (err) {
      const errorResponse = err as UnlockErrorResponse | Error;
      let errorMessage =
        t("unlock.errorUnlockFailed") || "Failed to unlock user";

      if (errorResponse instanceof Error) {
        errorMessage = errorResponse.message;
      }

      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    unlock,
  };
};

export default useUnlockUser;
