import React, { useState } from "react";
import { useHeadhunterDashboard } from "../hooks/useHeadhunterDashboard";
import { DashboardSkeleton } from "../../shared/components/DashboardSkeleton";
import { PerformanceKPIs } from "../components/PerformanceKPIs";
import { HiringFunnel } from "../components/HiringFunnel";
import { UpcomingInterviews } from "../components/UpcomingInterviews";
import { PendingCandidates } from "../components/PendingCandidates";
import { JobDashboardFilter } from "../components/JobDashboardFilter";
import type { DashboardFilterOptions } from "../../types";

/**
 * HeadhunterDashboardPage
 * Dashboard cho Headhunter (DASH-03: Hiệu suất cá nhân)
 */
export const HeadhunterDashboardPage: React.FC = () => {
  const [filters, setFilters] = useState<DashboardFilterOptions>({});

  // TODO: Get headhunterId from current user context
  const headhunterId = "current-user-id";

  const {
    kpis,
    hiringFunnel,
    upcomingInterviews,
    pendingCandidates,
    isLoading,
    error,
    refetch,
  } = useHeadhunterDashboard(headhunterId, filters);

  const handleFilterChange = (newFilters: DashboardFilterOptions) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Headhunter Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Personal Performance & Metrics</p>
        </div>
        <button
          onClick={refetch}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Filter */}
      <section className="bg-white rounded-lg shadow p-4">
        <JobDashboardFilter
          onFilterChange={handleFilterChange}
          isLoading={isLoading}
        />
      </section>

      {/* Performance KPIs */}
      <section>
        {isLoading ? (
          <DashboardSkeleton count={4} />
        ) : (
          <PerformanceKPIs data={kpis} isLoading={isLoading} />
        )}
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hiring Funnel (wider section) */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <DashboardSkeleton count={1} />
          ) : (
            <HiringFunnel data={hiringFunnel} />
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Interviews */}
          {isLoading ? (
            <DashboardSkeleton count={1} />
          ) : (
            <UpcomingInterviews data={upcomingInterviews} />
          )}

          {/* Pending Candidates */}
          {isLoading ? (
            <DashboardSkeleton count={1} />
          ) : (
            <PendingCandidates data={pendingCandidates} />
          )}
        </div>
      </div>
    </div>
  );
};
