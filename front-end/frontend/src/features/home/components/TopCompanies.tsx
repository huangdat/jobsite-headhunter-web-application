import { useEffect, useState } from "react";
import { useHomeTranslation } from "@/shared/hooks";
import { Link } from "react-router-dom";
import {
  getTop10Companies,
  type BusinessProfileResp,
} from "@/shared/utils/businessProfileService";
import { COMPANY_LOGO_COLORS, HOME_SIZES } from "../constants";
import {
  SubsectionTitle,
  SmallText,
} from "@/shared/components/typography/Typography";

export function TopCompanies() {
  const { t, currentLanguage } = useHomeTranslation();
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
        setError(t("messages.errorLoadCompanies"));
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLanguage?.code]);

  return (
    <section id="top-companies" className="bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <SubsectionTitle className="mb-12">
          {t("topCompanies.title")}
        </SubsectionTitle>

        {loading && (
          <div className="text-center py-12">
            <SmallText variant="muted">
              {t("messages.loadingCompanies")}
            </SmallText>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <SmallText className="text-red-500">{error}</SmallText>
          </div>
        )}

        {!loading && !error && companies.length === 0 && (
          <div className="text-center py-12">
            <SmallText variant="muted">{t("messages.noCompanies")}</SmallText>
          </div>
        )}

        {!loading && !error && companies.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10">
            {companies.map((company) => (
              <Link
                to={`/companies/${company.id}`}
                key={company.id}
                className="group cursor-pointer block"
              >
                <div
                  className={`${HOME_SIZES.COMPANY_LOGO_WIDTH} ${HOME_SIZES.COMPANY_LOGO_HEIGHT} bg-linear-to-br ${COMPANY_LOGO_COLORS.gradientStart} ${COMPANY_LOGO_COLORS.gradientEnd} rounded-full mb-4`}
                />

                <SmallText weight="medium" className="block">
                  {company.companyName}
                </SmallText>

                <SmallText variant="muted" className="block text-xs">
                  {t("topCompanies.openJobs")}
                </SmallText>

                <SmallText
                  weight="semibold"
                  className="text-brand-primary mt-2 transition group-hover:translate-x-1 text-xs block"
                >
                  {t("topCompanies.viewCompany")}
                </SmallText>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
