import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

/**
 * StatCard
 * Component khung cho các thẻ chỉ số
 */
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  subtitle,
  trend,
  trendValue,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {icon && <div className="text-2xl">{icon}</div>}
      </div>
      {trend && trendValue && (
        <div
          className={`text-xs mt-2 ${trend === "up" ? "text-green-600" : "text-red-600"}`}
        >
          {trend === "up" ? "↑" : "↓"} {trendValue}
        </div>
      )}
    </div>
  );
};
