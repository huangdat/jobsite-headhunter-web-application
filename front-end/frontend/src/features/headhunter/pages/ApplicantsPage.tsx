import { useEffect, useState } from "react";
import { useJobsTranslation } from "@/shared/hooks";
import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader } from "@/shared/components/layout";

export function ApplicantsPage() {
  const { t } = useJobsTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <PageContainer variant="white" maxWidth="4xl">
        <div className="p-8 text-slate-900 dark:text-slate-100">
          {t("loadingApplicants")}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer variant="white" maxWidth="4xl">
      <PageHeader
        variant="default"
        title={t("candidates")}
        description={t("applicantPageInfo")}
      />

      <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800 dark:text-slate-100">
        {t("noApplicantsYet")}
      </div>

      <div className="mt-6">
        <Button
          onClick={() => window.location.reload()}
          className="dark:bg-slate-700 dark:hover:bg-slate-600"
        >
          {t("refresh")}
        </Button>
      </div>
    </PageContainer>
  );
}

export default ApplicantsPage;
