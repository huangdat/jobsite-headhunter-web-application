import React from "react";
import { useHeadhunterTranslation } from "@/shared/hooks";
import { getSemanticClass } from "@/lib/design-tokens";

interface CandidateFilterTagProps {
  label: string;
  value: string;
  onRemove?: () => void;
}

export const CandidateFilterTag: React.FC<CandidateFilterTagProps> = ({
  label,
  value,
  onRemove,
}) => {
  const { t } = useHeadhunterTranslation();

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full ${getSemanticClass("success", "border", true)} ${getSemanticClass("success", "bg", true)} px-3 py-1 text-xs font-semibold text-emerald-700`}
    >
      <span>
        {label}: {value}
      </span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full text-emerald-600 hover:text-emerald-900"
          aria-label={t("filters.actions.remove")}
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      )}
    </div>
  );
};
