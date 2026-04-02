import { useJobsTranslation } from "@/shared/hooks";
import { JobManagePage } from "@/features/jobs/pages/JobManagePage";

export function JobsHubPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <JobManagePage />
    </div>
  );
}

export default JobsHubPage;
