import { useEffect, useState } from "react";
import { useHomeTranslation } from "@/shared/hooks";
import {
  getTop10Companies,
  type BusinessProfileResp,
} from "@/shared/utils/businessProfileService";
import { COMPANY_LOGO_COLORS, HOME_SIZES } from "../constants";

export function TopCompanies() {
  const { t } = useHomeTranslation();
  const [companies, setCompanies] = useState<BusinessProfileResp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const data = await getTop10Companies();
        setCompanies(data);
      } catch (err) {
        console.error("Failed to fetch companies:", err);
        setError("Failed to load companies");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <section id="top-companies" className="bg-muted py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-12">
          {t("topCompanies.title")}
        </h2>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {t("messages.loadingCompanies")}
            </p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && companies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">{t("messages.noCompanies")}</p>
          </div>
        )}

        {!loading && !error && companies.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10">
            {companies.map((company) => (
              <div key={company.id} className="group cursor-pointer">
                <div
                  className={`${HOME_SIZES.COMPANY_LOGO_WIDTH} ${HOME_SIZES.COMPANY_LOGO_HEIGHT} bg-linear-to-br ${COMPANY_LOGO_COLORS.gradientStart} ${COMPANY_LOGO_COLORS.gradientEnd} rounded-full mb-4`}
                />

                <p className="font-medium">{company.companyName}</p>

                <p className="text-xs text-muted-foreground">
                  {t("topCompanies.openJobs")}
                </p>

                <p className="text-lime-900 text-xs mt-2 transition group-hover:translate-x-1">
                  {t("topCompanies.viewCompany")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
