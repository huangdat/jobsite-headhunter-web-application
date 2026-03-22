import * as yup from "yup";
import type { RegistrationUserRole } from "../types";

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
        (file: any) => {
          if (!file) return true;
          return file.size <= 5 * 1024 * 1024; // 5MB
        }
      )
      .test(
        "fileType",
        t("validation.fields.avatarFileTypeInvalid"),
        (file: any) => {
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
      .transform((value: any) => value || undefined)
      .transform(sanitizeInput),

    bio: yup
      .string()
      .nullable()
      .max(500, t("validation.fields.bioMax"))
      .transform((value: any) => value || undefined)
      .transform(sanitizeInput),

    city: yup
      .string()
      .nullable()
      .transform((value: any) => value || undefined)
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
      .transform((value: any) => value || undefined)
      .transform(sanitizeInput),

    companyScale: yup
      .string()
      .nullable()
      .transform((value: any) => value || undefined)
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
      "validation.fields.usernameRequired": "Username is required",
      "validation.fields.usernameBetween":
        "Username must be between 8 and 32 characters",
      "validation.fields.usernameAlphanumeric":
        "Username must start with a letter and contain only letters, numbers, and underscores",
      "validation.fields.emailRequired": "Email is required",
      "validation.fields.emailInvalid": "Please enter a valid email address",
      "validation.fields.passwordRequired": "Password is required",
      "validation.fields.passwordBetween8and16":
        "Password must be between 8 and 16 characters",
      "validation.fields.passwordUppercase":
        "Password must contain at least one uppercase letter",
      "validation.fields.passwordLowercase":
        "Password must contain at least one lowercase letter",
      "validation.fields.passwordNumber":
        "Password must contain at least one number",
      "validation.fields.confirmPasswordRequired":
        "Please confirm your password",
      "validation.fields.passwordsDoNotMatch": "Passwords do not match",
      "validation.fields.fullNameRequired": "Full name is required",
      "validation.fields.fullNameMinLength":
        "Full name must be at least 2 characters",
      "validation.fields.fullNameLettersOnly":
        "Full name can only contain letters and spaces",
      "validation.fields.phoneRequired": "Phone number is required",
      "validation.fields.phoneInvalid":
        "Please enter a valid Vietnamese phone number (e.g., 0912345678)",
      "validation.fields.genderInvalid": "Invalid gender",
      "validation.fields.avatarFileSizeExceeded":
        "File size must be less than 5MB",
      "validation.fields.avatarFileTypeInvalid":
        "File must be an image (JPG, PNG, GIF, WebP)",
      "validation.fields.yearsOfExperienceInvalid":
        "Years of experience cannot be negative",
      "validation.fields.yearsOfExperienceMax":
        "Years of experience cannot exceed 60",
      "validation.fields.salaryInvalid": "Salary must be a number",
      "validation.fields.salaryNegative": "Salary cannot be negative",
      "validation.fields.taxCodeRequired": "Tax code is required",
      "validation.fields.taxCodeInvalid": "Tax code must be 10 or 13 digits",
      "validation.fields.websiteUrlInvalid": "Website URL must be valid",
      "validation.fields.commissionRateInvalid":
        "Commission rate must be between 0 and 100",
      "validation.fields.agreeTermsRequired":
        "You must agree to the terms and conditions",
    };
    return messages[key] || key;
  };

  const getSchema = createSchemaWithI18n(t);
  return getSchema(role);
}
