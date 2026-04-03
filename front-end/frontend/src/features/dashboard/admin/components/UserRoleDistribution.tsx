import React from "react";
import { useTranslation } from "react-i18next";
import type { UserRoleStats } from "../../types";

interface UserRoleDistributionProps {
  data: UserRoleStats | undefined;
  isLoading?: boolean;
}

/**
 * UserRoleDistribution - DASH-06
 * Hiển thị số lượng chính xác của 4 vai trò: ADMIN, CANDIDATE, HEADHUNTER, COLLABORATOR
 * AC1: Hiển thị exact counts, KHÔNG có percentages
 * AC2: Hỗ trợ lọc theo ngày (từ AdminDashboardPage)
 */
export const UserRoleDistribution: React.FC<UserRoleDistributionProps> = ({
  data,
  isLoading = false,
}) => {
  const { t } = useTranslation("dashboard");

  // Role configuration with colors and icons
  const roleConfig: Record<
    string,
    {
      label: string;
      color: string;
      bgColor: string;
      darkBgColor: string;
      icon: string;
    }
  > = {
    ADMIN: {
      label: t("roles.ADMIN", "Admin"),
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100",
      darkBgColor: "dark:bg-purple-900/30",
      icon: "👨‍💼",
    },
    CANDIDATE: {
      label: t("roles.CANDIDATE", "Candidate"),
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100",
      darkBgColor: "dark:bg-blue-900/30",
      icon: "👤",
    },
    HEADHUNTER: {
      label: t("roles.HEADHUNTER", "Headhunter"),
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-100",
      darkBgColor: "dark:bg-emerald-900/30",
      icon: "🎯",
    },
    COLLABORATOR: {
      label: t("roles.COLLABORATOR", "Collaborator"),
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100",
      darkBgColor: "dark:bg-orange-900/30",
      icon: "🤝",
    },
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400">
          {t("common.noData", "No data available")}
        </p>
      </div>
    );
  }

  const roles = Object.entries(data).map(([key, value]) => ({
    key,
    count: value,
    ...roleConfig[key],
  }));

  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        {t("admin.dashboard.userRoleDistribution", "User Role Distribution")}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {roles.map((role) => (
          <div
            key={role.key}
            className={`${role.bgColor} ${role.darkBgColor} rounded-lg p-4 border border-slate-200 dark:border-slate-700`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  {role.label}
                </p>
                {/* DASH-06 AC1: Exact counts only, NO percentages */}
                <p className={`text-3xl font-bold ${role.color}`}>
                  {role.count}
                </p>
              </div>
              <div className="text-3xl">{role.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Statistics */}
      <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {t("admin.dashboard.totalUsers", "Total Users")}:{" "}
          <span className="font-semibold text-slate-900 dark:text-white">
            {Object.values(data).reduce((a, b) => a + b, 0)}
          </span>
        </p>
      </div>
    </div>
  );
};
