import { useEffect, useState } from "react";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { getTop10Companies, type BusinessProfileResp } from "@/shared/utils/businessProfileService";

export function TopCompanies() {
  const { t } = useAppTranslation();
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
        <h2 className="text-2xl font-bold mb-12">{t("home.topCompanies.title")}</h2>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading companies...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && companies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No companies found</p>
          </div>
        )}

        {!loading && !error && companies.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10">
            {companies.map((company) => (
              <div key={company.id} className="group cursor-pointer">
                <div className="w-24 h-24 bg-linear-to-br from-lime-400 to-lime-600 rounded-full mb-4" />

                <p className="font-medium">{company.companyName}</p>

                <p className="text-xs text-muted-foreground">{t("home.topCompanies.openJobs")}</p>

                <p className="text-lime-900 text-xs mt-2 transition group-hover:translate-x-1">
                  {t("home.topCompanies.viewCompany")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
