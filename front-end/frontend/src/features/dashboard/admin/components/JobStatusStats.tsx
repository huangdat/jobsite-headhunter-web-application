import React from "react";
import type { JobStatusStats } from "../../types";

interface JobStatusStatsComponentProps {
  data: JobStatusStats | undefined;
  isLoading?: boolean;
}

/**
 * JobStatusStats - DASH-06
 * Thống kê trạng thái Job (OPEN, CLOSED...)
 */
export const JobStatusStatsComponent: React.FC<
  JobStatusStatsComponentProps
> = ({ data, isLoading = false }) => {
  if (isLoading) {
    return <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Job Status Statistics
      </h3>
      {data ? (
        <div className="space-y-3">
          {Object.entries(data).map(([status, count]) => (
            <div key={status} className="flex items-center justify-between">
              <span className="text-gray-600">{status}</span>
              <span className="font-semibold text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No data available</p>
      )}
    </div>
  );
};
