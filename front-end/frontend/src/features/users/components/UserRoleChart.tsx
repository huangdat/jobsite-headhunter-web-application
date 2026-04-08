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
import { Users, Shield, Briefcase, Users2 } from "lucide-react";
import type { UserRole } from "@/features/users/types/user.types";
import { ROLE_COLOR_MAP } from "@/features/users/config/chartColorsConfig";

interface UserRoleData {
  role: UserRole;
  count: number;
}

interface UserRoleChartProps {
  data: UserRoleData[];
  title?: string;
  height?: number;
}

interface ChartDataPoint extends UserRoleData {
  displayRole: string;
  fill: string;
  total: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataPoint;
  }>;
}

// Role configuration with icons and labels, colors from centralized config
const roleConfig: Record<
  UserRole,
  { gradient: string; icon: React.ReactNode; label: string }
> = {
  ADMIN: {
    gradient: ROLE_COLOR_MAP.ADMIN,
    icon: <Shield className="w-5 h-5" />,
    label: "Admin",
  },
  CANDIDATE: {
    gradient: ROLE_COLOR_MAP.CANDIDATE,
    icon: <Users2 className="w-5 h-5" />,
    label: "Candidate",
  },
  HEADHUNTER: {
    gradient: ROLE_COLOR_MAP.HEADHUNTER,
    icon: <Briefcase className="w-5 h-5" />,
    label: "Headhunter",
  },
  COLLABORATOR: {
    gradient: ROLE_COLOR_MAP.COLLABORATOR,
    icon: <Users className="w-5 h-5" />,
    label: "Collaborator",
  },
};

// Custom donut label showing percentage
const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}): JSX.Element | null => {
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

// Custom tooltip with better styling and proper types
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
          {data.displayRole}
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

export const UserRoleChart: React.FC<UserRoleChartProps> = ({
  data,
  title,
  height = 340,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const totalUsers = data.reduce((sum, item) => sum + item.count, 0);

  // Transform data with display labels, colors, and total
  const chartData: ChartDataPoint[] = data.map((item) => ({
    ...item,
    displayRole: roleConfig[item.role].label,
    fill: roleConfig[item.role].gradient,
    total: totalUsers,
  }));

  return (
    <Card className="w-full p-6 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="space-y-4">
        {/* Header with title and total */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              {title || "User Role Distribution"}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Total <span className="font-semibold">{totalUsers}</span> users
              across roles
            </p>
          </div>
        </div>

        {/* Donut Chart */}
        <ResponsiveContainer width="100%" height={height}>
          <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <defs>
              {/* Gradient definitions for each role */}
              {data.map((item) => (
                <linearGradient
                  key={`grad-${item.role}`}
                  id={`grad-${item.role}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor={roleConfig[item.role].gradient}
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="100%"
                    stopColor={roleConfig[item.role].gradient}
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
                  key={`cell-${entry.role}`}
                  fill={`url(#grad-${entry.role})`}
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

        {/* Role badges with icons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          {data.map((item) => {
            const percentage = ((item.count / totalUsers) * 100).toFixed(1);
            return (
              <div
                key={item.role}
                className="flex items-center gap-2 p-3 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
              >
                <div
                  className="p-1.5 rounded-lg text-white flex-shrink-0"
                  style={{ backgroundColor: roleConfig[item.role].gradient }}
                >
                  {roleConfig[item.role].icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase truncate">
                    {roleConfig[item.role].label}
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
