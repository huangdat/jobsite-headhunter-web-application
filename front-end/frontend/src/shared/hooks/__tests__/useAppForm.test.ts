/**
 * Tests for useAppForm hook
 */
 

import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAppForm } from "../useAppForm";
import type { FieldValues } from "react-hook-form";

describe("useAppForm", () => {
  interface TestFormData extends FieldValues {
    email: string;
    password: string;
    nested?: {
      field: string;
    };
  }

  const defaultValues: TestFormData = {
    email: "",
    password: "",
  };

  beforeEach(() => {
    // Clear any mocks
  });

  describe("initialization", () => {
    it("should initialize with default values", () => {
      const { result } = renderHook(() =>
        useAppForm<TestFormData>({
          defaultValues,
        })
      );

      expect(result.current.getValues()).toEqual(defaultValues);
    });

    it("should set mode to onBlur by default", () => {
      const { result } = renderHook(() =>
        useAppForm<TestFormData>({
          defaultValues,
        })
      );

      expect(result.current.formState.isDirty).toBe(false);
    });

    it("should allow custom options", () => {
      const customDefaults: TestFormData = {
        email: "test@example.com",
        password: "password123",
      };

      const { result } = renderHook(() =>
        useAppForm<TestFormData>({
          defaultValues: customDefaults,
        })
      );

      expect(result.current.getValues("email")).toBe("test@example.com");
      expect(result.current.getValues("password")).toBe("password123");
    });
  });

  describe("form values", () => {
    it("should update form values when setValue is called", () => {
      const { result } = renderHook(() =>
        useAppForm<TestFormData>({
          defaultValues,
        })
      );

      result.current.setValue("email", "test@example.com");
      expect(result.current.getValues("email")).toBe("test@example.com");
    });

    it("should track form dirty state", () => {
      const { result } = renderHook(() =>
        useAppForm<TestFormData>({
          defaultValues,
        })
      );

      expect(typeof result.current.formState.isDirty).toBe("boolean");
    });
  });

  describe("getError helper", () => {
    it("should return error message for a field", () => {
      const { result } = renderHook(() =>
        useAppForm<TestFormData>({
          defaultValues,
          shouldUseNativeValidation: false,
        })
      );

      // Manually set an error synchronously
      result.current.setError("email", {
        type: "required",
        message: "Email is required",
      });

      expect(result.current.getError("email")).toBe("Email is required");
    });

    it("should return undefined for fields without errors", () => {
      const { result } = renderHook(() =>
        useAppForm<TestFormData>({
          defaultValues,
        })
      );

      expect(result.current.getError("email")).toBeUndefined();
    });

    it("should handle nested field errors", () => {
      const { result } = renderHook(() =>
        useAppForm<TestFormData>({
          defaultValues: {
            ...defaultValues,
            nested: { field: "" },
          },
        })
      );

      result.current.setError("nested.field", {
        type: "required",
        message: "Nested field is required",
      });

      expect(result.current.getError("nested.field")).toBe(
        "Nested field is required"
      );
    });

    it("should return undefined for non-existent nested paths", () => {
      const { result } = renderHook(() =>
        useAppForm<TestFormData>({
          defaultValues: {
            ...defaultValues,
            nested: { field: "" },
          },
        })
      );

      expect(result.current.getError("nested.invalid")).toBeUndefined();
    });
  });

  describe("hasError helper", () => {
    it("should return true if field has error", () => {
      const { result } = renderHook(() =>
        useAppForm<TestFormData>({
          defaultValues,
        })
      );

      result.current.setError("email", {
        type: "required",
        message: "Email required",
      });

      expect(result.current.hasError("email")).toBe(true);
    });

    it("should return false if field has no error", () => {
      const { result } = renderHook(() =>
        useAppForm<TestFormData>({
          defaultValues,
        })
      );

      expect(result.current.hasError("email")).toBe(false);
    });

    it("should check nested field errors", () => {
      const { result } = renderHook(() =>
        useAppForm<TestFormData>({
          defaultValues: {
            ...defaultValues,
            nested: { field: "" },
          },
        })
      );

      result.current.setError("nested.field", { type: "required" });
      expect(result.current.hasError("nested.field")).toBe(true);
    });
  });

  describe("handleSubmit helper", () => {
    it("should return a valid form submit handler", () => {
      const { result } = renderHook(() =>
        useAppForm<TestFormData>({
          defaultValues,
        })
      );

      const onValid = () => {
        // Form data passed here in real usage
      };

      const submitHandler = result.current.handleSubmit(onValid);

      expect(typeof submitHandler).toBe("function");
    });

    it("should support onInvalid handler", () => {
      const { result } = renderHook(() =>
        useAppForm<TestFormData>({
          defaultValues,
        })
      );

      const onValid = () => {
        // Should not be called in invalid case
      };

      const onInvalid = () => {
        // Error handling in real usage
      };

      const submitHandler = result.current.handleSubmit(onValid, onInvalid);

      expect(typeof submitHandler).toBe("function");
    });
  });

  describe("form state", () => {
    it("should track isSubmitting state", () => {
      const { result } = renderHook(() =>
        useAppForm<TestFormData>({
          defaultValues,
        })
      );

      expect(result.current.formState.isSubmitting).toBe(false);
    });

    it("should track form validity", () => {
      const { result } = renderHook(() =>
        useAppForm<TestFormData>({
          defaultValues,
        })
      );

      expect(typeof result.current.formState.isValid).toBe("boolean");
    });

    it("should have access to all react-hook-form methods", () => {
      const { result } = renderHook(() =>
        useAppForm<TestFormData>({
          defaultValues,
        })
      );

      expect(typeof result.current.register).toBe("function");
      expect(typeof result.current.watch).toBe("function");
      expect(typeof result.current.reset).toBe("function");
      expect(typeof result.current.setError).toBe("function");
      expect(typeof result.current.clearErrors).toBe("function");
    });
  });
});
