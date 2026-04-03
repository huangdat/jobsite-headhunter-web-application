import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
 * AC1: Data isolation - chỉ hiển thị data của jobs do user này sở hữu
 * AC2: Upcoming action items - Lịch phỏng vấn + danh sách ứng viên chờ duyệt
 * AC3: Empty state - khi job filter chưa có applications
 * AC4: Loading state - skeleton screens
 */
export const HeadhunterDashboardPage: React.FC = () => {
  const { t } = useTranslation("dashboard");
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
      <main className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl max-w-md">
          <h2 className="text-red-800 dark:text-red-400 font-semibold">
            {t("error.failedToLoad", "Error loading dashboard")}
          </h2>
          <p className="text-red-600 dark:text-red-300 text-sm mt-1">{error}</p>
          <button
            onClick={refetch}
            className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            {t("common.retry", "Retry")}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {t("headhunter.dashboard.title", "Headhunter Dashboard")}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              {t(
                "headhunter.dashboard.subtitle",
                "Personal Performance & Metrics"
              )}
            </p>
          </div>
          <button
            onClick={refetch}
            disabled={isLoading}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading
              ? t("common.loading", "Loading...")
              : t("headhunter.dashboard.refresh", "Refresh")}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-6 space-y-6">
        {/* Job Filter - AC3 ready with empty state handling */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <JobDashboardFilter
            onFilterChange={handleFilterChange}
            isLoading={isLoading}
          />
        </div>

        {/* Performance KPIs */}
        {isLoading ? (
          <DashboardSkeleton count={4} height="h-32" />
        ) : (
          kpis && <PerformanceKPIs data={kpis} isLoading={isLoading} />
        )}

        {/* Main Content Grid: Hiring Funnel (left) + Action Items (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hiring Funnel - Wider section */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <DashboardSkeleton count={1} height="h-80" />
            ) : hiringFunnel && hiringFunnel.length > 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <HiringFunnel data={hiringFunnel} />
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm text-center">
                <div className="py-12">
                  <p className="text-4xl mb-4">📊</p>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">
                    {t(
                      "headhunter.dashboard.emptyStateJobFilter",
                      "No application data for this job. Keep tracking!"
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Upcoming Interviews & Pending Candidates - AC2 */}
          <div className="space-y-6">
            {/* Upcoming Interviews - AC2: Show full details */}
            {isLoading ? (
              <DashboardSkeleton count={1} height="h-64" />
            ) : (
              <UpcomingInterviews data={upcomingInterviews} />
            )}

            {/* Pending Candidates - AC2: Action items */}
            {isLoading ? (
              <DashboardSkeleton count={1} height="h-64" />
            ) : (
              <PendingCandidates data={pendingCandidates} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
