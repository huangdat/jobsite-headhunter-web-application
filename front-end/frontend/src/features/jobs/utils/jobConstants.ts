/**
 * Job feature constants
 * Centralized data for filters, presets, and configuration
 */

export const MILLION = 1_000_000;
export const INITIAL_PAGE_SIZE = 12;

export type ExperiencePreset = {
  label: string;
  value: string;
  min?: number;
  max?: number;
};

export type SalaryPreset = {
  label: string;
  value: string;
  min?: number;
  max?: number;
  negotiable?: boolean;
};

export const EXPERIENCE_PRESETS: ReadonlyArray<ExperiencePreset> = [
  { label: "All", value: "ALL" },
  { label: "Not required", value: "NONE", min: 0, max: 0 },
  { label: "Under 1 year", value: "UNDER_1", min: 0, max: 0.99 },
  { label: "1 year", value: "ONE", min: 1, max: 1 },
  { label: "2 years", value: "TWO", min: 2, max: 2 },
  { label: "3 years", value: "THREE", min: 3, max: 3 },
  { label: "4 years", value: "FOUR", min: 4, max: 4 },
  { label: "5 years", value: "FIVE", min: 5, max: 5 },
  { label: "Over 5 years", value: "OVER_FIVE", min: 6 },
];

export const SALARY_PRESETS: ReadonlyArray<SalaryPreset> = [
  { label: "All", value: "ALL" },
  { label: "Below 10M", value: "LT_10", max: 10 * MILLION },
  { label: "10 - 15M", value: "10_15", min: 10 * MILLION, max: 15 * MILLION },
  { label: "15 - 20M", value: "15_20", min: 15 * MILLION, max: 20 * MILLION },
  { label: "20 - 25M", value: "20_25", min: 20 * MILLION, max: 25 * MILLION },
  { label: "25 - 30M", value: "25_30", min: 25 * MILLION, max: 30 * MILLION },
  { label: "30 - 50M", value: "30_50", min: 30 * MILLION, max: 50 * MILLION },
  { label: "Above 50M", value: "GT_50", min: 50 * MILLION },
  { label: "Negotiable", value: "NEGOTIABLE", negotiable: true },
];

export const RANK_LEVELS = [
  "INTERN",
  "FRESHER",
  "JUNIOR",
  "MIDDLE",
  "SENIOR",
  "LEADER",
  "MANAGER",
] as const;

export const WORKING_TYPES = ["ONSITE", "REMOTE", "HYBRID"] as const;

/**
 * Default values for job form (create & edit)
 */
export const JOB_FORM_DEFAULTS = {
  title: "",
  description: "",
  rankLevel: "JUNIOR" as const,
  workingType: "ONSITE" as const,
  location: "Ho Chi Minh City",
  addressDetail: "",
  experience: 1,
  salaryMin: 15000000,
  salaryMax: 30000000,
  negotiable: false,
  currency: "VND",
  quantity: 1,
  skillIds: [],
  responsibilities: "",
  requirements: "",
  benefits: "",
  workingTime: "Mon - Fri",
};

/**
 * Calculate default deadline (30 days from today)
 */
export const calculateDefaultDeadline = (): string => {
  const today = new Date();
  today.setDate(today.getDate() + 30);
  return today.toISOString().slice(0, 10);
};
