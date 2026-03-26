import * as yup from "yup";
import type { RegistrationUserRole } from "@/features/auth/types";

/**
 * Sanitize input: trim, remove script tags, escape dangerous chars
 */
function sanitizeInput(value: string): string {
  if (!value) return "";
  let sanitized = value.trim();
  // Remove script tags
  sanitized = sanitized.replace(/<script.*?>.*?<\/script>/gi, "");
  // Remove angle brackets
  sanitized = sanitized.replace(/[<>]/g, "");
  return sanitized;
}

/**
 * Create schemas with i18n messages
 * @param t - Translation function from useAppTranslation hook
 * @returns Function to get appropriate schema based on user role
 */
export function createSchemaWithI18n(t: (key: string) => string) {
  /**
   * Base schema for all roles (Step 1 & 2)
   */
  const baseSchema = yup.object({
    username: yup
      .string()
      .required(t("validation.fields.usernameRequired"))
      .min(8, t("validation.fields.usernameBetween"))
      .max(32, t("validation.fields.usernameBetween"))
      .matches(
        /^[a-zA-Z][a-zA-Z0-9_]*$/,
        t("validation.fields.usernameAlphanumeric")
      )
      .transform(sanitizeInput),

    email: yup
      .string()
      .required(t("validation.fields.emailRequired"))
      .email(t("validation.fields.emailInvalid"))
      .transform(sanitizeInput),

    password: yup
      .string()
      .required(t("validation.fields.passwordRequired"))
      .min(8, t("validation.fields.passwordBetween8and16"))
      .max(16, t("validation.fields.passwordBetween8and16"))
      .matches(/[A-Z]/, t("validation.fields.passwordUppercase"))
      .matches(/[a-z]/, t("validation.fields.passwordLowercase"))
      .matches(/\d/, t("validation.fields.passwordNumber")),

    confirmPassword: yup
      .string()
      .required(t("validation.fields.confirmPasswordRequired"))
      .oneOf([yup.ref("password")], t("validation.fields.passwordsDoNotMatch")),

    fullName: yup
      .string()
      .required(t("validation.fields.fullNameRequired"))
      .min(2, t("validation.fields.fullNameMinLength"))
      .matches(/^[a-zA-Z ]+$/, t("validation.fields.fullNameLettersOnly"))
      .transform(sanitizeInput),

    phone: yup
      .string()
      .required(t("validation.fields.phoneRequired"))
      .matches(/^0[3-9]\d{8,9}$/, t("validation.fields.phoneInvalid"))
      .transform((value: string) => value.replace(/[\s-]/g, "")),

    gender: yup
      .string()
      .oneOf(["MALE", "FEMALE", "OTHER"], t("validation.fields.genderInvalid"))
      .nullable()
      .optional(),

    avatar: yup
      .mixed<File>()
      .nullable()
      .optional()
      .test(
        "fileSize",
        t("validation.fields.avatarFileSizeExceeded"),
        (file: File | null | undefined) => {
          if (!file) return true;
          return file.size <= 5 * 1024 * 1024; // 5MB
        }
      )
      .test(
        "fileType",
        t("validation.fields.avatarFileTypeInvalid"),
        (file: File | null | undefined) => {
          if (!file) return true;
          return /^image\/(jpg|jpeg|png|gif|webp)$/.test(file.type);
        }
      ),

    role: yup
      .string()
      .oneOf(
        ["candidate", "collaborator", "headhunter"],
        t("validation.fields.roleInvalid")
      ),

    agreeToTerms: yup
      .boolean()
      .oneOf([true], t("validation.fields.agreeTermsRequired")),
  });

  /**
   * Candidate-specific schema (Step 3)
   */
  const candidateSchema = baseSchema.shape({
    currentTitle: yup
      .string()
      .nullable()
      .transform((value: string | null | undefined) => value || undefined)
      .transform(sanitizeInput),

    bio: yup
      .string()
      .nullable()
      .max(500, t("validation.fields.bioMax"))
      .transform((value: string | null | undefined) => value || undefined)
      .transform(sanitizeInput),

    city: yup
      .string()
      .nullable()
      .transform((value: string | null | undefined) => value || undefined)
      .transform(sanitizeInput),

    yearsOfExperience: yup
      .number()
      .nullable()
      .typeError(t("validation.fields.yearsOfExperienceInvalid"))
      .min(0, t("validation.fields.yearsOfExperienceInvalid"))
      .max(60, t("validation.fields.yearsOfExperienceMax")),

    expectedSalaryMin: yup
      .number()
      .nullable()
      .typeError(t("validation.fields.salaryInvalid"))
      .min(0, t("validation.fields.salaryNegative")),

    expectedSalaryMax: yup
      .number()
      .nullable()
      .typeError(t("validation.fields.salaryInvalid"))
      .min(0, t("validation.fields.salaryNegative")),

    openForWork: yup.boolean(),
  });

  /**
   * Collaborator-specific schema (Step 3)
   */
  const collaboratorSchema = baseSchema.shape({
    commissionRate: yup
      .number()
      .nullable()
      .typeError(t("validation.fields.commissionRateInvalid"))
      .min(0, t("validation.fields.commissionRateInvalid"))
      .max(100, t("validation.fields.commissionRateInvalid")),
  });

  /**
   * Headhunter-specific schema (Step 3)
   */
  const headhunterSchema = baseSchema.shape({
    taxCode: yup
      .string()
      .required(t("validation.fields.taxCodeRequired"))
      .matches(/^\d{10}$|^\d{13}$/, t("validation.fields.taxCodeInvalid"))
      .transform(sanitizeInput),

    websiteUrl: yup
      .string()
      .nullable()
      .url(t("validation.fields.websiteUrlInvalid"))
      .transform((value: string | null | undefined) => value || undefined)
      .transform(sanitizeInput),

    companyScale: yup
      .string()
      .nullable()
      .transform((value: string | null | undefined) => value || undefined)
      .transform(sanitizeInput),
  });

  /**
   * Return function to get schema by role
   */
  return function getSchema(role: RegistrationUserRole) {
    switch (role) {
      case "candidate":
        return candidateSchema;
      case "collaborator":
        return collaboratorSchema;
      case "headhunter":
        return headhunterSchema;
      default:
        return baseSchema;
    }
  };
}

