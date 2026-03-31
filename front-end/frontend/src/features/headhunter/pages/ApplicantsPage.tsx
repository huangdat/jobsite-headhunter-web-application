import { useEffect, useState } from "react";
import { useJobsTranslation } from "@/shared/hooks";
import { Button } from "@/components/ui/button";

export function ApplicantsPage() {
  const { t } = useJobsTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timeout);
  }, []);

  if (loading)
    return <div className="p-8">{t("loadingApplicants")}</div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h2 className="text-2xl font-semibold mb-4">
        {t("candidates")}
      </h2>
      <p className="text-sm text-slate-600 mb-6">
        {t("applicantPageInfo")}
      </p>
      <div className="rounded-lg bg-white p-6 shadow">
        {t("noApplicantsYet")}
      </div>
      <div className="mt-6">
        <Button onClick={() => window.location.reload()}>Refresh</Button>
      </div>
    </div>
  );
}

export default ApplicantsPage;

