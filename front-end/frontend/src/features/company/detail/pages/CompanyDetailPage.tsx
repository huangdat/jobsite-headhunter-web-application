import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronLeft } from "lucide-react";
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
        <p className="text-slate-500 font-medium animate-pulse">
          {t("business.state.loading")}
        </p>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-500 font-bold text-lg">
          {error || t("business.strength.no_data")}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-white font-bold transition cursor-pointer"
        >
          {t("business.form.back")}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm font-bold text-slate-500 hover:text-emerald-600 transition cursor-pointer flex items-center gap-2 group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          {t("business.form.back")}
        </button>

        <CompanyHeader company={company} />

        <CompanyAbout description={company.noteByAdmin} />

        <CompanyJobs />
        <CompanyReviews />
      </div>
    </div>
  );
}
