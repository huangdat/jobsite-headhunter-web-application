/**
 * Business Profile Read-Only Hook
 * Fetches headhunter's assigned business profile
 * No editing or submission allowed (profile set during account creation)
 */

import { useState, useEffect, useCallback } from "react";
import { businessApi } from "../services/businessApi";
import type { BusinessProfile } from "../types/business.types";

export const useBusinessProfile = () => {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchBusinessProfile = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const profileData = await businessApi.getBusinessProfile();
      setProfile(profileData);
    } catch (error: unknown) {
      console.error("Error fetching business profile:", error);
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setErrorMessage(
        err.response?.data?.message ||
          err.message ||
          "business.error.failed_to_load"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBusinessProfile();
  }, [fetchBusinessProfile]);

  return {
    profile,
    isLoading,
    errorMessage,
    refetch: fetchBusinessProfile,
  };
};

export default useBusinessProfile;
