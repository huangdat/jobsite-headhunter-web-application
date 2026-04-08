/**
 * useMultiStepForm Hook
 * Reusable hook for managing multi-step form navigation and validation
 *
 * @example
 * ```tsx
 * const { currentStep, goNext, goPrevious, isFirstStep, isLastStep } = useMultiStepForm({
 *   totalSteps: 3,
 *   validateStep: async (step) => {
 *     const isValid = await trigger(getFieldsForStep(step));
 *     return isValid;
 *   },
 *   onStepChange: (step) => console.log(`Moving to step ${step}`)
 * });
 * ```
 */

import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface UseMultiStepFormOptions {
  /** Total number of steps in the form */
  totalSteps: number;

  /** Initial step (default: 1) */
  initialStep?: number;

  /** Validation function for a specific step. Return true if valid. */
  validateStep?: (step: number) => Promise<boolean> | boolean;

  /** Callback fired when step changes */
  onStepChange?: (newStep: number, previousStep: number) => void;

  /** Error message when validation fails */
  validationErrorMessage?: string;

  /** Whether to show toast on validation error (default: true) */
  showValidationError?: boolean;
}

export interface UseMultiStepFormReturn {
  /** Current step number (1-indexed) */
  currentStep: number;

  /** Move to next step (with validation) */
  goNext: () => Promise<boolean>;

  /** Move to previous step */
  goPrevious: () => void;

  /** Jump to specific step */
  goToStep: (step: number) => void;

  /** Check if current step is first step */
  isFirstStep: boolean;

  /** Check if current step is last step */
  isLastStep: boolean;

  /** Reset to initial step */
  reset: () => void;

  /** Progress percentage (0-100) */
  progress: number;
}

export function useMultiStepForm({
  totalSteps,
  initialStep = 1,
  validateStep,
  onStepChange,
  validationErrorMessage = "Please fix validation errors before proceeding",
  showValidationError = true,
}: UseMultiStepFormOptions): UseMultiStepFormReturn {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const goNext = useCallback(async (): Promise<boolean> => {
    // Don't go past last step
    if (currentStep >= totalSteps) {
      return false;
    }

    // Validate current step if validator provided
    if (validateStep) {
      const isValid = await validateStep(currentStep);

      if (!isValid) {
        if (showValidationError) {
          toast.error(validationErrorMessage);
        }
        return false;
      }
    }

    // Move to next step
    const nextStep = currentStep + 1;
    onStepChange?.(nextStep, currentStep);
    setCurrentStep(nextStep);
    return true;
  }, [
    currentStep,
    totalSteps,
    validateStep,
    onStepChange,
    validationErrorMessage,
    showValidationError,
  ]);

  const goPrevious = useCallback(() => {
    // Don't go before first step
    if (currentStep <= 1) {
      return;
    }

    const previousStep = currentStep - 1;
    onStepChange?.(previousStep, currentStep);
    setCurrentStep(previousStep);
  }, [currentStep, onStepChange]);

  const goToStep = useCallback(
    (step: number) => {
      // Clamp step between 1 and totalSteps
      const clampedStep = Math.max(1, Math.min(step, totalSteps));

      if (clampedStep !== currentStep) {
        onStepChange?.(clampedStep, currentStep);
        setCurrentStep(clampedStep);
      }
    },
    [currentStep, totalSteps, onStepChange]
  );

  const reset = useCallback(() => {
    if (currentStep !== initialStep) {
      setCurrentStep(initialStep);
      onStepChange?.(initialStep, currentStep);
    }
  }, [initialStep, currentStep, onStepChange]);

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return {
    currentStep,
    goNext,
    goPrevious,
    goToStep,
    isFirstStep,
    isLastStep,
    reset,
    progress,
  };
}
