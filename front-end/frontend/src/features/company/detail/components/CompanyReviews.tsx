import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";

export function CompanyReviews() {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-4 text-amber-400 fill-amber-400" />
        <h2 className="text-xl font-bold text-slate-900">
          {t("business.breadcrumb.profile")}
        </h2>
      </div>

      <p className="text-slate-500 italic">{t("business.strength.no_data")}</p>
    </div>
  );
}
