import React from "react";
import { Button } from "@/components/ui/button";
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
    <>
      {/* Top Header Bar */}
      <header className="h-16 border-b border-primary/10 bg-white dark:bg-background-dark px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">{t("list.pageTitle")}</h2>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="p-2 relative">
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">
              notifications
            </span>
            <span className="absolute top-2 right-2 size-2 bg-brand-primary rounded-full border-2 border-white dark:border-background-dark"></span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 px-3 py-1.5"
          >
            <span className="material-symbols-outlined text-sm">help</span>
            <span className="text-sm font-medium">
              {t("list.documentation")}
            </span>
          </Button>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
          <Button
            onClick={onAddUserClick}
            className="bg-brand-primary hover:bg-brand-hover text-white px-4 py-2 flex items-center gap-2 text-sm font-bold"
          >
            <span className="material-symbols-outlined text-lg">
              person_add
            </span>
            {t("list.addUserButton")}
          </Button>
        </div>
      </header>

      {/* Search & Filter Controls + Active Filters */}
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
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>

            {/* WRAP NÚT FILTER TRONG DIV CÓ POSITION RELATIVE */}
            <div className="relative">
              <button
                onClick={onFilterClick}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="material-symbols-outlined text-slate-500">
                  filter_list
                </span>
                <span className="text-sm font-medium">
                  {t("list.filterButton")}
                </span>
              </button>

              {/* RENDER FILTER PANEL Ở ĐÂY */}
              {filterPanel}
            </div>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <span>{t("list.groupByLabel")}</span>
              <select
                onChange={(e) => onGroupByChange?.(e.target.value)}
                className="bg-white dark:bg-slate-900 border-none rounded-lg text-sm focus:ring-0 cursor-pointer"
                title={t("list.groupByLabel")}
                aria-label={t("list.groupByLabel")}
              >
                <option>{t("list.groupByNone")}</option>
                <option>{t("list.groupByRole")}</option>
                <option>{t("list.groupByStatus")}</option>
                <option>{t("list.groupByCompany")}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Row 2: Active Filters (shown only if there are active filters) */}
        {activeFilters && activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
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
    </>
  );
};
