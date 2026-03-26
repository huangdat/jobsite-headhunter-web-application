import { useTranslation } from "react-i18next";
import { JobManagePage } from "@/features/jobs/pages/JobManagePage";
import { JobCreatePage } from "@/features/jobs/pages/JobCreatePage";
import { ApplicantsPage } from "@/features/headhunter/pages/ApplicantsPage";
import { Button } from "@/components/ui/button";

export function JobsHubPage() {
  const { t } = useTranslation("jobs");

  return (
    <div className="px-4 py-6">
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-2xl font-semibold min-w-0">
          {t("headhunter.jobPostings")}
        </h2>
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-3">
            <Button
              size="sm"
              variant={tab === "list" ? "primary" : "outline"}
              onClick={() => setTab("list")}
              aria-pressed={tab === "list"}
              className="w-auto whitespace-nowrap"
            >
              {t("headhunter.list")}
            </Button>
            <Button
              size="sm"
              variant={tab === "create" ? "primary" : "outline"}
              onClick={() => setTab("create")}
              aria-pressed={tab === "create"}
              className="w-auto whitespace-nowrap"
            >
              {t("headhunter.postNewJob")}
            </Button>
            <Button
              size="sm"
              variant={tab === "applicants" ? "primary" : "outline"}
              onClick={() => setTab("applicants")}
              aria-pressed={tab === "applicants"}
              className="w-auto whitespace-nowrap"
            >
              {t("headhunter.candidates")}
            </Button>
          </div>
        </div>
      </div>

      <div>
        {tab === "list" && <JobManagePage />}
        {tab === "create" && <JobCreatePage />}
        {tab === "applicants" && <ApplicantsPage />}
      </div>
    </div>
  );
}

export default JobsHubPage;
