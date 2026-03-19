import { usersApi } from "@/features/users/services/usersApi";
import { useState } from "react";
import { HTTP_STATUS } from "../../../constants";
import { useUsersTranslation } from "@/shared/hooks";

interface DeleteUserOptions {
  userId: string;
  reason?: string; // Required for soft delete, optional for hard delete
}

export const useDeleteUser = () => {
  const { t } = useUsersTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Perform soft delete on user (lock account, keep data for 30 days)
   * @param options - { userId, reason }
   */
  const softDelete = async ({
    userId,
    reason,
  }: DeleteUserOptions & { reason: string }) => {
    setLoading(true);
    setError(null);
    try {
      if (!reason || reason.trim() === "") {
        throw new Error(t("delete.reasonRequired"));
      }

      await usersApi.softDeleteUser(userId, reason);
      return { success: true };
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
   * @param options - { userId }
   */
  const hardDelete = async ({ userId }: DeleteUserOptions) => {
    setLoading(true);
    setError(null);
    try {
      await usersApi.hardDeleteUser(userId);
      return { success: true };
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
