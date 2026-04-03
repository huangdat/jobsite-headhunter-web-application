import React from "react";
import { useTranslation } from "react-i18next";
import type { HeadhunterKPI } from "../../types";
import { StatCard } from "../../shared/components/StatCard";
import { dashboardFormatters } from "../../shared/utils/dashboardFormatters";

interface PerformanceKPIsProps {
  data: HeadhunterKPI | undefined;
  isLoading?: boolean;
}

/**
 * PerformanceKPIs - DASH-03
 * Các card: Tổng Job, Ứng tuyển, Time-to-hire
 */
export const PerformanceKPIs: React.FC<PerformanceKPIsProps> = ({
  data,
  isLoading = false,
}) => {
  const { t } = useTranslation("dashboard");

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data) {
    return <p className="text-gray-500">{t("common.noData")}</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        title={t("headhunter.totalJobs")}
        value={data.totalJobs}
        trend="up"
        trendValue="+2"
      />
      <StatCard
        title={t("headhunter.applications")}
        value={data.totalApplications}
        trend="up"
        trendValue="+8%"
      />
      <StatCard
        title={t("headhunter.timeToHire")}
        value={dashboardFormatters.formatDuration(data.timeToHire)}
        trend="down"
        trendValue="-2 days"
      />
      <StatCard
        title={t("headhunter.successRate")}
        value={dashboardFormatters.formatPercentage(data.hiringSuccess)}
        trend="up"
        trendValue="+3%"
      />
    </div>
  );
};