/**
 * Legacy function for backward compatibility (uses English messages)
 */
export function getRegisterSchema(role: RegistrationUserRole) {
  const t = (key: string) => {
    // Mapping of keys to English messages for backward compatibility
    const messages: Record<string, string> = {
      "validation.fields.usernameRequired":
        "validation.fields.usernameRequired",
      "validation.fields.usernameBetween": "validation.fields.usernameBetween",
      "validation.fields.usernameAlphanumeric":
        "validation.fields.usernameAlphanumeric",
      "validation.fields.emailRequired": "validation.fields.emailRequired",
      "validation.fields.emailInvalid": "validation.fields.emailInvalid",
      "validation.fields.passwordRequired":
        "validation.fields.passwordRequired",
      "validation.fields.passwordBetween8and16":
        "validation.fields.passwordBetween8and16",
      "validation.fields.passwordUppercase":
        "validation.fields.passwordUppercase",
      "validation.fields.passwordLowercase":
        "validation.fields.passwordLowercase",
      "validation.fields.passwordNumber": "validation.fields.passwordNumber",
      "validation.fields.confirmPasswordRequired":
        "validation.fields.confirmPasswordRequired",
      "validation.fields.passwordsDoNotMatch":
        "validation.fields.passwordsDoNotMatch",
      "validation.fields.fullNameRequired":
        "validation.fields.fullNameRequired",
      "validation.fields.fullNameMinLength":
        "validation.fields.fullNameMinLength",
      "validation.fields.fullNameLettersOnly":
        "validation.fields.fullNameLettersOnly",
      "validation.fields.phoneRequired": "validation.fields.phoneRequired",
      "validation.fields.phoneInvalid": "validation.fields.phoneInvalid",
      "validation.fields.genderInvalid": "validation.fields.genderInvalid",
      "validation.fields.avatarFileSizeExceeded":
        "validation.fields.avatarFileSizeExceeded",
      "validation.fields.avatarFileTypeInvalid":
        "validation.fields.avatarFileTypeInvalid",
      "validation.fields.yearsOfExperienceInvalid":
        "validation.fields.yearsOfExperienceInvalid",
      "validation.fields.yearsOfExperienceMax":
        "validation.fields.yearsOfExperienceMax",
      "validation.fields.salaryInvalid": "validation.fields.salaryInvalid",
      "validation.fields.salaryNegative": "validation.fields.salaryNegative",
      "validation.fields.taxCodeRequired": "validation.fields.taxCodeRequired",
      "validation.fields.taxCodeInvalid": "validation.fields.taxCodeInvalid",
      "validation.fields.websiteUrlInvalid":
        "validation.fields.websiteUrlInvalid",
      "validation.fields.commissionRateInvalid":
        "validation.fields.commissionRateInvalid",
      "validation.fields.agreeTermsRequired":
        "validation.fields.agreeTermsRequired",
    };
    // eslint-disable-next-line security/detect-object-injection
    return messages[key] || key;
  };

  const getSchema = createSchemaWithI18n(t);
  return getSchema(role);
}
