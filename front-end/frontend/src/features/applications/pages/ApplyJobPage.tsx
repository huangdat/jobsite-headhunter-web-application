import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { ApplicationForm } from "../components/ApplicationForm";
import { useApplicationForm } from "../hooks/useApplicationForm";
import type { ApplicationFormData } from "../types";
import { profileApi } from "@/features/candidate/profile/services/profileApi";
import { PageContainer, PageHeader } from "@/shared/components/layout";

export const ApplyJobPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { t } = useAppTranslation();
  const jobTitle = jobId ? "Software Engineer" : "Job Position";
  const [defaultValues, setDefaultValues] = useState<
    Partial<ApplicationFormData> | undefined
  >(undefined);

  const jobIdNum = jobId ? parseInt(jobId, 10) : 0;

  // 1. Hook useApplicationForm bây giờ chỉ cần quan tâm handleSubmit
  const { isSubmitting, handleSubmit } = useApplicationForm({
    jobId: jobIdNum,
    onSuccess: () => {
      navigate("/my-applications");
    },
  });

  // Mock job title - derived from jobId for now (no synchronous setState in effect)

  useEffect(() => {
    let isActive = true;

    const loadProfile = async () => {
      try {
        const profile = await profileApi.getProfile();
        if (!isActive) return;

        setDefaultValues({
          fullName: profile.fullName || "",
          email: profile.email || "",
          phone: profile.phone || "",
        });
      } catch (error) {
        console.error("Failed to load profile for application form", error);
      }
    };

    loadProfile();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <PageContainer variant="white" maxWidth="3xl">
      <PageHeader
        variant="default"
        title={t("applications.form.title")}
        description={
          <>
            {t("applications.form.submit")}
            <span className="text-emerald-600 ml-2 font-bold">{jobTitle}</span>
          </>
        }
      />

      {/* Form Card */}
      <Card className="p-8 border-none shadow-xl shadow-slate-200/60 rounded-3xl bg-white dark:bg-gray-800 dark:shadow-gray-900/20">
        <ApplicationForm
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          defaultValues={defaultValues}
        />
      </Card>

      {/* Back Button */}
      <div className="mt-10 text-center">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-8 py-2.5 bg-slate-100 hover:bg-slate-200 cursor-pointer text-slate-600 font-bold text-sm rounded-xl transition-all duration-200 active:scale-95 shadow-sm dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
        >
          {t("applications.form.back")}
        </button>
      </div>
    </PageContainer>
  );
};
