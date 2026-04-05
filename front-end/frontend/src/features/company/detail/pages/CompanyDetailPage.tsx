import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Display, SmallText } from "@/shared/components/typography/Typography";
import { useCompanyDetail } from "../hooks/useCompanyDetail";
import { CompanyHeader } from "../components/CompanyHeader";
import { CompanyAbout } from "../components/CompanyAbout";
import { CompanyJobs } from "../components/CompanyJobs";
import { CompanyReviews } from "../components/CompanyReviews";

export function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { company, loading, error } = useCompanyDetail(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <SmallText variant="muted" weight="bold" className="animate-pulse">
          {t("business.state.loading")}
        </SmallText>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Display className="text-red-500">
          {error || t("business.strength.no_data")}
        </Display>
        <Button onClick={() => navigate(-1)}>
          <SmallText weight="bold" className="text-white">
            {t("business.form.back")}
          </SmallText>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ChevronLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          <SmallText weight="bold" className="text-inherit">
            {t("business.form.back")}
          </SmallText>
        </Button>

        <CompanyHeader company={company} />

        <CompanyAbout description={company.noteByAdmin} />

        <CompanyJobs />
        <CompanyReviews />
      </div>
    </div>
  );
}
