/**
 * Main Business Verification Hook
 * Orchestrates form state, API calls, and verification flow
 */

import { useState, useCallback, useEffect } from "react";
import { useBusinessTranslation } from "@/shared/hooks/useFeatureTranslation";
import type {
  BusinessProfile,
  ProfileStrengthData,
  SubmittedDocument,
} from "../types/business.types";
import businessApi from "../services/businessApi";
import { useFormValidation } from "./useFormValidation";

// Local types for verification flow (not yet in backend)
export interface BusinessFormData {
  companyName: string;
  taxId: string;
  companySize: string;
  website: string;
  headquartersAddress: string;
}

export interface VerificationStep {
  id: string;
  status: "pending" | "in_progress" | "completed" | "rejected";
  label: string;
  completedAt?: string;
}

export interface SubmitProfileRequest extends BusinessFormData {
  documents?: File[];
}

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
  const { autoFetchStatus = true } = options;

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

  /**
   * Handle form field change
   */
  const handleFieldChange = useCallback(
    (fieldName: keyof BusinessFormData, value: string) => {
      setFormData((prev: BusinessFormData) => ({
        ...prev,
        [fieldName]: value,
      }));
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
   * TODO: Backend endpoints not yet implemented
   */
  const fetchProfileStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      // Using mock data - business profile API still in development
      const profile = await businessApi.getBusinessProfile();
      setProfile(profile);

      // Mock data until backend implements these endpoints
      setVerificationSteps([
        {
          id: "1",
          status:
            profile.verificationStatus === "APPROVED" ? "completed" : "pending",
          label: "business.verification.step.submit",
          completedAt:
            profile.verificationStatus === "APPROVED"
              ? new Date().toISOString()
              : undefined,
        },
      ]);
      setDocuments([]);
      setProfileStrength({
        percentage: 75,
        items: [],
        lastUpdatedAt: new Date().toISOString(),
      });
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
   * Using mock implementation - backend endpoints still in development
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
        // Mock implementation until backend API is ready
        console.log("Submit profile (mock):", { formData, documents });

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock successful response
        const mockProfile: BusinessProfile = {
          id: 1,
          companyName: formData.companyName,
          taxCode: formData.taxId,
          websiteUrl: formData.website,
          addressMain: formData.headquartersAddress,
          companyScale: formData.companySize,
          verificationStatus: "PENDING",
        };

        setProfile(mockProfile);
        setVerificationSteps([
          {
            id: "1",
            status: "in_progress",
            label: "business.verification.step.submit",
            completedAt: new Date().toISOString(),
          },
        ]);
        setFormData(INITIAL_FORM_DATA);
        formValidation.clearAllErrors();
        formValidation.resetTouched();
        setSuccessMessage("business.success.submitted");

        return true;
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
   * Initial fetch - only run once on mount
   * Commented out until backend endpoints are available
   */
  useEffect(() => {
    if (autoFetchStatus) {
      // fetchProfileStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
