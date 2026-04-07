import React from "react";
import { useUsersTranslation } from "@/shared/hooks";

interface FilterBadgeProps {
  filterType: "role" | "status";
  value: string;
  onRemove?: () => void;
}

export const FilterBadge: React.FC<FilterBadgeProps> = ({
  filterType,
  value,
  onRemove,
}) => {
  const { t } = useUsersTranslation();

  const getFilterLabel = () => {
    switch (filterType) {
      case "role":
        return t(`roles.${value.toLowerCase()}`);
      case "status":
        return t(`statuses.${value.toLowerCase()}`);
      default:
        return value;
    }
  };

  const getFilterTypeLabel = () => {
    switch (filterType) {
      case "role":
        return t("filters.filterRole");
      case "status":
        return t("filters.filterStatus");
      default:
        return filterType;
    }
  };

  return (
    <div className="px-3 py-1.5 text-primary border border-primary/20 rounded-full text-xs font-bold flex items-center gap-2 bg-primary/10">
      {getFilterTypeLabel()}: {getFilterLabel()}
      <span
        onClick={onRemove}
        className={`material-symbols-outlined text-sm cursor-pointer ${getSemanticClass("danger", "text", true).replace("text-", "hover:text-")} transition-colors`}
      >
        close
      </span>
    </div>
  );
};
