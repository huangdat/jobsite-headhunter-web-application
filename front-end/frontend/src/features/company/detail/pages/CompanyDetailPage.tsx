import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/shared/ui-primitives/button";
import { SmallText } from "@/shared/common-blocks/typography/Typography";
import { PageSkeleton } from "@/shared/common-blocks/states";
import { ErrorState } from "@/shared/common-blocks/states/ErrorState";
import { useCompanyDetail } from "../hooks/useCompanyDetail";
import { CompanyHeader } from "../components/CompanyHeader";
import { CompanyAbout } from "../components/CompanyAbout";
import { CompanyJobs } from "../components/CompanyJobs";

export function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { company, loading, error } = useCompanyDetail(id);

  if (loading) {
    return <PageSkeleton variant="grid" count={2} />;
  }

  if (error || !company) {
    return (
      <ErrorState
        error={new Error(error || t("business.strength.no_data"))}
        onRetry={() => window.location.reload()}
        title={t("applications.errorLoading")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ChevronLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          <SmallText weight="bold" className="text-inherit cursor-pointer">
            {t("business.form.back")}
          </SmallText>
        </Button>

        <CompanyHeader company={company} />

        <CompanyAbout description={company.noteByAdmin} />

        <CompanyJobs businessProfileId={company.id} />
      </div>
    </div>
  );
}
