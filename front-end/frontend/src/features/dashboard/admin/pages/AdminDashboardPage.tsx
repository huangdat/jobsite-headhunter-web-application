import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import { DashboardSkeleton } from "../../shared/components/DashboardSkeleton";
import { UserRoleDistribution } from "../components/UserRoleDistribution";
import { JobStatusStatsComponent } from "../components/JobStatusStats";
import { SystemOverviewCards } from "../components/SystemOverviewCards";
import { PageContainer, PageHeader } from "@/shared/common-blocks/layout";
import { Button } from "@/shared/ui-primitives/button";
import { ErrorState } from "@/shared/common-blocks/states";
import {
  SectionTitle,
  LabelText,
} from "@/shared/common-blocks/typography/Typography";

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
        <ErrorState
          error={new Error(error)}
          onRetry={refetch}
          title={t("error.failedToLoad", "Error loading dashboard")}
        />
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
              <Button
                onClick={handleApplyDateFilter}
                disabled={!dateFrom || !dateTo || isLoading}
                className="w-full"
              >
                {isLoading
                  ? t("common.loading", "Loading...")
                  : t("admin.dashboard.filter.apply", "Apply")}
              </Button>
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

