/**
 * Form Validation Errors Component
 * Displays inline errors for form fields
 */

import React from "react";
import { AlertCircle } from "lucide-react";
import { useBusinessTranslation } from "@/shared/hooks/useFeatureTranslation";
import type { BusinessFormErrors } from "../types/business.types";

export interface FormValidationErrorProps {
  error?: string; // i18n key
  touched?: boolean;
  className?: string;
}

/**
 * Inline Error Display Component
 * Shows error message with icon for a single field
 */
export const FormValidationError: React.FC<FormValidationErrorProps> = ({
  error,
  touched = false,
  className = "",
}) => {
  const { t } = useBusinessTranslation();

  if (!error || !touched) return null;

  return (
    <div
      className={`mt-1 flex items-center gap-2 text-sm text-red-600 ${className}`}
    >
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span>{t(error)}</span>
    </div>
  );
};

export interface FormValidationErrorsListProps {
  errors: BusinessFormErrors;
  touchedFields: Set<string>;
  className?: string;
}

/**
 * Multiple Errors Display Component
 * Shows all validation errors together (optional)
 */
export const FormValidationErrorsList: React.FC<
  FormValidationErrorsListProps
> = ({ errors, touchedFields, className = "" }) => {
  const { t } = useBusinessTranslation();

  const visibleErrors = Object.entries(errors)
    .filter(([fieldName]) => touchedFields.has(fieldName))
    .map(([fieldName, errorKey]) => ({ fieldName, errorKey }));

  if (visibleErrors.length === 0) return null;

  return (
    <ul className={`space-y-2 text-sm text-red-600 ${className}`}>
      {visibleErrors.map(({ fieldName, errorKey }) => (
        <li key={fieldName} className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{t(errorKey || "")}</span>
        </li>
      ))}
    </ul>
  );
};

export default FormValidationError;
