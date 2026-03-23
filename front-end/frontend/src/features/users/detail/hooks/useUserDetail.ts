import type { UserDetail } from "@/features/users/types/user.types";
import { useEffect, useState } from "react";
import { usersApi } from "@/features/users/services/usersApi";
import { useUsersTranslation } from "@/shared/hooks";

export const useUserDetail = (userId: string) => {
  const { t } = useUsersTranslation();
  const [data, setData] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = await usersApi.getUserById(userId);
        setData(userData);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : t("detail.failedToFetchUserDetails");
        setError(errorMessage);
        console.error("Error fetching user detail:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserDetail();
    }
  }, [userId]);

  return { data, loading, error };
};
