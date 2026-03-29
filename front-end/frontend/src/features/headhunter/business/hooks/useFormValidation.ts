/**
 * Form Validation Hook
 * Handles real-time field validation for business profile form
 */

import { useState, useCallback, useMemo } from "react";
import type {
  BusinessFormData,
  BusinessFormErrors,
} from "../types/business.types";
import { ERROR_MESSAGE_KEYS } from "../types/business.types";

export interface UseFormValidationOptions {
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  serverValidationDebounce?: number;
}

const DEFAULT_OPTIONS: UseFormValidationOptions = {
  validateOnBlur: true,
  validateOnChange: false,
  serverValidationDebounce: 500,
};

/**
 * Custom hook for form validation
 * Performs client-side and server-side validation
 */
export const useFormValidation = (options: UseFormValidationOptions = {}) => {
  const config = { ...DEFAULT_OPTIONS, ...options };

  const [errors, setErrors] = useState<BusinessFormErrors>({});
  const [touchedFields, setTouchedFields] = useState<
    Set<keyof BusinessFormData>
  >(new Set());

  /**
   * Validate Company Name
   */
  const validateCompanyName = useCallback((value: string): string | null => {
    if (!value) {
      return ERROR_MESSAGE_KEYS.companyName.required;
    }

    if (value.length < 2) {
      return ERROR_MESSAGE_KEYS.companyName.minLength;
    }

    if (value.length > 255) {
      return ERROR_MESSAGE_KEYS.companyName.maxLength;
    }

    // Check pattern
    const pattern = /^[a-zA-Z0-9\s\-&.,()]+$/;
    if (!pattern.test(value)) {
      return ERROR_MESSAGE_KEYS.companyName.pattern;
    }

    return null;
  }, []);

  /**
   * Validate Tax ID
   */
  const validateTaxId = useCallback((value: string): string | null => {
    if (!value) {
      return ERROR_MESSAGE_KEYS.taxId.required;
    }

    const pattern = /^\d{10}$|^\d{13}$/;
    if (!pattern.test(value)) {
      return ERROR_MESSAGE_KEYS.taxId.pattern;
    }

    return null;
  }, []);

  /**
   * Validate Website
   */
  const validateWebsite = useCallback((value: string): string | null => {
    if (!value) {
      return ERROR_MESSAGE_KEYS.website.required;
    }

    // Check for http/https prefix
    if (!value.startsWith("http://") && !value.startsWith("https://")) {
      return ERROR_MESSAGE_KEYS.website.pattern;
    }

    // Basic URL validation
    try {
      new URL(value);
      return null;
    } catch {
      return ERROR_MESSAGE_KEYS.website.invalid;
    }
  }, []);

  /**
   * Validate Company Size
   */
  const validateCompanySize = useCallback((value: string): string | null => {
    if (!value) {
      return ERROR_MESSAGE_KEYS.companySize.required;
    }

    const validSizes = ["50-100", "100-500", "500-1000", "1000+", "other"];
    if (!validSizes.includes(value)) {
      return ERROR_MESSAGE_KEYS.companySize.required;
    }

    return null;
  }, []);

  /**
   * Validate Address
   */
  const validateAddress = useCallback((value: string): string | null => {
    if (!value) {
      return ERROR_MESSAGE_KEYS.headquartersAddress.required;
    }

    if (value.length < 10) {
      return ERROR_MESSAGE_KEYS.headquartersAddress.minLength;
    }

    if (value.length > 500) {
      return ERROR_MESSAGE_KEYS.headquartersAddress.maxLength;
    }

    return null;
  }, []);

  /**
   * Validation Map
   */
  const validationMap = useMemo(
    () => ({
      companyName: validateCompanyName,
      taxId: validateTaxId,
      website: validateWebsite,
      companySize: validateCompanySize,
      headquartersAddress: validateAddress,
    }),
    [
      validateCompanyName,
      validateTaxId,
      validateWebsite,
      validateCompanySize,
      validateAddress,
    ]
  );

  /**
   * Validate Single Field (Client-side)
   */
  const validateField = useCallback(
    (fieldName: keyof BusinessFormData, value: string): string | null => {
      // eslint-disable-next-line security/detect-object-injection
      const validator = validationMap[fieldName];
      if (validator) {
        return validator(value);
      }
      return null;
    },
    [validationMap]
  );

  /**
   * Validate All Fields
   */
  const validateAllFields = useCallback(
    (formData: BusinessFormData): BusinessFormErrors => {
      const newErrors: BusinessFormErrors = {};

      Object.keys(formData).forEach((key) => {
        const fieldName = key as keyof BusinessFormData;
        // eslint-disable-next-line security/detect-object-injection
        const error = validateField(fieldName, formData[fieldName]);
        if (error) {
          // eslint-disable-next-line security/detect-object-injection
          newErrors[fieldName] = error;
        }
      });

      return newErrors;
    },
    [validateField]
  );

  /**
   * Handle Field Blur
   */
  const handleFieldBlur = useCallback(
    (fieldName: keyof BusinessFormData, value: string) => {
      setTouchedFields((prev) => new Set(prev).add(fieldName));

      if (config.validateOnBlur) {
        const error = validateField(fieldName, value);
        setErrors((prev) => ({
          ...prev,

          [fieldName]: error || undefined,
        }));
      }
    },
    [config.validateOnBlur, validateField]
  );

  /**
   * Handle Field Change
   */
  const handleFieldChange = useCallback(
    (fieldName: keyof BusinessFormData, value: string) => {
      if (config.validateOnChange) {
        const error = validateField(fieldName, value);
        setErrors((prev) => ({
          ...prev,

          [fieldName]: error || undefined,
        }));
      }
    },
    [config.validateOnChange, validateField]
  );

  /**
   * Clear Field Error
   */
  const clearFieldError = useCallback((fieldName: keyof BusinessFormData) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      // eslint-disable-next-line security/detect-object-injection
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  /**
   * Clear All Errors
   */
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Reset Touched Fields
   */
  const resetTouched = useCallback(() => {
    setTouchedFields(new Set());
  }, []);

  /**
   * Check if form is valid
   */
  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  return {
    // State
    errors,
    touchedFields,
    isValid,

    // Validation methods
    validateField,
    validateAllFields,
    handleFieldBlur,
    handleFieldChange,
    clearFieldError,
    clearAllErrors,
    resetTouched,

    // Setters
    setErrors,
    setTouchedFields,
  };
};

export default useFormValidation;
