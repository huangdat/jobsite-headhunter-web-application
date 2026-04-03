import React from "react";
import { useTranslation } from "react-i18next";
import type { SystemOverviewStats } from "../../types";
import { StatCard } from "../../shared/components/StatCard";

interface SystemOverviewCardsProps {
  data: SystemOverviewStats | undefined;
  isLoading?: boolean;
}

/**
 * SystemOverviewCards - DASH-07
 * Các chỉ số tổng quát toàn hệ thống
 */
export const SystemOverviewCards: React.FC<SystemOverviewCardsProps> = ({
  data,
  isLoading = false,
}) => {
  const { t } = useTranslation("dashboard");

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data) {
    return <p className="text-gray-500">{t("common.noData")}</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <StatCard
        title={t("admin.totalUsers")}
        value={data.totalUsers}
        trend="up"
        trendValue="+12%"
      />
      <StatCard
        title={t("admin.totalJobs")}
        value={data.totalJobs}
        trend="up"
        trendValue="+8%"
      />
      <StatCard
        title={t("admin.applications")}
        value={data.totalApplications}
        trend="up"
        trendValue="+15%"
      />
      <StatCard
        title={t("admin.activeHeadhunters")}
        value={data.activeHeadhunters}
        trend="neutral"
        trendValue={t("common.noChange")}
      />
      <StatCard
        title={t("admin.activeCandidates")}
        value={data.activeCandidates}
        trend="down"
        trendValue="-5%"
      />
    </div>
  );
};
