import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  CandidateProfile,
  CandidateProfileFormValues,
  ProfileValidationErrors,
  UseProfileUpdateReturn,
} from "@/features/candidate/profile/types/profile.types";
import { DEFAULT_PROFILE_VALUES } from "@/features/candidate/profile/types/profile.types";
import { profileApi } from "@/features/candidate/profile/services/profileApi";
import {
  sanitizeProfileDraft,
  toProfilePayload,
} from "@/features/candidate/profile/utils/sanitize";
import {
  computeProfileStrength,
  validateProfileForm,
} from "@/features/candidate/profile/utils/validation";
import i18n from "@/i18n/config";

const toFormValues = (
  profile: CandidateProfile
): CandidateProfileFormValues => ({
  ...DEFAULT_PROFILE_VALUES,
  ...profile,
});

const isEqualProfile = (
  first: CandidateProfileFormValues,
  second: CandidateProfileFormValues
): boolean => {
  return JSON.stringify(first) === JSON.stringify(second);
};

export const useProfileUpdate = (): UseProfileUpdateReturn => {
  const [profile, setProfile] = useState<CandidateProfileFormValues | null>(
    null
  );
  const [draft, setDraft] = useState<CandidateProfileFormValues>(
    DEFAULT_PROFILE_VALUES
  );
  const [errors, setErrors] = useState<ProfileValidationErrors>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setFetchError(null);

    try {
      const response = await profileApi.getProfile();
      const normalized = sanitizeProfileDraft(toFormValues(response));

      setProfile(normalized);
      setDraft(normalized);
      setErrors({});
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : String(i18n.t("candidate.profile.errors.loadFailed"));

      setFetchError(message);

      const fallback = {
        ...DEFAULT_PROFILE_VALUES,
        fullName: String(i18n.t("candidate.profile.fallback.fullName")),
        currentTitle: String(i18n.t("candidate.profile.fallback.currentTitle")),
        yearsOfExperience: 0,
      };

      setProfile(fallback);
      setDraft(fallback);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const dirty = useMemo(() => {
    if (!profile) {
      return false;
    }

    return !isEqualProfile(profile, sanitizeProfileDraft(draft));
  }, [profile, draft]);

  const profileStrength = useMemo(() => {
    const hasValidationError =
      Object.keys(errors).length > 0 || Boolean(saveError);
    return computeProfileStrength(draft, hasValidationError);
  }, [draft, errors, saveError]);

  const updateField = useCallback(
    <K extends keyof CandidateProfileFormValues>(
      field: K,
      value: CandidateProfileFormValues[K]
    ) => {
      setDraft((previous) => ({ ...previous, [field]: value }));
      setSuccess(false);
      setSaveError(null);

      // eslint-disable-next-line security/detect-object-injection
      if (errors[field]) {
        setErrors((previous) => {
          const next = { ...previous };
          // eslint-disable-next-line security/detect-object-injection
          delete next[field];
          return next;
        });
      }
    },
    [errors]
  );

  const discardChanges = useCallback(() => {
    if (!profile) {
      return;
    }

    setDraft(profile);
    setErrors({});
    setSaveError(null);
    setSuccess(false);
  }, [profile]);

  const saveChanges = useCallback(async (): Promise<boolean> => {
    const sanitized = sanitizeProfileDraft(draft);
    const validation = validateProfileForm(sanitized);

    setErrors(validation.errors);
    setSuccess(false);
    setSaveError(null);

    if (!validation.isValid) {
      return false;
    }

    setSaving(true);

    try {
      const updated = await profileApi.updateProfile(
        toProfilePayload(sanitized)
      );
      const normalized = sanitizeProfileDraft(toFormValues(updated));

      setProfile(normalized);
      setDraft(normalized);
      setErrors({});
      setSuccess(true);

      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : String(i18n.t("candidate.profile.errors.saveFailed"));

      setSaveError(message);
      return false;
    } finally {
      setSaving(false);
    }
  }, [draft]);

  const clearSuccess = useCallback(() => {
    setSuccess(false);
  }, []);

  return {
    profile,
    draft,
    errors,
    loading,
    saving,
    success,
    fetchError,
    saveError,
    dirty,
    profileStrength,
    updateField,
    discardChanges,
    saveChanges,
    clearSuccess,
  };
};
