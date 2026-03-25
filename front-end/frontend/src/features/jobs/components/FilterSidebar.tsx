import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { JobFilterParams } from "../types";
import { EXPERIENCE_PRESETS, SALARY_PRESETS, RANK_LEVELS, WORKING_TYPES } from "../utils";
import { useJobFilters } from "../hooks";

interface FilterSidebarProps {
  filters: JobFilterParams;
  onFilterChange: (filters: JobFilterParams) => void;
}

export function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
  const {
    keyword,
    experienceValue,
    salaryPreset,
    customSalaryMin,
    customSalaryMax,
    handleKeywordChange,
    handleExperienceChange,
    handleSalaryPresetChange,
    handleCustomSalaryApply,
    handleWorkingTypeChange,
    handleRankLevelChange,
    handleReset,
    setCustomSalaryMin,
    setCustomSalaryMax,
  } = useJobFilters(filters, onFilterChange);

  return (
    <aside className="sticky top-20 h-fit space-y-6 rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      {/* Keyword Search */}
      <div>
        <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">
          Keyword
        </h3>
        <Input
          value={keyword}
          onChange={(e) => handleKeywordChange(e.target.value)}
          placeholder="Job title or skill"
          className="text-sm"
        />
      </div>

      {/* Working Type Filter */}
      <div>
        <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">
          Working Type
        </h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="workingType"
              value=""
              checked={!filters.workingType}
              onChange={(e) => handleWorkingTypeChange(e.target.value)}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              All types
            </span>
          </label>
          {WORKING_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="workingType"
                value={type}
                checked={filters.workingType === type}
                onChange={(e) => handleWorkingTypeChange(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {type.charAt(0) + type.slice(1).toLowerCase()}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Rank Level Filter */}
      <div>
        <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">
          Rank Level
        </h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="rankLevel"
              value=""
              checked={!filters.rankLevel}
              onChange={(e) => handleRankLevelChange(e.target.value)}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              All levels
            </span>
          </label>
          {RANK_LEVELS.map((level) => (
            <label key={level} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rankLevel"
                value={level}
                checked={filters.rankLevel === level}
                onChange={(e) => handleRankLevelChange(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {level.charAt(0) + level.slice(1).toLowerCase()}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Filter */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-white">Experience</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {EXPERIENCE_PRESETS.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 rounded-xl border border-slate-100 px-3 py-2 text-sm text-slate-700 hover:border-emerald-300 dark:border-slate-700 dark:text-slate-200"
            >
              <input
                type="radio"
                name="experience"
                value={option.value}
                checked={experienceValue === option.value}
                onChange={(e) => handleExperienceChange(e.target.value)}
                className="h-4 w-4"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Salary Filter */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-white">Salary (VND)</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {SALARY_PRESETS.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 rounded-xl border border-slate-100 px-3 py-2 text-sm text-slate-700 hover:border-emerald-300 dark:border-slate-700 dark:text-slate-200"
            >
              <input
                type="radio"
                name="salary"
                value={option.value}
                checked={salaryPreset === option.value}
                onChange={(e) => handleSalaryPresetChange(e.target.value)}
                className="h-4 w-4"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              value={customSalaryMin}
              onChange={(e) => setCustomSalaryMin(e.target.value)}
              placeholder="From (mil)"
              className="text-sm"
            />
            <span className="text-slate-400">-</span>
            <Input
              type="number"
              min="0"
              value={customSalaryMax}
              onChange={(e) => setCustomSalaryMax(e.target.value)}
              placeholder="To (mil)"
              className="text-sm"
            />
          </div>
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={handleCustomSalaryApply}
          >
            Apply custom range
          </Button>
        </div>
      </div>

      {/* Reset Button */}
      <Button
        variant="ghost"
        className="w-full"
        onClick={handleReset}
      >
        Clear all filters
      </Button>
    </aside>
  );
}
