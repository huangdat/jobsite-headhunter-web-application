import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import { DashboardSkeleton } from "../../shared/components/DashboardSkeleton";
import { UserRoleDistribution } from "../components/UserRoleDistribution";
import { JobStatusStatsComponent } from "../components/JobStatusStats";
import { SystemOverviewCards } from "../components/SystemOverviewCards";
import { PageContainer, PageHeader } from "@/shared/components/layout";

/**
 * AdminDashboardPage
 * Dashboard cho Admin (DASH-06 & DASH-07: Thống kê hệ thống)
 * Các acceptance criteria:
 * - DASH-06: Hiển thị số lượng chính xác của 4 vai trò (không có phần trăm), có lọc theo ngày
 * - DASH-07: Hiển thị số lượng trạng thái công việc (OPEN, CLOSED, DRAFT), có lọc theo vai trò
 */
export const AdminDashboardPage: React.FC = () => {
  const { t } = useTranslation("dashboard");
  const {
    userRoleStats,
    jobStatusStats,
    systemOverviewStats,
    isLoading,
    error,
    refetch,
  } = useAdminDashboard();

  // Date range filter state (for DASH-06 AC2)
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const handleApplyDateFilter = () => {
    if (dateFrom && dateTo) {
      // TODO: Call refetch with date range parameters
      // refetch({ startDate: dateFrom, endDate: dateTo });
      refetch();
    }
  };

  if (error) {
    return (
      <PageContainer variant="white" maxWidth="6xl">
        <div className="flex items-center justify-center min-h-100">
          <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl max-w-md">
            <h2 className="text-red-800 dark:text-red-400 font-semibold">
              {t("error.failedToLoad", "Error loading dashboard")}
            </h2>
            <p className="text-red-600 dark:text-red-300 text-sm mt-1">
              {error}
            </p>
            <button
              onClick={refetch}
              className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              {t("common.retry", "Retry")}
            </button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer variant="default" maxWidth="7xl">
      <PageHeader
        variant="bordered"
        title={t("admin.dashboard.title", "Admin Dashboard")}
        description={t(
          "admin.dashboard.subtitle",
          "System Statistics & Overview"
        )}
      />

      <div className="space-y-6">
        {/* Date Range Filter Section (DASH-06 AC2: Time-based filtering) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <SectionTitle className="mb-4">
            {t("admin.dashboard.filter.timeRange", "Filter by Date Range")}
          </SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* From Date */}
            <div>
              <LabelText>{t("admin.dashboard.filter.from", "From")}</LabelText>
              <input
                type="date"
                title={t("admin.dashboard.filter.from", "From")}
                placeholder={t(
                  "admin.dashboard.filter.fromPlaceholder",
                  "From date"
                )}
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* To Date */}
            <div>
              <LabelText>{t("admin.dashboard.filter.to", "To")}</LabelText>
              <input
                type="date"
                title={t("admin.dashboard.filter.to", "To")}
                placeholder={t(
                  "admin.dashboard.filter.toPlaceholder",
                  "To date"
                )}
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Apply Button */}
            <div className="flex items-end">
              <button
                onClick={handleApplyDateFilter}
                disabled={!dateFrom || !dateTo || isLoading}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading
                  ? t("common.loading", "Loading...")
                  : t("admin.dashboard.filter.apply", "Apply")}
              </button>
            </div>
          </div>
        </div>

        {/* System Overview Cards */}
        {isLoading ? (
          <DashboardSkeleton count={5} />
        ) : (
          systemOverviewStats && (
            <SystemOverviewCards
              data={systemOverviewStats}
              isLoading={isLoading}
            />
          )
        )}

        {/* Statistics Grid - DASH-06 & DASH-07 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Role Distribution - DASH-06 */}
          <section>
            {isLoading ? (
              <DashboardSkeleton count={1} />
            ) : userRoleStats ? (
              <UserRoleDistribution
                data={userRoleStats}
                isLoading={isLoading}
              />
            ) : (
              <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-slate-500 dark:text-slate-400">
                  {t("common.noData", "No data available")}
                </p>
              </div>
            )}
          </section>

          {/* Job Status Stats - DASH-07 */}
          <section>
            {isLoading ? (
              <DashboardSkeleton count={1} />
            ) : jobStatusStats ? (
              <JobStatusStatsComponent
                data={jobStatusStats}
                isLoading={isLoading}
              />
            ) : (
              <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-slate-500 dark:text-slate-400">
                  {t("common.noData", "No data available")}
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </PageContainer>
  );
};
