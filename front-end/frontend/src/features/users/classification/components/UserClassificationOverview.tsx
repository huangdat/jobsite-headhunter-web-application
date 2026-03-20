import React from "react";
import { useUsersTranslation } from "@/shared/hooks";
import type {
  ClassificationGroupData,
  ClassificationOverviewStats,
} from "../types/classification.types";
import { UserClassificationHeader } from "./UserClassificationHeader";
import { UserClassificationGroup } from "./UserClassificationGroup";
import type { ClassificationGroupBy } from "../types/classification.types";

interface UserClassificationOverviewProps {
  groups: ClassificationGroupData[];
  overviewStats: ClassificationOverviewStats;
  groupBy: ClassificationGroupBy;
  onGroupByChange: (field: ClassificationGroupBy) => void;
  onToggleGroup: (groupId: string) => void;
  onExpandAll?: () => void;
  onCollapseAll?: () => void;
  onViewDetails?: (userId: string) => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => Promise<void>;
}

export const UserClassificationOverview: React.FC<
  UserClassificationOverviewProps
> = ({
  groups,
  overviewStats,
  groupBy,
  onGroupByChange,
  onToggleGroup,
  onExpandAll,
  onCollapseAll,
  onViewDetails,
  loading = false,
  error = null,
  onRetry,
}) => {
  const { t } = useUsersTranslation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-primary mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">
            {t("common.loading")}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl">
        <div className="text-center space-y-4">
          <div>
            <p className="text-red-600 dark:text-red-400 font-bold mb-2">
              {t("users.classification.error.permissionDenied")}
            </p>
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-block px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              {t("common.tryAgain")}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="p-8 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center">
        <p className="text-slate-600 dark:text-slate-400">
          {t("common.noDataAvailable")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Group By controls */}
      <UserClassificationHeader
        groupBy={groupBy}
        onGroupByChange={onGroupByChange}
        totalUsers={overviewStats.totalUsers}
        activeRate={overviewStats.activeRate}
        onExpandAll={onExpandAll}
        onCollapseAll={onCollapseAll}
      />

      {/* Group alignment header for consistency */}
      <div className="px-5 py-2 items-center text-xs font-bold text-slate-400 uppercase tracking-wider hidden lg:flex">
        <div className="w-1/4">{t("classification.classificationName")}</div>
        <div className="flex-1 flex justify-between px-12">
          <div className="w-24 text-center">{t("classification.count")}</div>
          <div className="w-24 text-center">
            {t("classification.distribution")}
          </div>
          <div className="w-48">{t("classification.status")}</div>
        </div>
        <div className="w-6" />
      </div>

      {/* Groups List */}
      <div className="space-y-3">
        {groups.map((group) => (
          <UserClassificationGroup
            key={group.id}
            group={group}
            isExpanded={group.isExpanded}
            onToggleExpand={() => onToggleGroup(group.id)}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      {/* Statistics Footer */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Activity Trend Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
          <h4 className="text-sm font-bold text-slate-400 uppercase mb-4">
            {t("classification.userDistributionTrend")}
          </h4>
          <div className="h-32 w-full bg-slate-50 dark:bg-slate-800 rounded-lg flex items-end justify-between px-4 pb-2 gap-1">
            {groups.map((group) => {
              const maxCount = Math.max(
                ...groups.map((g) => g.statistics.totalCount)
              );
              const percentage = (group.statistics.totalCount / maxCount) * 100;
              return (
                <div
                  key={group.id}
                  className="bg-primary/60 hover:bg-primary rounded-t transition-colors flex-1"
                  style={{ height: `${Math.max(percentage, 5)}%` }}
                  title={`${group.displayName}: ${group.statistics.totalCount}`}
                />
              );
            })}
          </div>
        </div>

        {/* System Health Indicator */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-center items-center">
          <div className="relative w-24 h-24 mb-4">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="stroke-slate-100 dark:stroke-slate-800 fill-none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                strokeWidth="3"
              />
              <path
                className="stroke-primary fill-none transition-all"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                strokeDasharray={`${overviewStats.activeRate}, 100`}
                strokeLinecap="round"
                strokeWidth="3"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-lg text-slate-900 dark:text-white">
              {overviewStats.activeRate.toFixed(0)}%
            </div>
          </div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 text-center">
            {t("classification.systemHealth")}
          </p>
        </div>

        {/* Group Summary */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
          <h4 className="text-sm font-bold text-slate-400 uppercase mb-4">
            {t("classification.summary")}
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {t("classification.totalGroups")}
              </span>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                {overviewStats.groupCount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {t("classification.activeUsers")}
              </span>
              <span className="font-bold text-lg text-primary">
                {overviewStats.totalActiveUsers.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {t("classification.inactiveUsers")}
              </span>
              <span className="font-bold text-lg text-red-600 dark:text-red-400">
                {overviewStats.totalInactiveUsers.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
