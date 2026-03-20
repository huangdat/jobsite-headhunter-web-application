import React from "react";
import { useUsersTranslation } from "@/shared/hooks";
import type { ClassificationGroupBy } from "../types/classification.types";
import { groupingConfigs } from "../utils/groupingConfig";

interface UserClassificationHeaderProps {
  groupBy: ClassificationGroupBy;
  onGroupByChange: (field: ClassificationGroupBy) => void;
  totalUsers: number;
  activeRate: number;
  showDropdown?: boolean;
  onExpandAll?: () => void;
  onCollapseAll?: () => void;
}

export const UserClassificationHeader: React.FC<
  UserClassificationHeaderProps
> = ({
  groupBy,
  onGroupByChange,
  totalUsers,
  activeRate,
  showDropdown = true,
  onExpandAll,
  onCollapseAll,
}) => {
  const { t } = useUsersTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const groupByOptions: ClassificationGroupBy[] = [
    "role",
    "status",
    "company",
    "createdMonth",
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 mb-6 flex items-center gap-6">
      {/* Group By Dropdown */}
      {showDropdown && (
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            {t("classification.groupBy")}
          </span>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold cursor-pointer hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-primary text-lg">
                filter_list
              </span>
              <span>
                {t(groupingConfigs[groupBy]?.label || "classification.groupBy")}
              </span>
              <span className="material-symbols-outlined text-slate-400 text-lg">
                expand_more
              </span>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
                {groupByOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      onGroupByChange(option);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                      groupBy === option
                        ? "bg-primary/10 dark:bg-primary/20 text-primary"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {groupBy === option && (
                      <span className="material-symbols-outlined text-primary text-sm">
                        check_circle
                      </span>
                    )}
                    <div>
                      <p className="font-bold text-sm">
                        {t(groupingConfigs[option]?.label || "")}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {t(groupingConfigs[option]?.description || "")}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Separator */}
      {showDropdown && (
        <div className="h-10 w-px bg-slate-200 dark:border-slate-800" />
      )}

      {/* Summary Stats */}
      <div className="flex-1 flex gap-4">
        <div className="px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t("classification.totalUsers")}:
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {totalUsers.toLocaleString()}
          </span>
        </div>
        <div className="px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t("classification.activeRate")}:
          </span>
          <span className="text-sm font-bold text-primary">
            {activeRate.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {onExpandAll && (
          <button
            onClick={onExpandAll}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            title={t("classification.expandAll")}
          >
            <span className="material-symbols-outlined text-sm">unfold_more</span>
          </button>
        )}
        {onCollapseAll && (
          <button
            onClick={onCollapseAll}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title={t("classification.collapseAll")}
          >
            <span className="material-symbols-outlined text-sm">
              unfold_less
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
