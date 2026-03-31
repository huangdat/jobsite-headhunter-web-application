import { useState, useCallback } from "react";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { toast } from "sonner";
import type { InterviewScheduleFormData, Interview } from "../types";
import { createInterview } from "../services/applicationsApi";
import { validateInterviewScheduleForm } from "../utils";

interface UseInterviewScheduleOptions {
  applicationId: number;
  onSuccess?: (interview: Interview) => void;
}

export const useInterviewSchedule = (options: UseInterviewScheduleOptions) => {
  const { applicationId, onSuccess } = options;
  const { t } = useAppTranslation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Partial<InterviewScheduleFormData>>({
    interviewType: undefined,
    scheduledAt: "",
    durationMinutes: 30,
    meetingLink: "",
    location: "",
    notes: "",
  });

  /**
   * Validate interview form
   */
  const validateForm = useCallback((): boolean => {
    const validationErrors = validateInterviewScheduleForm(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [formData]);

  /**
   * Handle form field change
   */
  const handleFieldChange = useCallback(
    (field: keyof InterviewScheduleFormData, value: string | number) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      // Clear error for this field
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  /**
   * Submit interview schedule
   */
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      toast.error(t("applications.interview.title"));
      return;
    }

    setIsSubmitting(true);
    try {
      const interview = await createInterview(
        applicationId,
        formData as InterviewScheduleFormData
      );
      toast.success(t("applications.success.interviewScheduled"));

      if (onSuccess) {
        onSuccess(interview);
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to schedule interview";
      toast.error(errorMsg);
      setErrors((prev) => ({ ...prev, submit: errorMsg }));
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, applicationId, formData, onSuccess, t]);

  /**
   * Reset form
   */
  const resetForm = useCallback(() => {
    setFormData({
      interviewType: undefined,
      scheduledAt: "",
      durationMinutes: 30,
      meetingLink: "",
      location: "",
      notes: "",
    });
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    handleFieldChange,
    handleSubmit,
    resetForm,
  };
};
