import { useTranslation } from "react-i18next";

interface Props {
  description?: string;
}

export function CompanyAbout({ description }: Props) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">
        {t("business.form.company_identity")}
      </h2>
      <div className="text-slate-600 leading-relaxed whitespace-pre-line">
        {description || t("business.strength.no_data")}
      </div>
    </div>
  );
}
