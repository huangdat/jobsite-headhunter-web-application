import React from "react";
import type { UpcomingInterview } from "../../types";
import { dashboardFormatters } from "../../shared/utils/dashboardFormatters";

interface UpcomingInterviewsProps {
  data: UpcomingInterview[] | undefined;
  isLoading?: boolean;
}

/**
 * UpcomingInterviews - DASH-03
 * Section bên phải: Lịch phỏng vấn sắp tới
 */
export const UpcomingInterviews: React.FC<UpcomingInterviewsProps> = ({
  data,
  isLoading = false,
}) => {
  if (isLoading) {
    return <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Upcoming Interviews
        </h3>
        <p className="text-gray-500">No upcoming interviews</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Upcoming Interviews
      </h3>
      <div className="space-y-3">
        {data.map((interview) => (
          <div
            key={interview.id}
            className="border-l-4 border-blue-500 pl-4 py-2"
          >
            <p className="font-semibold text-gray-900">
              {interview.candidateName}
            </p>
            <p className="text-sm text-gray-600">{interview.jobTitle}</p>
            <p className="text-xs text-gray-500 mt-1">
              {dashboardFormatters.formatDate(interview.scheduledDate)} at{" "}
              {interview.scheduledTime}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
