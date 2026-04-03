/**
 * Tests for useMultiStepForm hook
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMultiStepForm } from "../useMultiStepForm";
import type { UseMultiStepFormOptions } from "../useMultiStepForm";

describe("useMultiStepForm", () => {
  const defaultOptions: UseMultiStepFormOptions = {
    totalSteps: 3,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initialization", () => {
    it("should start at step 1 by default", () => {
      const { result } = renderHook(() => useMultiStepForm(defaultOptions));

      expect(result.current.currentStep).toBe(1);
      expect(result.current.isFirstStep).toBe(true);
      expect(result.current.isLastStep).toBe(false);
      expect(result.current.progress).toBe(0);
    });

    it("should start at custom initial step", () => {
      const { result } = renderHook(() =>
        useMultiStepForm({ ...defaultOptions, initialStep: 2 })
      );

      expect(result.current.currentStep).toBe(2);
      expect(result.current.isFirstStep).toBe(false);
      expect(result.current.isLastStep).toBe(false);
    });
  });

  describe("navigation", () => {
    it("should move to next step", async () => {
      const { result } = renderHook(() => useMultiStepForm(defaultOptions));

      await act(async () => {
        const success = await result.current.goNext();
        expect(success).toBe(true);
      });

      expect(result.current.currentStep).toBe(2);
    });

    it("should move to previous step", () => {
      const { result } = renderHook(() =>
        useMultiStepForm({ ...defaultOptions, initialStep: 2 })
      );

      act(() => {
        result.current.goPrevious();
      });

      expect(result.current.currentStep).toBe(1);
    });

    it("should not go past last step", async () => {
      const { result } = renderHook(() =>
        useMultiStepForm({ ...defaultOptions, initialStep: 3 })
      );

      await act(async () => {
        const success = await result.current.goNext();
        expect(success).toBe(false);
      });

      expect(result.current.currentStep).toBe(3);
    });

    it("should not go before first step", () => {
      const { result } = renderHook(() => useMultiStepForm(defaultOptions));

      act(() => {
        result.current.goPrevious();
      });

      expect(result.current.currentStep).toBe(1);
    });

    it("should jump to specific step", () => {
      const { result } = renderHook(() => useMultiStepForm(defaultOptions));

      act(() => {
        result.current.goToStep(3);
      });

      expect(result.current.currentStep).toBe(3);
    });
  });

  describe("validation", () => {
    it("should validate before moving to next step", async () => {
      const validateStep = vi.fn().mockResolvedValue(false);
      const { result } = renderHook(() =>
        useMultiStepForm({ ...defaultOptions, validateStep })
      );

      await act(async () => {
        const success = await result.current.goNext();
        expect(success).toBe(false);
      });

      expect(validateStep).toHaveBeenCalledWith(1);
      expect(result.current.currentStep).toBe(1);
    });

    it("should move to next step when validation passes", async () => {
      const validateStep = vi.fn().mockResolvedValue(true);
      const { result } = renderHook(() =>
        useMultiStepForm({ ...defaultOptions, validateStep })
      );

      await act(async () => {
        const success = await result.current.goNext();
        expect(success).toBe(true);
      });

      expect(result.current.currentStep).toBe(2);
    });
  });

  describe("callbacks", () => {
    it("should call onStepChange when step changes", async () => {
      const onStepChange = vi.fn();
      const { result } = renderHook(() =>
        useMultiStepForm({ ...defaultOptions, onStepChange })
      );

      await act(async () => {
        await result.current.goNext();
      });

      expect(onStepChange).toHaveBeenCalledWith(2, 1);
    });
  });

  describe("reset", () => {
    it("should reset to initial step", () => {
      const { result } = renderHook(() =>
        useMultiStepForm({ ...defaultOptions, initialStep: 1 })
      );

      act(() => {
        result.current.goToStep(3);
      });

      expect(result.current.currentStep).toBe(3);

      act(() => {
        result.current.reset();
      });

      expect(result.current.currentStep).toBe(1);
    });
  });

  describe("progress calculation", () => {
    it("should calculate progress correctly", () => {
      const { result } = renderHook(() => useMultiStepForm(defaultOptions));

      expect(result.current.progress).toBe(0); // Step 1/3

      act(() => {
        result.current.goToStep(2);
      });

      expect(result.current.progress).toBe(50); // Step 2/3

      act(() => {
        result.current.goToStep(3);
      });

      expect(result.current.progress).toBe(100); // Step 3/3
    });
  });

  describe("boolean flags", () => {
    it("should correctly identify first and last steps", () => {
      const { result } = renderHook(() => useMultiStepForm(defaultOptions));

      // At first step
      expect(result.current.isFirstStep).toBe(true);
      expect(result.current.isLastStep).toBe(false);

      // At middle step
      act(() => {
        result.current.goToStep(2);
      });
      expect(result.current.isFirstStep).toBe(false);
      expect(result.current.isLastStep).toBe(false);

      // At last step
      act(() => {
        result.current.goToStep(3);
      });
      expect(result.current.isFirstStep).toBe(false);
      expect(result.current.isLastStep).toBe(true);
    });
  });
});
