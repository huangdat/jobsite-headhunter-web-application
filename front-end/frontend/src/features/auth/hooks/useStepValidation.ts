import type { UseAppFormReturn } from "@/shared/hooks/useAppForm";
import type {
  RegisterFormData,
  RegistrationUserRole,
} from "@/features/auth/types";

/**
 * Define which fields need validation for each step
 * Only include REQUIRED fields here
 */
const STEP_FIELDS = {
  1: ["username", "email", "password", "confirmPassword"],
  2: ["fullName", "phone"],
  3: {
    candidate: [], // No required fields for candidate step 3
    collaborator: [],
    headhunter: ["taxCode"],
  },
} as const;

/**
 * Hook to validate current step and determine if Next/Submit button should be disabled
 * @param form - React Hook Form instance
 * @param currentStep - Current step number (1-3)
 * @param userRole - User role (candidate, collaborator, headhunter)
 * @param isCheckingDuplicate - Whether checking for duplicate email/username
 * @returns Object containing validation state
 */
export function useStepValidation(
  form: UseAppFormReturn<RegisterFormData>,
  currentStep: number,
  userRole: RegistrationUserRole,
  isCheckingDuplicate: boolean
) {
  const { formState } = form;
  const { errors } = formState;

  // Get fields that should be validated for current step
  const getFieldsForStep = (step: number): string[] => {
    if (step === 3) {
      // eslint-disable-next-line security/detect-object-injection
      const roleFields = STEP_FIELDS[3][userRole];
      return roleFields ? [...roleFields] : [];
    }
    return [...(STEP_FIELDS[step as 1 | 2] || [])];
  };

  /**
   * Check if current step has any validation errors
   */
  const hasStepErrors = (): boolean => {
    const fieldsToCheck = getFieldsForStep(currentStep);
    return fieldsToCheck.some(
      (field) => errors[field as keyof RegisterFormData]
    );
  };

  /**
   * Check if any required field in current step is empty
   */
  const hasEmptyRequiredFields = (): boolean => {
    const fieldsToCheck = getFieldsForStep(currentStep);

    // If no fields to check, return false (no empty fields)
    if (fieldsToCheck.length === 0) {
      return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formValues = form.getValues() as any;
    return fieldsToCheck.some((field) => {
      // eslint-disable-next-line security/detect-object-injection
      const value = formValues[field];

      // For number fields like commissionRate
      if (field === "commissionRate") {
        return (
          value === null ||
          value === undefined ||
          value === "" ||
          Number.isNaN(value)
        );
      }

      // For string fields
      return !value || (typeof value === "string" && value.trim() === "");
    });
  };

  /**
   * Determine if Next/Continue button should be disabled
   */
  const isNextButtonDisabled = (): boolean => {
    // Disable if form is submitting
    if (formState.isSubmitting) return true;
    // Disable if checking for duplicate email/username
    if (isCheckingDuplicate) return true;
    // Disable if current step has validation errors
    if (hasStepErrors()) return true;

    return false;
  };

  /**
   * Determine if Submit button should be disabled
   */
  const isSubmitButtonDisabled = (): boolean => {
    // Disable if form is submitting
    if (formState.isSubmitting) return true;
    // Disable if checking for duplicate email/username
    if (isCheckingDuplicate) return true;
    // Disable if current step (last step) has validation errors
    if (hasStepErrors()) return true;
    // Disable if current step has empty required fields
    if (hasEmptyRequiredFields()) return true;

    return false;
  };

  return {
    hasStepErrors,
    hasEmptyRequiredFields,
    isNextButtonDisabled: isNextButtonDisabled(),
    isSubmitButtonDisabled: isSubmitButtonDisabled(),
  };
}
