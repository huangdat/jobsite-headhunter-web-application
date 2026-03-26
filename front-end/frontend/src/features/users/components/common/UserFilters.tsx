import React, { useState } from "react";
import { useUsersTranslation } from "@/shared/hooks";
import {
  USERS_LIST_ROLE_VALUES,
  USERS_LIST_STATUS_VALUES,
} from "@/features/users/list/constants";

interface UserFiltersProps {
  filters: {
    role?: string;
    status?: string;
  };
  onApply: (filters: Record<string, string | undefined>) => void;
  onClear: () => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  filters,
  onApply,
  onClear,
}) => {
  const { t } = useUsersTranslation();
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (key: string, value: string) => {
    setLocalFilters({
      ...localFilters,
      [key]: value || undefined,
    });
  };

  const handleApply = () => {
    onApply(localFilters);
  };

  const handleReset = () => {
    setLocalFilters({});
    onClear();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
      <h3 className="font-bold text-slate-900 dark:text-white">
        {t("filters.filterUsers")}
      </h3>

      {/* Role Filter */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {t("filters.filterRole")}
        </label>
        <select
          value={localFilters.role || ""}
          onChange={(e) => handleChange("role", e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
          title={t("filters.filterRole")}
          aria-label={t("filters.filterRole")}
        >
          <option value="">{t("filters.filterAllRoles")}</option>
          {USERS_LIST_ROLE_VALUES.map((role) => (
            <option key={role} value={role}>
              {t(`roles.${role.toLowerCase()}`)}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filter */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {t("filters.filterStatus")}
        </label>
        <select
          value={localFilters.status || ""}
          onChange={(e) => handleChange("status", e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
          title={t("filters.filterStatus")}
          aria-label={t("filters.filterStatus")}
        >
          <option value="">{t("filters.filterAllStatus")}</option>
          {USERS_LIST_STATUS_VALUES.map((status) => (
            <option key={status} value={status}>
              {t(`statuses.${status.toLowerCase()}`)}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleApply}
          className="flex-1 px-4 py-2 bg-primary hover:bg-green-600 text-white font-bold rounded-lg transition-colors"
        >
          {t("filters.applyFilter")}
        </button>
        <button
          onClick={handleReset}
          className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold rounded-lg transition-colors"
        >
          {t("filters.resetFilter")}
        </button>
      </div>
    </div>
  );
};
