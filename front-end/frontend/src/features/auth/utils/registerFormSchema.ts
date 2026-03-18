import * as yup from "yup";
import type { UserRole } from "../types";

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
      .required(t("auth.validation.fields.usernameRequired"))
      .min(8, t("auth.validation.fields.usernameBetween"))
      .max(32, t("auth.validation.fields.usernameBetween"))
      .matches(/^[a-zA-Z][a-zA-Z0-9_]*$/, 
        t("auth.validation.fields.usernameAlphanumeric")
      )
      .transform(sanitizeInput),

    email: yup
      .string()
      .required(t("auth.validation.fields.emailRequired"))
      .email(t("auth.validation.fields.emailInvalid"))
      .transform(sanitizeInput),

    password: yup
      .string()
      .required(t("auth.validation.fields.passwordRequired"))
      .min(8, t("auth.validation.fields.passwordBetween8and16"))
      .max(16, t("auth.validation.fields.passwordBetween8and16"))
      .matches(/[A-Z]/, t("auth.validation.fields.passwordUppercase"))
      .matches(/[a-z]/, t("auth.validation.fields.passwordLowercase"))
      .matches(/\d/, t("auth.validation.fields.passwordNumber")),

    confirmPassword: yup
      .string()
      .required(t("auth.validation.fields.confirmPasswordRequired"))
      .oneOf([yup.ref("password")], t("auth.validation.fields.passwordsDoNotMatch")),

    fullName: yup
      .string()
      .required(t("auth.validation.fields.fullNameRequired"))
      .min(2, t("auth.validation.fields.fullNameMinLength"))
      .matches(/^[a-zA-Z ]+$/, t("auth.validation.fields.fullNameLettersOnly"))
      .transform(sanitizeInput),

    phone: yup
      .string()
      .required(t("auth.validation.fields.phoneRequired"))
      .matches(/^0[3-9]\d{8,9}$/, 
        t("auth.validation.fields.phoneInvalid")
      )
      .transform((value: string) => value.replace(/[\s-]/g, "")),

    gender: yup
      .string()
      .oneOf(["MALE", "FEMALE", "OTHER"], t("auth.validation.fields.genderInvalid"))
      .nullable()
      .optional(),

    avatar: yup
      .mixed<File>()
      .nullable()
      .optional()
      .test("fileSize", t("auth.validation.fields.avatarFileSizeExceeded"), (file: any) => {
        if (!file) return true;
        return file.size <= 5 * 1024 * 1024; // 5MB
      })
      .test("fileType", t("auth.validation.fields.avatarFileTypeInvalid"), (file: any) => {
        if (!file) return true;
        return /^image\/(jpg|jpeg|png|gif|webp)$/.test(file.type);
      }),

    role: yup.string().oneOf(["candidate", "collaborator", "headhunter"], 
      t("auth.validation.fields.genderInvalid")
    ),

    agreeToTerms: yup
      .boolean()
      .oneOf([true], t("auth.validation.fields.agreeTermsRequired")),
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
      .max(500, "Bio must be less than 500 characters")
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
      .typeError(t("auth.validation.fields.yearsOfExperienceInvalid"))
      .min(0, t("auth.validation.fields.yearsOfExperienceInvalid"))
      .max(60, t("auth.validation.fields.yearsOfExperienceMax")),

    expectedSalaryMin: yup
      .number()
      .nullable()
      .typeError(t("auth.validation.fields.salaryInvalid"))
      .min(0, t("auth.validation.fields.salaryNegative")),

    expectedSalaryMax: yup
      .number()
      .nullable()
      .typeError(t("auth.validation.fields.salaryInvalid"))
      .min(0, t("auth.validation.fields.salaryNegative")),

    openForWork: yup.boolean(),
  });

  /**
   * Collaborator-specific schema (Step 3)
   */
  const collaboratorSchema = baseSchema.shape({
    commissionRate: yup
      .number()
      .nullable()
      .typeError(t("auth.validation.fields.commissionRateInvalid"))
      .min(0, t("auth.validation.fields.commissionRateInvalid"))
      .max(100, t("auth.validation.fields.commissionRateInvalid")),
  });

  /**
   * Headhunter-specific schema (Step 3)
   */
  const headhunterSchema = baseSchema.shape({
    taxCode: yup
      .string()
      .required(t("auth.validation.fields.taxCodeRequired"))
      .matches(/^\d{10}$|^\d{13}$/, 
        t("auth.validation.fields.taxCodeInvalid")
      )
      .transform(sanitizeInput),

    websiteUrl: yup
      .string()
      .nullable()
      .url(t("auth.validation.fields.websiteUrlInvalid"))
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
  return function getSchema(role: UserRole) {
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
export function getRegisterSchema(role: UserRole) {
  const t = (key: string) => {
    // Mapping of keys to English messages for backward compatibility
    const messages: Record<string, string> = {
      "auth.validation.fields.usernameRequired": "Username is required",
      "auth.validation.fields.usernameBetween": "Username must be between 8 and 32 characters",
      "auth.validation.fields.usernameAlphanumeric": "Username must start with a letter and contain only letters, numbers, and underscores",
      "auth.validation.fields.emailRequired": "Email is required",
      "auth.validation.fields.emailInvalid": "Please enter a valid email address",
      "auth.validation.fields.passwordRequired": "Password is required",
      "auth.validation.fields.passwordBetween8and16": "Password must be between 8 and 16 characters",
      "auth.validation.fields.passwordUppercase": "Password must contain at least one uppercase letter",
      "auth.validation.fields.passwordLowercase": "Password must contain at least one lowercase letter",
      "auth.validation.fields.passwordNumber": "Password must contain at least one number",
      "auth.validation.fields.confirmPasswordRequired": "Please confirm your password",
      "auth.validation.fields.passwordsDoNotMatch": "Passwords do not match",
      "auth.validation.fields.fullNameRequired": "Full name is required",
      "auth.validation.fields.fullNameMinLength": "Full name must be at least 2 characters",
      "auth.validation.fields.fullNameLettersOnly": "Full name can only contain letters and spaces",
      "auth.validation.fields.phoneRequired": "Phone number is required",
      "auth.validation.fields.phoneInvalid": "Please enter a valid Vietnamese phone number (e.g., 0912345678)",
      "auth.validation.fields.genderInvalid": "Invalid gender",
      "auth.validation.fields.avatarFileSizeExceeded": "File size must be less than 5MB",
      "auth.validation.fields.avatarFileTypeInvalid": "File must be an image (JPG, PNG, GIF, WebP)",
      "auth.validation.fields.yearsOfExperienceInvalid": "Years of experience cannot be negative",
      "auth.validation.fields.yearsOfExperienceMax": "Years of experience cannot exceed 60",
      "auth.validation.fields.salaryInvalid": "Salary must be a number",
      "auth.validation.fields.salaryNegative": "Salary cannot be negative",
      "auth.validation.fields.taxCodeRequired": "Tax code is required",
      "auth.validation.fields.taxCodeInvalid": "Tax code must be 10 or 13 digits",
      "auth.validation.fields.websiteUrlInvalid": "Website URL must be valid",
      "auth.validation.fields.commissionRateInvalid": "Commission rate must be between 0 and 100",
      "auth.validation.fields.agreeTermsRequired": "You must agree to the terms and conditions",
    };
    return messages[key] || key;
  };

  const getSchema = createSchemaWithI18n(t);
  return getSchema(role);
}
