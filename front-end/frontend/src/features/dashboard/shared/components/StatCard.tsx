import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: "blue" | "green" | "red" | "yellow" | "purple" | "emerald";
}

/**
 * StatCard - Reusable Statistics Card Component
 * Khung chuẩn cho các thẻ chỉ số trên dashboard
 * Hỗ trợ dark mode, icons, trend indicators
 */
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  subtitle,
  trend,
  trendValue,
  color = "blue",
}) => {
  const colorConfig = {
    blue: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-600 dark:text-blue-400",
      trendUp: "text-green-600 dark:text-green-400",
      trendDown: "text-red-600 dark:text-red-400",
    },
    green: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-600 dark:text-green-400",
      trendUp: "text-green-600 dark:text-green-400",
      trendDown: "text-red-600 dark:text-red-400",
    },
    red: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-600 dark:text-red-400",
      trendUp: "text-green-600 dark:text-green-400",
      trendDown: "text-red-600 dark:text-red-400",
    },
    yellow: {
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      text: "text-yellow-600 dark:text-yellow-400",
      trendUp: "text-green-600 dark:text-green-400",
      trendDown: "text-red-600 dark:text-red-400",
    },
    purple: {
      bg: "bg-purple-100 dark:bg-purple-900/30",
      text: "text-purple-600 dark:text-purple-400",
      trendUp: "text-green-600 dark:text-green-400",
      trendDown: "text-red-600 dark:text-red-400",
    },
    emerald: {
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      text: "text-emerald-600 dark:text-emerald-400",
      trendUp: "text-green-600 dark:text-green-400",
      trendDown: "text-red-600 dark:text-red-400",
    },
  };

  const selectedColor = colorConfig[color];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div
            className={`w-12 h-12 rounded-lg ${selectedColor.bg} flex items-center justify-center text-xl shrink-0`}
          >
            {icon}
          </div>
        )}
      </div>
      {trend && trendValue && (
        <div
          className={`text-xs mt-3 font-medium ${
            trend === "up"
              ? selectedColor.trendUp
              : trend === "down"
                ? selectedColor.trendDown
                : "text-slate-500 dark:text-slate-400"
          }`}
        >
          {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
        </div>
      )}
    </div>
  );
};
