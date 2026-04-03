import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import type { DashboardFilterOptions } from "../../types";

interface JobDashboardFilterProps {
  onFilterChange: (filters: DashboardFilterOptions) => void;
  isLoading?: boolean;
}

/**
 * JobDashboardFilter - DASH-03
 * Dropdown lọc toàn bộ dashboard theo Job cụ thể (AC requirement)
 * Cho phép theo dõi performance của một job cụ thể
 */
export const JobDashboardFilter: React.FC<JobDashboardFilterProps> = ({
  onFilterChange,
  isLoading = false,
}) => {
  const { t } = useTranslation("dashboard");
  const [selectedJobId, setSelectedJobId] = useState<string>("");

  const handleJobChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const jobId = e.target.value;
    setSelectedJobId(jobId);
    onFilterChange({ jobId: jobId || undefined });
  };

  return (
    <div className="flex items-center gap-4">
      <label
        htmlFor="job-filter"
        className="text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap"
      >
        <span className="inline-block mr-2">🎯</span>
        {t("headhunter.dashboard.filter.jobFilter", "Filter by Job")}
      </label>
      <select
        id="job-filter"
        value={selectedJobId}
        onChange={handleJobChange}
        disabled={isLoading}
        className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <option value="">
          {t("headhunter.dashboard.filter.allJobs", "All Jobs")}
        </option>
        {/* TODO: Load jobs from API call: useHeadhunterJobs() */}
        {/* Example options below - will be replaced with dynamic data from backend */}
        <option value="job-1">Senior Frontend Developer</option>
        <option value="job-2">Backend Engineer (Node.js)</option>
        <option value="job-3">Full Stack Developer</option>
        <option value="job-4">DevOps Engineer</option>
      </select>
    </div>
  );
};
