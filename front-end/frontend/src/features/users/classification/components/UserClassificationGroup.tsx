import React from "react";
import { useUsersTranslation } from "@/shared/hooks";
import type { ClassificationGroupData } from "../types/classification.types";
import { formatPercentage, formatCount } from "../utils/classificationUtils";

interface UserClassificationGroupProps {
  group: ClassificationGroupData;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onViewDetails?: (userId: string) => void;
}

const ICON_MAP: Record<string, string> = {
  role: "badge",
  status: "verified_user",
  company: "business",
  calendar: "event",
};

const COLOR_CLASSES: Record<
  "blue" | "purple" | "green" | "orange" | "red" | "slate",
  { bg: string; text: string; icon: string }
> = {
  blue: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-600 dark:text-blue-400",
    icon: "text-blue-600",
  },
  purple: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-600 dark:text-purple-400",
    icon: "text-purple-600",
  },
  green: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-600 dark:text-green-400",
    icon: "text-green-600",
  },
  orange: {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-600 dark:text-orange-400",
    icon: "text-orange-600",
  },
  red: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-600 dark:text-red-400",
    icon: "text-red-600",
  },
  slate: {
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-600 dark:text-slate-400",
    icon: "text-slate-600",
  },
};

export const UserClassificationGroup: React.FC<
  UserClassificationGroupProps
> = ({ group, isExpanded, onToggleExpand, onViewDetails }) => {
  const { t } = useUsersTranslation();
  const colors = COLOR_CLASSES[group.colorScheme];
  const icon = ICON_MAP[group.iconType] || "folder";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:border-primary/50 transition-colors group">
      {/* Group Header */}
      <button
        onClick={onToggleExpand}
        className="w-full p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Icon */}
          <div className={`${colors.bg} p-2 rounded-lg shrink-0`}>
            <span
              className={`material-symbols-outlined ${colors.icon} text-lg`}
            >
              {icon}
            </span>
          </div>

          {/* Title & Subtitle */}
          <div className="text-left min-w-0">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {group.displayName}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {group.subtitle}
            </p>
          </div>
        </div>

        {/* Statistics in Header */}
        <div className="flex flex-1 items-center justify-between px-4 ml-4">
          {/* Count */}
          <div className="w-24 text-center">
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {formatCount(group.statistics.totalCount)}
            </p>
          </div>

          {/* Percentage */}
          <div className="w-24 text-center">
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {formatPercentage(group.statistics.percentage)}
            </p>
          </div>

          {/* Active/Inactive Bar */}
          <div className="w-48">
            <div className="flex justify-between text-xs font-bold uppercase mb-1">
              <span className="text-primary">
                {formatCount(group.statistics.activeCount)}{" "}
                {t("classification.active")}
              </span>
              <span className="text-slate-400">
                {formatCount(group.statistics.inactiveCount)}{" "}
                {t("classification.inactive")}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
              {/* eslint-disable-next-line */}
              <div
                className="bg-primary h-full transition-all"
                style={{ width: `${group.statistics.activePercentage}%` }}
              />
              {/* eslint-disable-next-line */}
              <div
                className="bg-slate-300 dark:bg-slate-600 h-full"
                style={{ width: `${100 - group.statistics.activePercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Expand/Collapse Icon */}
        <span
          className={`material-symbols-outlined text-slate-400 group-hover:text-primary transition-all shrink-0 ${isExpanded ? "rotate-180" : ""}`}
        >
          expand_more
        </span>
      </button>

      {/* Expanded Content - Users List */}
      {isExpanded && (
        <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-800/20">
          <div className="space-y-2">
            {group.users.length > 0 ? (
              group.users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => onViewDetails?.(user.id)}
                  className="px-4 py-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-primary/50 dark:hover:border-primary/50 transition-colors cursor-pointer group/user flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Avatar */}
                    <div className="size-10 rounded-full overflow-hidden shrink-0 ring-2 ring-transparent group-hover/user:ring-primary/20">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.fullName}
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="size-full flex items-center justify-center bg-primary/10 text-primary font-bold text-sm">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* User Status Badge */}
                  <div className="shrink-0 ml-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        user.status === "ACTIVE"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                          : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {user.status === "ACTIVE" ? "check_circle" : "cancel"}
                      </span>
                      {t(`statuses.${user.status.toLowerCase()}`)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <p className="text-sm">{t("common.noDataAvailable")}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
