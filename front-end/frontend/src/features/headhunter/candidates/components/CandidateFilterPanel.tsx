import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LabelText } from "@/shared/components/typography/Typography";
import { useHeadhunterTranslation } from "@/shared/hooks";
import {
  CANDIDATE_EDUCATION_OPTIONS,
  CANDIDATE_INDUSTRY_OPTIONS,
  CANDIDATE_LOCATION_OPTIONS,
  CANDIDATE_STATUS_OPTIONS,
  type CandidateFilterParams,
  type CandidateFilterStatus,
} from "../types";
import { useCandidateFilters } from "../hooks/useCandidateFilters";

interface CandidateFilterPanelProps {
  filters: CandidateFilterParams;
  onFilterChange: (filters: CandidateFilterParams) => void;
}

export function CandidateFilterPanel({
  filters,
  onFilterChange,
}: CandidateFilterPanelProps) {
  const { t } = useHeadhunterTranslation();
  const { toggleMultiSelect, updateNumberField, updateDateField, resetFilters } =
    useCandidateFilters(filters, onFilterChange);

  const statusValues = filters.statuses as CandidateFilterStatus[];

  return (
    <aside className="sticky top-20 h-fit space-y-6 rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          {t("filters.eyebrow")}
        </p>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          {t("filters.advancedTitle")}
        </h2>
      </div>

      <section>
        <LabelText className="mb-3 block">{t("filters.sections.status")}</LabelText>
        <div className="space-y-2">
          {CANDIDATE_STATUS_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
            >
              <input
                type="checkbox"
                checked={statusValues.includes(option.value as CandidateFilterStatus)}
                onChange={() => toggleMultiSelect("statuses", option.value)}
                className="h-4 w-4"
              />
              <span>{t(option.labelKey)}</span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <LabelText className="mb-3 block">{t("filters.sections.location")}</LabelText>
        <div className="space-y-2">
          {CANDIDATE_LOCATION_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
            >
              <input
                type="checkbox"
                checked={filters.locations.includes(option.value)}
                onChange={() => toggleMultiSelect("locations", option.value)}
                className="h-4 w-4"
              />
              <span>{t(option.labelKey)}</span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <LabelText className="mb-3 block">{t("filters.sections.industry")}</LabelText>
        <div className="space-y-2">
          {CANDIDATE_INDUSTRY_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
            >
              <input
                type="checkbox"
                checked={filters.industries.includes(option.value)}
                onChange={() => toggleMultiSelect("industries", option.value)}
                className="h-4 w-4"
              />
              <span>{t(option.labelKey)}</span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <LabelText className="mb-3 block">{t("filters.sections.education")}</LabelText>
        <p className="mb-2 text-xs text-slate-500">{t("filters.educationNote")}</p>
        <div className="space-y-2">
          {CANDIDATE_EDUCATION_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
            >
              <input
                type="checkbox"
                disabled
                checked={filters.educationLevels.includes(option.value)}
                onChange={() => toggleMultiSelect("educationLevels", option.value)}
                className="h-4 w-4"
              />
              <span>{t(option.labelKey)}</span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <LabelText className="mb-3 block">{t("filters.sections.experience")}</LabelText>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t("filters.fields.experienceMin")}
            </span>
            <Input
              type="number"
              min="0"
              value={filters.experienceMin ?? ""}
              onChange={(event) =>
                updateNumberField("experienceMin", event.target.value)
              }
              placeholder={t("filters.placeholders.experienceMin")}
            />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t("filters.fields.experienceMax")}
            </span>
            <Input
              type="number"
              min="0"
              value={filters.experienceMax ?? ""}
              onChange={(event) =>
                updateNumberField("experienceMax", event.target.value)
              }
              placeholder={t("filters.placeholders.experienceMax")}
            />
          </div>
        </div>
      </section>

      <section>
        <LabelText className="mb-3 block">
          {t("filters.sections.registrationDate")}
        </LabelText>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t("filters.fields.dateFrom")}
            </span>
            <Input
              type="date"
              value={filters.registeredFrom ?? ""}
              onChange={(event) =>
                updateDateField("registeredFrom", event.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t("filters.fields.dateTo")}
            </span>
            <Input
              type="date"
              value={filters.registeredTo ?? ""}
              onChange={(event) =>
                updateDateField("registeredTo", event.target.value)
              }
            />
          </div>
        </div>
      </section>

      <Button variant="ghost" className="w-full" onClick={resetFilters}>
        {t("filters.actions.reset")}
      </Button>
    </aside>
  );
}
