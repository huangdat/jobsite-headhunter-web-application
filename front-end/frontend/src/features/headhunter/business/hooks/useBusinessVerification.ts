/**
 * Main Business Verification Hook
 * Orchestrates form state, API calls, and verification flow
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { useBusinessTranslation } from "@/shared/hooks/useFeatureTranslation";
import type {
  BusinessProfile,
  BusinessFormData,
  VerificationStep,
  SubmittedDocument,
  ProfileStrengthData,
  SubmitProfileRequest,
} from "../types/business.types";
import businessApi from "../services/businessApi";
import { useFormValidation } from "./useFormValidation";

export interface UseBusinessVerificationOptions {
  autoFetchStatus?: boolean;
  pollInterval?: number;
}

const INITIAL_FORM_DATA: BusinessFormData = {
  companyName: "",
  taxId: "",
  companySize: "STARTUP", // Default to STARTUP, users can change
  website: "",
  headquartersAddress: "",
};

/**
 * Main hook for business profile verification
 * Manages form, API calls, and status tracking
 */
export const useBusinessVerification = (
  options: UseBusinessVerificationOptions = {}
) => {
  const { t } = useBusinessTranslation();
  const { autoFetchStatus = true, pollInterval = 10000 } = options;

  // Form state
  const [formData, setFormData] = useState<BusinessFormData>(INITIAL_FORM_DATA);
  const formValidation = useFormValidation({
    validateOnBlur: true,
    validateOnChange: false,
  });

  // Profile state
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [verificationSteps, setVerificationSteps] = useState<
    VerificationStep[]
  >([]);
  const [documents, setDocuments] = useState<SubmittedDocument[]>([]);
  const [profileStrength, setProfileStrength] =
    useState<ProfileStrengthData | null>(null);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Refs
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Handle form field change
   */
  const handleFieldChange = useCallback(
    (fieldName: keyof BusinessFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [fieldName]: value }));
      formValidation.handleFieldChange(fieldName, value);
      setErrorMessage(null); // Clear error when user starts typing
    },
    [formValidation]
  );

  /**
   * Handle form field blur
   */
  const handleFieldBlur = useCallback(
    (fieldName: keyof BusinessFormData, value: string) => {
      formValidation.handleFieldBlur(fieldName, value);
    },
    [formValidation]
  );

  /**
   * Fetch profile status
   */
  const fetchProfileStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await businessApi.getProfileStatus();
      setProfile(response.profile);
      setVerificationSteps(response.verificationSteps);
      setDocuments(response.documents);
      setProfileStrength(response.profileStrength);
      setErrorMessage(null);
    } catch (error) {
      console.error("Failed to fetch profile status:", error);
      const errorMsg =
        error instanceof Error ? error.message : t("failedToLoadProfile");
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  /**
   * Submit profile for verification
   */
  const submitProfile = useCallback(
    async (documents?: File[]) => {
      // Validate form first
      const errors = formValidation.validateAllFields(formData);
      if (Object.keys(errors).length > 0) {
        formValidation.setErrors(errors);
        setErrorMessage("business.error.validation");
        return false;
      }

      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      try {
        const request: SubmitProfileRequest = {
          ...formData,
          documents,
        };

        const response = await businessApi.submitProfile(request);

        if (
          response.success &&
          response.profile &&
          response.verificationSteps
        ) {
          setProfile(response.profile);
          setVerificationSteps(response.verificationSteps);
          setFormData(INITIAL_FORM_DATA);
          formValidation.clearAllErrors();
          formValidation.resetTouched();
          setSuccessMessage("business.success.submitted");

          // Fetch strength data
          const strength = await businessApi.getProfileStrength();
          setProfileStrength(strength);

          return true;
        } else {
          setErrorMessage(
            response.error?.message || "business.error.submission"
          );
          return false;
        }
      } catch (error) {
        console.error("Submission error:", error);
        const errorMsg =
          error instanceof Error ? error.message : "business.error.server";
        setErrorMessage(errorMsg);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, formValidation]
  );

  /**
   * Clear messages
   */
  const clearMessages = useCallback(() => {
    setSuccessMessage(null);
    setErrorMessage(null);
  }, []);

  /**
   * Reset form
   */
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    formValidation.clearAllErrors();
    formValidation.resetTouched();
    clearMessages();
  }, [formValidation, clearMessages]);

  /**
   * Polling for status updates
   * TODO: Enable when backend endpoints are ready
   */
  useEffect(() => {
    // Polling disabled - backend endpoints not implemented yet
    return;

    // Original polling logic (commented out):
    // if (!autoFetchStatus || !profile) return;
    // const startPolling = () => {
    //   pollTimeoutRef.current = setTimeout(() => {
    //     fetchProfileStatus();
    //     startPolling();
    //   }, pollInterval);
    // };
    // startPolling();
    // return () => {
    //   if (pollTimeoutRef.current) {
    //     clearTimeout(pollTimeoutRef.current);
    //   }
    // };
  }, [autoFetchStatus, profile, pollInterval, fetchProfileStatus]);

  /**
   * Initial fetch - only run once on mount
   */
  useEffect(() => {
    if (autoFetchStatus) {
      // TODO: Enable when backend endpoints are ready
      // fetchProfileStatus();
    }
    // Only run on mount - do not add fetchProfileStatus to dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetchStatus]);

  return {
    // Form data & validation
    formData,
    formErrors: formValidation.errors,
    touchedFields: formValidation.touchedFields,
    isFormValid: formValidation.isValid,

    // Form methods
    handleFieldChange,
    handleFieldBlur,
    setFormData,
    resetForm,

    // Profile data
    profile,
    verificationSteps,
    documents,
    profileStrength,

    // UI state
    isLoading,
    isSubmitting,
    successMessage,
    errorMessage,

    // Methods
    submitProfile,
    fetchProfileStatus,
    clearMessages,
  };
};

export default useBusinessVerification;
