import React from "react";
import { Button } from "@/shared/ui-primitives/button";
import { useUsersTranslation } from "@/shared/hooks";
import { FilterBadge } from "./FilterBadge";

interface ActiveFilter {
  type: "role" | "status";
  value: string;
}

interface UserListHeaderProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onFilterClick?: () => void;
  onGroupByChange?: (value: string) => void;
  onAddUserClick?: () => void;
  activeFilters?: ActiveFilter[];
  onRemoveFilter?: (filterType: "role" | "status") => void;
  onClearFilters?: () => void;
  filterPanel?: React.ReactNode;
}

export const UserListHeader: React.FC<UserListHeaderProps> = ({
  searchValue = "",
  onSearchChange,
  onFilterClick,
  onGroupByChange,
  onAddUserClick,
  activeFilters = [],
  onRemoveFilter,
  onClearFilters,
  filterPanel,
}) => {
  const { t } = useUsersTranslation();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden mb-6">
      {/* Top Header Bar: Thêm border-b nhẹ để tách biệt tiêu đề */}
      <header className="h-16 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-background-dark px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {t("list.pageTitle")}
          </h2>
        </div>
      </header>

      {/* Search & Filter Controls: Phần này giờ nằm trong container có border và shadow */}
      <div className="p-6 shrink-0 bg-white dark:bg-background-dark space-y-4">
        {/* Row 1: Search, Filter, Group By */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-75">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                search
              </span>
              <input
                type="text"
                placeholder={t("list.searchPlaceholder")}
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
              />
            </div>

            <div className="relative">
              <button
                onClick={onFilterClick}
                className="flex items-center gap-2 cursor-pointer px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm hover:border-slate-300 dark:hover:border-slate-600 text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                <span className="material-symbols-outlined text-slate-500">
                  filter_list
                </span>
                <span>{t("list.filterButton")}</span>
              </button>

              {filterPanel}
            </div>
          </div>
        </div>

        {/* Row 2: Active Filters */}
        {activeFilters && activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center pt-2">
            {activeFilters.map((filter) => (
              <FilterBadge
                key={`${filter.type}-${filter.value}`}
                filterType={filter.type}
                value={filter.value}
                onRemove={() => onRemoveFilter?.(filter.type)}
              />
            ))}
            <button
              onClick={onClearFilters}
              className="text-xs text-slate-500 hover:text-primary font-medium underline underline-offset-4 ml-2"
            >
              {t("list.clearAllFilters")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
