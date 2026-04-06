import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { SmallText } from "@/shared/components/typography/Typography";
import { ErrorState } from "@/shared/components/states/ErrorState";
import { Breadcrumb } from "@/shared/components/navigation/Breadcrumb";
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
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<Error | null>(null);

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
        setIsLoadingProfile(true);
        setProfileError(null);
        const profile = await profileApi.getProfile();
        if (!isActive) return;

        setDefaultValues({
          fullName: profile.fullName || "",
          email: profile.email || "",
          phone: profile.phone || "",
        });
      } catch (error) {
        if (!isActive) return;
        console.error("Failed to load profile for application form", error);
        setProfileError(
          error instanceof Error
            ? error
            : new Error(t("errors.profileLoadFailed"))
        );
      } finally {
        if (isActive) {
          setIsLoadingProfile(false);
        }
      }
    };

    loadProfile();

    return () => {
      isActive = false;
    };
  }, [t]);

  // Show error state if profile loading failed
  if (profileError) {
    return (
      <PageContainer variant="white" maxWidth="4xl">
        <Breadcrumb
          items={[
            { label: t("breadcrumb.jobs") || "Jobs", href: "/jobs" },
            { label: t("applications.form.title") || "Apply" },
          ]}
          className="mb-6"
        />
        <PageHeader variant="default" title={t("applications.form.title")} />
        <ErrorState
          error={profileError}
          onRetry={() => window.location.reload()}
          title={t("errors.failedToLoadProfile", "Failed to load your profile")}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer variant="white" maxWidth="4xl">
      <Breadcrumb
        items={[
          { label: t("breadcrumb.jobs") || "Jobs", href: "/jobs" },
          { label: t("applications.form.title") || "Apply" },
        ]}
        className="mb-6"
      />
      <PageHeader variant="default" title={t("applications.form.title")} />

      {/* Form Card */}
      <Card className="p-8 border-none shadow-xl shadow-slate-200/60 rounded-3xl bg-white dark:bg-gray-800 dark:shadow-gray-900/20">
        <ApplicationForm
          onSubmit={handleSubmit}
          isLoading={isSubmitting || isLoadingProfile}
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
