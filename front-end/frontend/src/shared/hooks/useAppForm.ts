import { useForm } from "react-hook-form";
import type {
  SubmitHandler,
  UseFormProps,
  FieldValues,
  Path,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";

export type UseAppFormReturn<T extends FieldValues> = ReturnType<typeof useForm<T>> & {
  getError: (fieldName: Path<T>) => string | undefined;
  hasError: (fieldName: Path<T>) => boolean;
  handleSubmit: UseFormHandleSubmit<T>;
};

/**
 * Custom hook combining react-hook-form with common patterns
 * Usage:
 *   const form = useAppForm<LoginFormData>({
 *     defaultValues: { email: "", password: "" },
 *   });
 */
export function useAppForm<T extends FieldValues>(
  options?: Omit<UseFormProps<T>, "mode">,
): UseAppFormReturn<T> {
  const form = useForm<T>({
    mode: "onBlur", // Validate on blur for better UX
    ...options,
  });

  /**
   * Helper to get error message for a field
   */
  const getError = (fieldName: Path<T>): string | undefined => {
    const fieldPath = fieldName.split(".") as (keyof T)[];
    let error: unknown = form.formState.errors;

    for (const key of fieldPath) {
      if (typeof error === "object" && error !== null && key in error) {
        error = error[key as keyof typeof error];
      } else {
        return undefined;
      }
    }

    if (typeof error === "object" && error !== null && "message" in error) {
      return String(error.message);
    }

    return undefined;
  };

  /**
   * Helper to check if a field has an error
   */
  const hasError = (fieldName: Path<T>): boolean => {
    return !!getError(fieldName);
  };

  /**
   * Enhanced handleSubmit with proper typing
   */
  const handleSubmit = (
    onValid: SubmitHandler<T>,
    onInvalid?: (errors: FieldErrors<T>) => void,
  ) => {
    return form.handleSubmit(onValid, onInvalid as any);
  };

  return {
    ...form,
    getError,
    hasError,
    handleSubmit,
  } as UseAppFormReturn<T>;
}
