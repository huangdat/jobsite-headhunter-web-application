import type { TFunction } from "i18next";

/**
 * Experience filter preset configuration
 */
export type ExperiencePreset = {
  label: string;
  value: string;
  min?: number;
  max?: number;
};

/**
 * Salary filter preset configuration
 */
export type SalaryPreset = {
  label: string;
  value: string;
  min?: number;
  max?: number;
  negotiable?: boolean;
};

const MILLION = 1_000_000;

/**
 * Generate experience presets with i18n translations
 * @param t - i18next translation function for "jobs" namespace
 */
export function getExperiencePresets(
  t: TFunction
): ReadonlyArray<ExperiencePreset> {
  return [
    { label: t("filterPresets.experienceOptions.all"), value: "ALL" },
    {
      label: t("filterPresets.experienceOptions.notRequired"),
      value: "NONE",
      min: 0,
      max: 0,
    },
    {
      label: t("filterPresets.experienceOptions.under1Year"),
      value: "UNDER_1",
      min: 0,
      max: 0.99,
    },
    {
      label: t("filterPresets.experienceOptions.oneYear"),
      value: "ONE",
      min: 1,
      max: 1,
    },
    {
      label: t("filterPresets.experienceOptions.twoYears"),
      value: "TWO",
      min: 2,
      max: 2,
    },
    {
      label: t("filterPresets.experienceOptions.threeYears"),
      value: "THREE",
      min: 3,
      max: 3,
    },
    {
      label: t("filterPresets.experienceOptions.fourYears"),
      value: "FOUR",
      min: 4,
      max: 4,
    },
    {
      label: t("filterPresets.experienceOptions.fiveYears"),
      value: "FIVE",
      min: 5,
      max: 5,
    },
    {
      label: t("filterPresets.experienceOptions.over5Years"),
      value: "OVER_FIVE",
      min: 6,
    },
  ];
}

/**
 * Generate salary presets with i18n translations
 * @param t - i18next translation function for "jobs" namespace
 */
export function getSalaryPresets(t: TFunction): ReadonlyArray<SalaryPreset> {
  return [
    { label: t("filterPresets.salaryOptions.all"), value: "ALL" },
    {
      label: t("filterPresets.salaryOptions.below10M"),
      value: "LT_10",
      max: 10 * MILLION,
    },
    {
      label: t("filterPresets.salaryOptions.from10To15M"),
      value: "10_15",
      min: 10 * MILLION,
      max: 15 * MILLION,
    },
    {
      label: t("filterPresets.salaryOptions.from15To20M"),
      value: "15_20",
      min: 15 * MILLION,
      max: 20 * MILLION,
    },
    {
      label: t("filterPresets.salaryOptions.from20To25M"),
      value: "20_25",
      min: 20 * MILLION,
      max: 25 * MILLION,
    },
    {
      label: t("filterPresets.salaryOptions.from25To30M"),
      value: "25_30",
      min: 25 * MILLION,
      max: 30 * MILLION,
    },
    {
      label: t("filterPresets.salaryOptions.from30To50M"),
      value: "30_50",
      min: 30 * MILLION,
      max: 50 * MILLION,
    },
    {
      label: t("filterPresets.salaryOptions.above50M"),
      value: "GT_50",
      min: 50 * MILLION,
    },
    {
      label: t("filterPresets.salaryOptions.negotiable"),
      value: "NEGOTIABLE",
      negotiable: true,
    },
  ];
}
