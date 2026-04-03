import React from "react";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import { DashboardSkeleton } from "../../shared/components/DashboardSkeleton";
import { UserRoleDistribution } from "../components/UserRoleDistribution";
import { JobStatusStatsComponent } from "../components/JobStatusStats";
import { SystemOverviewCards } from "../components/SystemOverviewCards";

/**
 * AdminDashboardPage
 * Dashboard cho Admin (DASH-06 & DASH-07: Thống kê hệ thống)
 */
export const AdminDashboardPage: React.FC = () => {
  const {
    userRoleStats,
    jobStatusStats,
    systemOverviewStats,
    isLoading,
    error,
    refetch,
  } = useAdminDashboard();

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-red-800 font-semibold">Error loading dashboard</h2>
        <p className="text-red-600 text-sm mt-1">{error}</p>
        <button
          onClick={refetch}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">System Statistics & Overview</p>
      </div>

      {/* System Overview Cards */}
      <section>
        {isLoading ? (
          <DashboardSkeleton count={5} />
        ) : (
          <SystemOverviewCards
            data={systemOverviewStats}
            isLoading={isLoading}
          />
        )}
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Role Distribution */}
        <section>
          {isLoading ? (
            <DashboardSkeleton count={1} />
          ) : (
            <UserRoleDistribution data={userRoleStats} isLoading={isLoading} />
          )}
        </section>

        {/* Job Status Stats */}
        <section>
          {isLoading ? (
            <DashboardSkeleton count={1} />
          ) : (
            <JobStatusStatsComponent
              data={jobStatusStats}
              isLoading={isLoading}
            />
          )}
        </section>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {isLoading ? "Loading..." : "Refresh"}
        </button>
      </div>
    </div>
  );
};
