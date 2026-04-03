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
 */
export const HiringFunnel: React.FC<HiringFunnelProps> = ({
  data,
  isLoading = false,
}) => {
  const { t } = useTranslation("dashboard");

  if (isLoading) {
    return <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />;
  }

  return (
    <BaseChart
      data={(data as ChartDataPoint[]) || []}
      title={t("headhunter.hiringFunnel")}
      type="bar"
      height={300}
    />
  );
};
