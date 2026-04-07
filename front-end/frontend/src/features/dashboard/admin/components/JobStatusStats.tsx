import React from "react";
import { useTranslation } from "react-i18next";
import { getSemanticClass } from "@/lib/design-tokens";
import type { JobStatusStats } from "../../types";

interface JobStatusStatsComponentProps {
  data: JobStatusStats | undefined;
  isLoading?: boolean;
}

/**
 * JobStatusStats - DASH-07
 * Thống kê trạng thái Job: OPEN, CLOSED, DRAFT
 * AC1: Hiển thị exact counts của 3 statuses
 * AC2: Hỗ trợ lọc role-based (Headhunter thấy chỉ jobs của mình, Admin thấy all)
 */
export const JobStatusStatsComponent: React.FC<
  JobStatusStatsComponentProps
> = ({ data, isLoading = false }) => {
  const { t } = useTranslation("dashboard");

  // Status configuration with colors and icons
  const statusConfig: Record<
    string,
    {
      label: string;
      color: string;
      bgColor: string;
      darkBgColor: string;
      icon: string;
      description: string;
    }
  > = {
    OPEN: {
      label: t("jobStatus.OPEN", "Open"),
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-100",
      darkBgColor: "dark:bg-emerald-900/30",
      icon: "📂",
      description: t("jobStatus.openDescription", "Active listings"),
    },
    CLOSED: {
      label: t("jobStatus.CLOSED", "Closed"),
      color: getSemanticClass("danger", "text", true),
      bgColor: "bg-red-100",
      darkBgColor: "dark:bg-red-900/30",
      icon: "🔒",
      description: t("jobStatus.closedDescription", "Closed positions"),
    },
    DRAFT: {
      label: t("jobStatus.DRAFT", "Draft"),
      color: "text-slate-600 dark:text-slate-400",
      bgColor: "bg-slate-100",
      darkBgColor: "dark:bg-slate-700/50",
      icon: "📝",
      description: t("jobStatus.draftDescription", "Work in progress"),
    },
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"
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

  const statuses = Object.entries(data).map(([key, value]) => ({
    key,
    count: value,
    ...statusConfig[key],
  }));

  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        {t("admin.dashboard.jobStatusStatistics", "Job Status Statistics")}
      </h3>
      <div className="space-y-3">
        {statuses.map((status) => {
          return (
            <div
              key={status.key}
              className={`${status.bgColor} ${status.darkBgColor} rounded-lg p-4 border border-slate-200 dark:border-slate-700`}
            >
              {/* Header: Status name, icon, and count */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{status.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {status.label}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      {status.description}
                    </p>
                  </div>
                </div>
                {/* DASH-07 AC1: Exact counts only */}
                <p className={`text-2xl font-bold ${status.color}`}>
                  {status.count}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {t("admin.dashboard.totalJobs", "Total Jobs")}:{" "}
          <span className="font-semibold text-slate-900 dark:text-white">
            {Object.values(data).reduce((a, b) => a + b, 0)}
          </span>
        </p>
      </div>

      {/* Note about role-based filtering */}
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        {t(
          "admin.dashboard.jobStatusNote",
          "Note: Headhunter users see only their own jobs; Admins see all jobs."
        )}
      </p>
    </div>
  );
};
