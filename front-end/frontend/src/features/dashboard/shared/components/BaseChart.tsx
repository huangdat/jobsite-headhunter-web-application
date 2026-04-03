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
 */
export const BaseChart: React.FC<BaseChartProps> = ({
  data,
  title,
  type = "bar",
  height = 300,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="chart-container" style={{ minHeight: `${height}px` }}>
        {/* TODO: Implement chart rendering using Recharts or Chart.js */}
        <p className="text-gray-500">Chart Component (type: {type})</p>
        <pre className="text-xs text-gray-400 mt-2">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
};
