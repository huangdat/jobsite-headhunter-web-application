export interface CandidateSuggestion {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  skills?: string[];
}

export interface CandidateDetail {
  id: string;
  username: string;
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  imageUrl?: string | null;
  currentTitle?: string | null;
  yearsOfExperience?: number | null;
  expectedSalaryMin?: number | null;
  expectedSalaryMax?: number | null;
  bio?: string | null;
  city?: string | null;
  openForWork?: boolean | null;
}

export type CandidateAccountStatus =
  | "PENDING"
  | "ACTIVE"
  | "SUSPENDED"
  | "DELETED";

export interface CandidateAccount {
  id: string;
  username?: string | null;
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  imageUrl?: string | null;
  currentTitle?: string | null;
  yearsOfExperience?: number | null;
  city?: string | null;
  openForWork?: boolean | null;
  status?: CandidateAccountStatus | null;
  createdAt?: string | null;
}

export type CandidateFilterStatus =
  | "PENDING"
  | "ACTIVE"
  | "SUSPENDED"
  | "DELETED";

export interface CandidateFilterParams {
  statuses: CandidateFilterStatus[];
  locations: string[];
  industries: string[];
  educationLevels: string[];
  experienceMin: number | null;
  experienceMax: number | null;
  registeredFrom: string | null;
  registeredTo: string | null;
}

export interface CandidateFilterOption {
  value: string;
  labelKey: string;
}

export const CANDIDATE_FILTER_MULTI_KEYS = [
  "statuses",
  "locations",
  "industries",
  "educationLevels",
] as const;

export const CANDIDATE_FILTER_NUMBER_KEYS = [
  "experienceMin",
  "experienceMax",
] as const;

export const CANDIDATE_FILTER_DATE_KEYS = [
  "registeredFrom",
  "registeredTo",
] as const;

export type CandidateFilterMultiKey =
  (typeof CANDIDATE_FILTER_MULTI_KEYS)[number];
export type CandidateFilterNumberKey =
  (typeof CANDIDATE_FILTER_NUMBER_KEYS)[number];
export type CandidateFilterDateKey =
  (typeof CANDIDATE_FILTER_DATE_KEYS)[number];

export const CANDIDATE_STATUS_OPTIONS: CandidateFilterOption[] = [
  {
    value: "ACTIVE",
    labelKey: "filters.options.status.active",
  },
  {
    value: "PENDING",
    labelKey: "filters.options.status.pending",
  },
  {
    value: "SUSPENDED",
    labelKey: "filters.options.status.suspended",
  },
  {
    value: "DELETED",
    labelKey: "filters.options.status.deleted",
  },
];

export const CANDIDATE_LOCATION_OPTIONS: CandidateFilterOption[] = [
  { value: "Ha Noi", labelKey: "filters.options.locations.haNoi" },
  { value: "Ho Chi Minh", labelKey: "filters.options.locations.hoChiMinh" },
  { value: "Da Nang", labelKey: "filters.options.locations.daNang" },
];

export const CANDIDATE_INDUSTRY_OPTIONS: CandidateFilterOption[] = [
  {
    value: "PROGRAMMING_LANGUAGES",
    labelKey: "filters.options.industries.programmingLanguages",
  },
  {
    value: "FRONTEND_DEVELOPMENT",
    labelKey: "filters.options.industries.frontendDevelopment",
  },
  {
    value: "BACKEND_DEVELOPMENT",
    labelKey: "filters.options.industries.backendDevelopment",
  },
  {
    value: "DATABASES",
    labelKey: "filters.options.industries.databases",
  },
  {
    value: "DEVOPS_AND_CLOUD",
    labelKey: "filters.options.industries.devopsAndCloud",
  },
  {
    value: "TESTING",
    labelKey: "filters.options.industries.testing",
  },
  {
    value: "VERSION_CONTROL",
    labelKey: "filters.options.industries.versionControl",
  },
  {
    value: "SOFTWARE_ARCHITECTURE_AND_CONCEPTS",
    labelKey: "filters.options.industries.softwareArchitecture",
  },
  {
    value: "DATA_AND_AI",
    labelKey: "filters.options.industries.dataAndAi",
  },
];

export const CANDIDATE_EDUCATION_OPTIONS: CandidateFilterOption[] = [
  { value: "high_school", labelKey: "filters.options.education.highSchool" },
  { value: "associate", labelKey: "filters.options.education.associate" },
  { value: "bachelor", labelKey: "filters.options.education.bachelor" },
  { value: "master", labelKey: "filters.options.education.master" },
  { value: "phd", labelKey: "filters.options.education.phd" },
];

export const createDefaultCandidateFilters = (): CandidateFilterParams => ({
  statuses: [],
  locations: [],
  industries: [],
  educationLevels: [],
  experienceMin: null,
  experienceMax: null,
  registeredFrom: null,
  registeredTo: null,
});

export const DEFAULT_CANDIDATE_FILTERS = createDefaultCandidateFilters();
