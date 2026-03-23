import { useState } from "react";
import { JobManagePage } from "@/features/jobs/pages/JobManagePage";
import { JobCreatePage } from "@/features/jobs/pages/JobCreatePage";
import { ApplicantsPage } from "@/features/headhunter/pages/ApplicantsPage";

export function JobsHubPage() {
  const [tab, setTab] = useState<"list" | "create" | "applicants">("list");

  return (
    <div className="px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Tin tuyển dụng</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setTab("list")}
            className={`px-3 py-1 rounded ${tab === "list" ? "bg-[var(--brand-primary)] text-black" : "bg-white text-slate-700 border"}`}
          >
            Danh sách
          </button>
          <button
            onClick={() => setTab("create")}
            className={`px-3 py-1 rounded ${tab === "create" ? "bg-[var(--brand-primary)] text-black" : "bg-white text-slate-700 border"}`}
          >
            Đăng tin mới
          </button>
          <button
            onClick={() => setTab("applicants")}
            className={`px-3 py-1 rounded ${tab === "applicants" ? "bg-[var(--brand-primary)] text-black" : "bg-white text-slate-700 border"}`}
          >
            Ứng viên
          </button>
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
