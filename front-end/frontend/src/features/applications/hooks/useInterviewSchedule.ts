import { useState, useCallback, useEffect } from "react";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { toast } from "sonner";
import type { InterviewScheduleFormData, Interview } from "../types";
import {
  createInterview,
  getInterviewByApplicationId,
} from "../services/applicationsApi";

interface UseInterviewScheduleOptions {
  applicationId: number;
  onSuccess?: (interview: Interview) => void;
  autoFetch?: boolean;
}

export const useInterviewSchedule = (options: UseInterviewScheduleOptions) => {
  const { applicationId, onSuccess, autoFetch = false } = options;
  const { t } = useAppTranslation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [interviews, setInterviews] = useState<Interview[]>([]);

  const fetchInterviews = useCallback(async () => {
    if (!applicationId) return;
    setIsLoading(true);
    try {
      const data = await getInterviewByApplicationId(applicationId);

      setInterviews(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("Fetch interview error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    if (autoFetch) {
      fetchInterviews();
    }
  }, [autoFetch, fetchInterviews]);

  const handleSubmit = useCallback(
    async (data: InterviewScheduleFormData) => {
      setIsSubmitting(true);
      try {
        const interview = await createInterview(applicationId, data);
        toast.success(t("applications.success.interviewScheduled"));

        setInterviews((prev) => [...prev, interview]);

        if (onSuccess) {
          onSuccess(interview);
        }
      } catch (err: unknown) {
        const errorMsg = err?.message || t("common.error");
        toast.error(errorMsg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [applicationId, onSuccess, t]
  );

  return {
    isSubmitting,
    isLoading,
    interviews,
    fetchInterviews,
    handleSubmit,
  };
};
