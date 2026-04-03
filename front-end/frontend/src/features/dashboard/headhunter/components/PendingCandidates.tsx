import React from "react";
import type { PendingCandidate } from "../../types";
import { dashboardFormatters } from "../../shared/utils/dashboardFormatters";

interface PendingCandidatesProps {
  data: PendingCandidate[] | undefined;
  isLoading?: boolean;
}

/**
 * PendingCandidates - DASH-03
 * Section bên phải: Danh sách chờ duyệt
 */
export const PendingCandidates: React.FC<PendingCandidatesProps> = ({
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
          Pending Candidates
        </h3>
        <p className="text-gray-500">No pending candidates</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Pending Candidates
      </h3>
      <div className="space-y-3">
        {data.map((candidate) => (
          <div
            key={candidate.id}
            className="border-l-4 border-orange-500 pl-4 py-2"
          >
            <p className="font-semibold text-gray-900">{candidate.name}</p>
            <p className="text-sm text-gray-600">{candidate.jobTitle}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-gray-500">
                Submitted:{" "}
                {dashboardFormatters.formatDate(candidate.submittedDate)}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  candidate.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {candidate.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
