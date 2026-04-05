import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { SmallText } from "@/shared/components/typography/Typography";
import { ApplicationForm } from "../components/ApplicationForm";
import { useApplicationForm } from "../hooks/useApplicationForm";
import type { ApplicationFormData } from "../types";
import { profileApi } from "@/features/candidate/profile/services/profileApi";
import { PageContainer, PageHeader } from "@/shared/components/layout";

export const ApplyJobPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { t } = useAppTranslation();
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
    <PageContainer variant="white" maxWidth="4xl">
      <PageHeader variant="default" title={t("applications.form.title")} />

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
        <Button variant="outline" onClick={() => navigate(-1)}>
          <SmallText weight="bold" variant="muted">
            {t("applications.form.back")}
          </SmallText>
        </Button>
      </div>
    </PageContainer>
  );
};
