import { usersApi } from "@/features/users/services/usersApi";
import { useState } from "react";
import { STORAGE_KEYS, AUDIT_LOG_ACTIONS } from "../../../constants";
import { useUsersTranslation } from "@/shared/hooks";

interface LockUserOptions {
  userId: string;
  userName: string;
  reason: string;
  autoUnlockDate?: string;
  sendEmail: boolean;
  logoutCurrentSession: boolean;
}

interface LockAuditLog {
  adminId: string | null;
  timestamp: string;
  targetUserId: string;
  action: string;
  userName: string;
  reason: string;
  autoUnlockDate?: string;
  sendEmail: boolean;
  logoutCurrentSession: boolean;
}

interface LockErrorResponse {
  code?: string;
  message?: string;
}

export const useLockUser = () => {
  const { t } = useUsersTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Lock user account with reason and optional auto-unlock date
   * AC1: Lock successfully - Change status to INACTIVE, invalidate refresh token, audit log, send email
   * AC3: Permission constraint - Block CANNOT_LOCK_YOURSELF or INSUFFICIENT_PERMISSION
   */
  const lock = async (options: LockUserOptions) => {
    const {
      userId,
      userName,
      reason,
      autoUnlockDate,
      sendEmail,
      logoutCurrentSession,
    } = options;

    setLoading(true);
    setError(null);

    try {
      // Check permission constraints (AC3)
      const currentUserId = localStorage.getItem(STORAGE_KEYS.USER_ID);
      if (currentUserId === userId) {
        const errorMsg = t("lock.errorCannotLockYourself") || "Cannot lock your own account";
        setError(errorMsg);
        throw new Error("CANNOT_LOCK_YOURSELF");
      }

      // Call API to lock user
      await usersApi.lockUser(userId, {
        reason,
        autoUnlockDate,
        sendEmail,
        logoutCurrentSession,
      });

      // Log audit (AC1)
      const auditLog: LockAuditLog = {
        adminId: currentUserId,
        timestamp: new Date().toISOString(),
        targetUserId: userId,
        action: AUDIT_LOG_ACTIONS.LOCK_USER || "LOCK_USER",
        userName,
        reason,
        autoUnlockDate,
        sendEmail,
        logoutCurrentSession,
      };
      console.log(`[${AUDIT_LOG_ACTIONS.LOCK_USER}]`, auditLog);

      return { success: true, auditLog };
    } catch (err) {
      const errorResponse = err as LockErrorResponse | Error;
      let errorMessage = t("lock.errorLockFailed") || "Failed to lock user";

      // Handle specific error codes (AC3)
      if ("code" in errorResponse) {
        if (errorResponse.code === "CANNOT_LOCK_YOURSELF") {
          errorMessage = t("lock.errorCannotLockYourself") || "Cannot lock your own account";
        } else if (errorResponse.code === "INSUFFICIENT_PERMISSION") {
          errorMessage = t("lock.errorInsufficientPermission") || "Insufficient permission to lock this user";
        }
      } else if (errorResponse instanceof Error) {
        if (
          errorResponse.message.includes("409") ||
          errorResponse.message.includes("CANNOT_LOCK_YOURSELF")
        ) {
          errorMessage = t("lock.errorCannotLockYourself") || "Cannot lock your own account";
        } else if (errorResponse.message.includes("INSUFFICIENT_PERMISSION")) {
          errorMessage = t("lock.errorInsufficientPermission") || "Insufficient permission to lock this user";
        } else {
          errorMessage = errorResponse.message;
        }
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
    lock,
  };
};

export default useLockUser;
