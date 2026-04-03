import React, { useState } from "react";
import type { DashboardFilterOptions } from "../../types";

interface JobDashboardFilterProps {
  onFilterChange: (filters: DashboardFilterOptions) => void;
  isLoading?: boolean;
}

/**
 * JobDashboardFilter - DASH-03
 * Dropdown lọc toàn bộ dashboard theo Job
 */
export const JobDashboardFilter: React.FC<JobDashboardFilterProps> = ({
  onFilterChange,
  isLoading = false,
}) => {
  const [selectedJobId, setSelectedJobId] = useState<string>("");

  const handleJobChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const jobId = e.target.value;
    setSelectedJobId(jobId);
    onFilterChange({ jobId: jobId || undefined });
  };

  return (
    <div className="flex items-center gap-4">
      <label htmlFor="job-filter" className="text-sm font-medium text-gray-700">
        Filter by Job:
      </label>
      <select
        id="job-filter"
        value={selectedJobId}
        onChange={handleJobChange}
        disabled={isLoading}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
      >
        <option value="">All Jobs</option>
        {/* TODO: Load jobs from API */}
        <option value="job-1">Job 1</option>
        <option value="job-2">Job 2</option>
      </select>
    </div>
  );
};
