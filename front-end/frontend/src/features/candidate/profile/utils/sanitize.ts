import type {
  CandidateProfileFormValues,
  CandidateProfilePayload,
} from "../types/profile.types";

const collapseSpaces = (value: string): string =>
  value.replace(/\s+/g, " ").trim();

export const sanitizeText = (value: string): string => {
  if (!value) return "";

  return collapseSpaces(
    value
      .replace(/<script.*?>.*?<\/script>/gi, "")
      .replace(/[<>]/g, "")
      .replace(/[\u0000-\u001F\u007F]/g, "")
  );
};

export const sanitizeInteger = (value: number | null): number | null => {
  if (value === null || Number.isNaN(value)) {
    return null;
  }
  return Math.trunc(value);
};

export const sanitizeCurrency = (value: number | null): number | null => {
  if (value === null || Number.isNaN(value)) {
    return null;
  }
  return Number(value.toFixed(2));
};

export const sanitizeProfileDraft = (
  draft: CandidateProfileFormValues
): CandidateProfileFormValues => {
  return {
    ...draft,
    fullName: sanitizeText(draft.fullName),
    email: sanitizeText(draft.email || ""),
    phone: sanitizeText(draft.phone || ""),
    currentTitle: sanitizeText(draft.currentTitle),
    currentStatus: draft.currentStatus,
    bio: sanitizeText(draft.bio),
    city: sanitizeText(draft.city),
    cvUrl: draft.cvUrl || "",
    yearsOfExperience: sanitizeInteger(draft.yearsOfExperience),
    expectedSalaryMin: sanitizeCurrency(draft.expectedSalaryMin),
    expectedSalaryMax: sanitizeCurrency(draft.expectedSalaryMax),
    openForWork: Boolean(draft.openForWork),
  };
};

export const toProfilePayload = (
  draft: CandidateProfileFormValues
): CandidateProfilePayload => {
  const sanitized = sanitizeProfileDraft(draft);

  return {
    currentTitle: sanitized.currentTitle || undefined,
    yearsOfExperience: sanitized.yearsOfExperience ?? undefined,
    expectedSalaryMin: sanitized.expectedSalaryMin ?? undefined,
    expectedSalaryMax: sanitized.expectedSalaryMax ?? undefined,
    bio: sanitized.bio || undefined,
    city: sanitized.city || undefined,
    openForWork: sanitized.openForWork,
    cvUrl: sanitized.cvUrl || undefined,
  };
};
