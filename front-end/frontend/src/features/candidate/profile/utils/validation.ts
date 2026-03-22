import type {
  CandidateProfileFormValues,
  ProfileValidationErrors,
  ProfileValidationResult,
} from "@/features/candidate/profile/types/profile.types";
import i18n from "@/i18n/config";

const MAX_TITLE_LENGTH = 120;
const MAX_BIO_LENGTH = 1000;
const MAX_CITY_LENGTH = 80;
const MAX_YOE = 60;
const MAX_SALARY = 1_000_000;

export const validateProfileForm = (
  values: CandidateProfileFormValues
): ProfileValidationResult => {
  const t = i18n.t.bind(i18n);
  const errors: ProfileValidationErrors = {};

  if (!values.currentTitle.trim()) {
    errors.currentTitle = String(
      t("candidate.profile.validation.currentTitleRequired")
    );
  } else if (values.currentTitle.trim().length > MAX_TITLE_LENGTH) {
    errors.currentTitle = String(
      t("candidate.profile.validation.currentTitleMax", {
        max: MAX_TITLE_LENGTH,
      })
    );
  }

  if (values.yearsOfExperience !== null) {
    if (values.yearsOfExperience < 0) {
      errors.yearsOfExperience = String(
        t("candidate.profile.validation.yearsOfExperienceMin")
      );
    } else if (values.yearsOfExperience > MAX_YOE) {
      errors.yearsOfExperience = String(
        t("candidate.profile.validation.yearsOfExperienceMax", {
          max: MAX_YOE,
        })
      );
    }
  }

  if (values.expectedSalaryMin !== null) {
    if (values.expectedSalaryMin < 0) {
      errors.expectedSalaryMin = String(
        t("candidate.profile.validation.salaryMinNegative")
      );
    } else if (values.expectedSalaryMin > MAX_SALARY) {
      errors.expectedSalaryMin = String(
        t("candidate.profile.validation.salaryMinTooHigh")
      );
    }
  }

  if (values.expectedSalaryMax !== null) {
    if (values.expectedSalaryMax < 0) {
      errors.expectedSalaryMax = String(
        t("candidate.profile.validation.salaryMaxNegative")
      );
    } else if (values.expectedSalaryMax > MAX_SALARY) {
      errors.expectedSalaryMax = String(
        t("candidate.profile.validation.salaryMaxTooHigh")
      );
    }
  }

  if (
    values.expectedSalaryMin !== null &&
    values.expectedSalaryMax !== null &&
    values.expectedSalaryMax < values.expectedSalaryMin
  ) {
    errors.expectedSalaryMax = String(
      t("candidate.profile.validation.salaryMaxInvalidRange")
    );
  }

  if (values.bio.trim().length > MAX_BIO_LENGTH) {
    errors.bio = String(
      t("candidate.profile.validation.bioMax", { max: MAX_BIO_LENGTH })
    );
  }

  if (values.city.trim().length > MAX_CITY_LENGTH) {
    errors.city = String(
      t("candidate.profile.validation.cityMax", { max: MAX_CITY_LENGTH })
    );
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const computeProfileStrength = (
  values: CandidateProfileFormValues,
  hasValidationError: boolean
): number => {
  const weightedChecks: Array<{ ok: boolean; weight: number }> = [
    { ok: values.fullName.trim().length > 0, weight: 10 },
    { ok: values.currentTitle.trim().length > 0, weight: 18 },
    { ok: values.yearsOfExperience !== null, weight: 16 },
    {
      ok:
        values.expectedSalaryMin !== null &&
        values.expectedSalaryMax !== null &&
        values.expectedSalaryMax >= values.expectedSalaryMin,
      weight: 16,
    },
    { ok: values.bio.trim().length >= 60, weight: 24 },
    { ok: values.city.trim().length > 0, weight: 8 },
    { ok: values.openForWork, weight: 8 },
  ];

  const score = weightedChecks.reduce((total, check) => {
    return total + (check.ok ? check.weight : 0);
  }, 0);

  if (hasValidationError) {
    return Math.max(15, Math.floor(score * 0.7));
  }

  return Math.min(100, score);
};
