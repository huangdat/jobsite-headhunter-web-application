import { useState } from "react";
import { JobManagePage } from "@/features/jobs/pages/JobManagePage";
import { JobCreatePage } from "@/features/jobs/pages/JobCreatePage";
import { ApplicantsPage } from "@/features/headhunter/pages/ApplicantsPage";
import { Button } from "@/components/ui/button";

export function JobsHubPage() {
  const [tab, setTab] = useState<"list" | "create" | "applicants">("list");

  return (
    <div className="px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Tin tuyển dụng</h2>
        <div className="flex gap-2">
          <div className="flex gap-3">
            <Button
              size="sm"
              variant={tab === "list" ? "primary" : "outline"}
              onClick={() => setTab("list")}
              aria-pressed={tab === "list"}
            >
              Danh sách
            </Button>
            <Button
              size="sm"
              variant={tab === "create" ? "primary" : "outline"}
              onClick={() => setTab("create")}
              aria-pressed={tab === "create"}
            >
              Đăng tin mới
            </Button>
            <Button
              size="sm"
              variant={tab === "applicants" ? "primary" : "outline"}
              onClick={() => setTab("applicants")}
              aria-pressed={tab === "applicants"}
            >
              Ứng viên
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
