import React from "react";
import { useTranslation } from "react-i18next";
import type { HiringFunnelData, ChartDataPoint } from "../../types";
import { BaseChart } from "../../shared/components/BaseChart";

interface HiringFunnelProps {
  data: HiringFunnelData[] | undefined;
  isLoading?: boolean;
}

/**
 * HiringFunnel - DASH-03
 * Biểu đồ phễu chuyển đổi ứng viên
 * AC3: Hiển thị empty state khi chưa có dữ liệu ứng tuyển
 */
export const HiringFunnel: React.FC<HiringFunnelProps> = ({
  data,
  isLoading = false,
}) => {
  const { t } = useTranslation("dashboard");

  if (isLoading) {
    return (
      <div className="h-80 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-4">📊</p>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          {t("headhunter.dashboard.hiringFunnel", "Hiring Funnel")}
        </h3>
        <p className="text-slate-500 dark:text-slate-400">
          {t(
            "headhunter.dashboard.emptyStateJobFilter",
            "No application data for this job. Keep tracking!"
          )}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        {t("headhunter.dashboard.hiringFunnel", "Hiring Funnel")}
      </h3>
      <BaseChart
        data={(data as ChartDataPoint[]) || []}
        title=""
        type="bar"
        height={300}
      />
    </div>
  );
};
