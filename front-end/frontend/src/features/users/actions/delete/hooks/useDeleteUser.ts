import { usersApi } from "@/features/users/services/usersApi";
import { useState } from "react";
import {
  STORAGE_KEYS,
  AUDIT_LOG_ACTIONS,
  HTTP_STATUS,
} from "../../../constants";
import { useUsersTranslation } from "@/shared/hooks";

interface DeleteUserOptions {
  userId: string;
  userName: string;
}

interface DeleteAuditLog {
  adminId: string | null;
  timestamp: string;
  targetUserId: string;
  deleteType: string;
  userName: string;
}

export const useDeleteUser = () => {
  const { t } = useUsersTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Perform soft delete on user (lock account)
   */
  const softDelete = async ({ userId, userName }: DeleteUserOptions) => {
    setLoading(true);
    setError(null);
    try {
      await usersApi.softDeleteUser(userId);

      // Log audit (AC4)
      const auditLog: DeleteAuditLog = {
        adminId: localStorage.getItem(STORAGE_KEYS.USER_ID),
        timestamp: new Date().toISOString(),
        targetUserId: userId,
        deleteType: AUDIT_LOG_ACTIONS.SOFT_DELETE,
        userName,
      };
      console.log(`[${AUDIT_LOG_ACTIONS.SOFT_DELETE}]`, auditLog);

      return { success: true, auditLog };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t("delete.errorSoftDelete");
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Perform hard delete on user (permanent deletion)
   * Throws 409 Conflict if user has related data
   */
  const hardDelete = async ({ userId, userName }: DeleteUserOptions) => {
    setLoading(true);
    setError(null);
    try {
      await usersApi.hardDeleteUser(userId);

      // Log audit (AC4)
      const auditLog: DeleteAuditLog = {
        adminId: localStorage.getItem(STORAGE_KEYS.USER_ID),
        timestamp: new Date().toISOString(),
        targetUserId: userId,
        deleteType: AUDIT_LOG_ACTIONS.HARD_DELETE,
        userName,
      };
      console.log(`[${AUDIT_LOG_ACTIONS.HARD_DELETE}]`, auditLog);

      return { success: true, auditLog };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t("delete.errorHardDelete");

      // Check if it's a conflict error (409 - user has related data)
      if (errorMessage.includes(HTTP_STATUS.CONFLICT.toString())) {
        setError(t("delete.errorConflict"));
      } else {
        setError(errorMessage);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    softDelete,
    hardDelete,
  };
};

export default useDeleteUser;
