import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getCompanyById } from "../services/companyApi";
import type { BusinessProfileResp } from "@/shared/utils/businessProfileService";

export function useCompanyDetail(id: string | undefined) {
  const [company, setCompany] = useState<BusinessProfileResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchCompany = async () => {
      try {
        setLoading(true);
        const data = await getCompanyById(id);
        setCompany(data);
      } catch (err) {
        console.error(err);
        setError(t("failedToLoadProfile"));
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id, t]);

  return { company, loading, error };
}
