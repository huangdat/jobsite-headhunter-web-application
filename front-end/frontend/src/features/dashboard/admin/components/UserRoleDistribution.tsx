import React from "react";
import type { UserRoleStats } from "../../types";

interface UserRoleDistributionProps {
  data: UserRoleStats | undefined;
  isLoading?: boolean;
}

/**
 * UserRoleDistribution - DASH-06
 * Biểu đồ phân bổ vai trò (ADMIN, CANDIDATE...)
 */
export const UserRoleDistribution: React.FC<UserRoleDistributionProps> = ({
  data,
  isLoading = false,
}) => {
  if (isLoading) {
    return <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        User Role Distribution
      </h3>
      {data ? (
        <div className="space-y-3">
          {Object.entries(data).map(([role, count]) => (
            <div key={role} className="flex items-center justify-between">
              <span className="text-gray-600">{role}</span>
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
