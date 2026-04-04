import { useTranslation } from "react-i18next";
import { MapPin, Users, Globe } from "lucide-react";
import type { BusinessProfileResp } from "@/shared/utils/businessProfileService";

interface Props {
  company: BusinessProfileResp;
}

export function CompanyHeader({ company }: Props) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-6">
      <div className="h-40 bg-gradient-to-r from-lime-200 to-emerald-200 relative">
        <div className="absolute -bottom-10 left-8 w-24 h-24 bg-white rounded-2xl p-1.5 shadow-lg border border-slate-100">
          <div className="w-full h-full bg-slate-50 rounded-xl flex items-center justify-center text-3xl font-black text-slate-300 uppercase">
            {company.companyName?.charAt(0) || "C"}
          </div>
        </div>
      </div>
      <div className="pt-14 px-8 pb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {company.companyName}
        </h1>

        <div className="mt-4 flex flex-wrap gap-3 text-sm font-medium text-slate-600">
          {company.addressMain && (
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              <MapPin className="w-4 h-4 text-slate-400" />
              {company.addressMain}
            </div>
          )}

          {company.companyScale && (
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              <Users className="w-4 h-4 text-slate-400" />
              {t("business.form.company_size")}: {company.companyScale}
            </div>
          )}

          {company.websiteUrl && (
            <a
              href={
                company.websiteUrl.startsWith("http")
                  ? company.websiteUrl
                  : `https://${company.websiteUrl}`
              }
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-lime-50 text-lime-700 hover:bg-lime-100 border border-lime-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              <Globe className="w-4 h-4 text-lime-600" />
              {t("business.form.website")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
