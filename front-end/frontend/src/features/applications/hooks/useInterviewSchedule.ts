import { useState, useCallback } from "react";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { toast } from "sonner";
import type { InterviewScheduleFormData, Interview } from "../types";
import { createInterview } from "../services/applicationsApi";

interface UseInterviewScheduleOptions {
  applicationId: number;
  onSuccess?: (interview: Interview) => void;
}

export const useInterviewSchedule = (options: UseInterviewScheduleOptions) => {
  const { applicationId, onSuccess } = options;
  const { t } = useAppTranslation();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (data: InterviewScheduleFormData) => {
      setIsSubmitting(true);
      try {
        const interview = await createInterview(applicationId, data);

        toast.success(t("applications.success.interviewScheduled"));

        if (onSuccess) {
          onSuccess(interview);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : t("common.error");
        toast.error(errorMsg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [applicationId, onSuccess, t]
  );

  return {
    isSubmitting,
    handleSubmit,
  };
};
