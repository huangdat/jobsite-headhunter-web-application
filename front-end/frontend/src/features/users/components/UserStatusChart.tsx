import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card } from "@/shared/ui-primitives/card";
import { CheckCircle, Clock, Lock, Trash2 } from "lucide-react";
import type { UserStatus } from "@/features/users/types/user.types";
import { STATUS_COLOR_MAP } from "@/features/users/config/chartColorsConfig";

interface UserStatusData {
  status: UserStatus;
  count: number;
}

interface UserStatusChartProps {
  data: UserStatusData[];
  title?: string;
  height?: number;
}

interface ChartDataPoint extends UserStatusData {
  displayStatus: string;
  fill: string;
  total: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataPoint;
  }>;
}

interface LabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}

// Status configuration with icons and labels, colors from centralized config
const statusConfig: Record<
  UserStatus,
  { gradient: string; icon: React.ReactNode; label: string }
> = {
  PENDING: {
    gradient: STATUS_COLOR_MAP.PENDING,
    icon: <Clock className="w-5 h-5" />,
    label: "Pending",
  },
  ACTIVE: {
    gradient: STATUS_COLOR_MAP.ACTIVE,
    icon: <CheckCircle className="w-5 h-5" />,
    label: "Active",
  },
  SUSPENDED: {
    gradient: STATUS_COLOR_MAP.SUSPENDED,
    icon: <Lock className="w-5 h-5" />,
    label: "Suspended",
  },
  DELETED: {
    gradient: STATUS_COLOR_MAP.DELETED,
    icon: <Trash2 className="w-5 h-5" />,
    label: "Deleted",
  },
};

// Custom donut label with proper TypeScript types
const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: LabelProps): JSX.Element | null => {
  if (
    cx === undefined ||
    cy === undefined ||
    midAngle === undefined ||
    innerRadius === undefined ||
    outerRadius === undefined ||
    percent === undefined
  ) {
    return null;
  }
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
  const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

  if (percent < 0.08) return null; // Hide label if slice is too small

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-xs font-bold drop-shadow-lg"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Custom tooltip with proper TypeScript types
const CustomTooltip = ({
  active,
  payload,
}: TooltipProps): JSX.Element | null => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = data.total;
    const percentage = ((data.count / total) * 100).toFixed(1);

    return (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
        <p className="font-semibold text-slate-900 dark:text-slate-100">
          {data.displayStatus}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Count: <span className="font-bold">{data.count}</span>
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Percentage: <span className="font-bold">{percentage}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export const UserStatusChart: React.FC<UserStatusChartProps> = ({
  data,
  title,
  height = 340,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const totalUsers = data.reduce((sum, item) => sum + item.count, 0);

  // Transform data with display labels and total
  const chartData: ChartDataPoint[] = data.map((item) => ({
    ...item,
    displayStatus: statusConfig[item.status].label,
    fill: statusConfig[item.status].gradient,
    total: totalUsers,
  }));

  return (
    <Card className="w-full p-6 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="space-y-4">
        {/* Header with title and total */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              {title || "User Status Distribution"}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Total <span className="font-semibold">{totalUsers}</span> users by
              status
            </p>
          </div>
        </div>

        {/* Donut Chart */}
        <ResponsiveContainer width="100%" height={height}>
          <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <defs>
              {/* Gradient definitions */}
              {data.map((item) => (
                <linearGradient
                  key={`grad-${item.status}`}
                  id={`grad-${item.status}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor={statusConfig[item.status].gradient}
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="100%"
                    stopColor={statusConfig[item.status].gradient}
                    stopOpacity={0.7}
                  />
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={130}
              paddingAngle={4}
              dataKey="count"
              animationDuration={800}
              animationEasing="ease-out"
              label={renderCustomLabel}
              labelLine={false}
              onMouseEnter={(_, index: number) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.status}`}
                  fill={`url(#grad-${entry.status})`}
                  opacity={
                    activeIndex === null || activeIndex === index ? 1 : 0.4
                  }
                  style={{
                    filter:
                      activeIndex === index
                        ? "drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
                        : "none",
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              wrapperStyle={{ paddingLeft: "20px" }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Status badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          {data.map((item) => {
            const percentage = ((item.count / totalUsers) * 100).toFixed(1);
            return (
              <div
                key={item.status}
                className="flex items-center gap-2 p-3 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
              >
                <div
                  className="p-1.5 rounded-lg text-white flex-shrink-0"
                  style={{
                    backgroundColor: statusConfig[item.status].gradient,
                  }}
                >
                  {statusConfig[item.status].icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase truncate">
                    {statusConfig[item.status].label}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {item.count}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      ({percentage}%)
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
