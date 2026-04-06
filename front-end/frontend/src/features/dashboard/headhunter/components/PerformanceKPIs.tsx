import React from "react";
import { useTranslation } from "react-i18next";
import type { HeadhunterKPI } from "../../types";
import { StatCard } from "../../shared/components/StatCard";

interface PerformanceKPIsProps {
  data: HeadhunterKPI | undefined;
  isLoading?: boolean;
}

/**
 * PerformanceKPIs - DASH-03
 * Các card: Tổng Job, Ứng tuyển, Time-to-hire, Conversion Rate
 * Responsive grid với icons và color themes
 */
export const PerformanceKPIs: React.FC<PerformanceKPIsProps> = ({
  data,
  isLoading = false,
}) => {
  const { t } = useTranslation("dashboard");

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-32 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <p className="text-slate-500 dark:text-slate-400">
        {t("common.noData", "No data available")}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Jobs Card */}
      <StatCard
        title={t("headhunter.dashboard.totalJobs", "Total Jobs")}
        value={data.totalJobs}
        icon="💼"
        color="blue"
        trend="up"
        trendValue="+2"
      />

      {/* Active Applications Card */}
      <StatCard
        title={t(
          "headhunter.dashboard.activeApplications",
          "Active Applications"
        )}
        value={data.totalApplications}
        icon="📝"
        color="emerald"
        trend="up"
        trendValue="+8%"
      />

      {/* Time-to-Hire Card */}
      <StatCard
        title={t("headhunter.dashboard.timeToHire", "Avg Time-to-Hire")}
        value={`${data.timeToHire || 0} ${t("headhunter.dashboard.days", "days")}`}
        icon="⏱️"
        color="purple"
        trend="down"
        trendValue="-2 days"
        subtitle="Industry avg: 28 days"
      />

      {/* Hiring Success Card */}
      <StatCard
        title={t("headhunter.dashboard.hiringSuccess", "Hiring Success")}
        value={`${data.hiringSuccess || 0}%`}
        icon="📈"
        color="yellow"
        trend="up"
        trendValue="+5%"
      />
    </div>
  );
};
