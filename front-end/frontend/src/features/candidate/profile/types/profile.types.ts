export type CandidateAvailabilityStatus =
  | "ACTIVELY_INTERVIEWING"
  | "OPEN_FOR_WORK"
  | "PASSIVELY_LOOKING"
  | "NOT_LOOKING";

export interface CandidateProfile {
  id?: string;
  fullName: string;
  email?: string;
  phone?: string;
  currentTitle: string;
  cvUrl?: string;
  yearsOfExperience: number | null;
  currentStatus: CandidateAvailabilityStatus;
  expectedSalaryMin: number | null;
  expectedSalaryMax: number | null;
  bio: string;
  city: string;
  openForWork: boolean;
}

export type CandidateProfileFormValues = Omit<CandidateProfile, "id">;

export type ProfileValidationErrors = Partial<
  Record<keyof CandidateProfileFormValues, string>
>;

export interface ProfileValidationResult {
  isValid: boolean;
  errors: ProfileValidationErrors;
}

export interface CandidateProfilePayload {
  currentTitle?: string;
  yearsOfExperience?: number;
  expectedSalaryMin?: number;
  expectedSalaryMax?: number;
  bio?: string;
  city?: string;
  openForWork?: boolean;
  cvUrl?: string; // Đảm bảo trường này tồn tại
}

export interface UseProfileUpdateReturn {
  profile: CandidateProfileFormValues | null;
  draft: CandidateProfileFormValues;
  errors: ProfileValidationErrors;
  loading: boolean;
  saving: boolean;
  success: boolean;
  fetchError: string | null;
  saveError: string | null;
  dirty: boolean;
  profileStrength: number;
  updateField: <K extends keyof CandidateProfileFormValues>(
    field: K,
    value: CandidateProfileFormValues[K]
  ) => void;
  discardChanges: () => void;
  saveChanges: () => Promise<boolean>;
  clearSuccess: () => void;
}

export const AVAILABILITY_OPTIONS: CandidateAvailabilityStatus[] = [
  "ACTIVELY_INTERVIEWING",
  "OPEN_FOR_WORK",
  "PASSIVELY_LOOKING",
  "NOT_LOOKING",
];

export const DEFAULT_PROFILE_VALUES: CandidateProfileFormValues = {
  fullName: "",
  email: "",
  phone: "",
  currentTitle: "",
  cvUrl: "",
  yearsOfExperience: null,
  currentStatus: "OPEN_FOR_WORK",
  expectedSalaryMin: null,
  expectedSalaryMax: null,
  bio: "",
  city: "",
  openForWork: true,
};
