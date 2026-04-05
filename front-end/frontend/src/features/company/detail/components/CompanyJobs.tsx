import { useTranslation } from "react-i18next";

export function CompanyJobs() {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-6">
      {/* Dùng key từ file jobs.json hoặc list.json của bạn */}
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">
        {t("navigation.jobs")}
      </h2>
      <p className="text-slate-500 italic">{t("business.state.loading")}</p>
    </div>
  );
}
