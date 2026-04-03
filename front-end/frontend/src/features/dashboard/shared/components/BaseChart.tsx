import React from "react";
import type { ChartDataPoint } from "../../types";

interface BaseChartProps {
  data: ChartDataPoint[];
  title: string;
  type?: "bar" | "line" | "pie";
  height?: number;
}

/**
 * BaseChart
 * Cấu hình chung cho thư viện Recharts/Chart.js
 * TODO: Implement chart rendering using Recharts or Chart.js
 */
export const BaseChart: React.FC<BaseChartProps> = ({
  data,
  title,
  type = "bar",
  height = 300,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        {title}
      </h3>
      <div className="chart-container overflow-auto" data-chart-height={height}>
        {/* TODO: Implement chart rendering using Recharts or Chart.js */}
        <p className="text-slate-500 dark:text-slate-400">
          Chart Component (type: {type})
        </p>
        <pre className="text-xs text-slate-400 dark:text-slate-500 mt-2 overflow-auto max-h-48">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
};
