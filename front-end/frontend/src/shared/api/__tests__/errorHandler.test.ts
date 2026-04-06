/**
 * Tests for API Error Handler utility
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  normalizeApiError,
  getErrorMessage,
  isRetryableError,
  ApiError,
} from "../errorHandler";
import type { ApiErrorDetails } from "../errorHandler";
import type { AxiosError } from "axios";

describe("errorHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("normalizeApiError", () => {
    describe("when server responds with error", () => {
      it("should normalize 500 server error", () => {
        const axiosError = {
          response: {
            status: 500,
            data: { message: "Internal Server Error" },
          },
          message: "Error",
          code: "ERROR_500",
        } as unknown as AxiosError;

        const result = normalizeApiError(axiosError);

        expect(result.isServerError).toBe(true);
        expect(result.isClientError).toBe(false);
        expect(result.status).toBe(500);
        expect(result.isNetworkError).toBe(false);
      });

      it("should normalize 404 client error", () => {
        const axiosError = {
          response: {
            status: 404,
            data: { message: "Not Found" },
          },
          message: "Error",
        } as unknown as AxiosError;

        const result = normalizeApiError(axiosError);

        expect(result.isClientError).toBe(true);
        expect(result.isServerError).toBe(false);
        expect(result.status).toBe(404);
      });

      it("should normalize 401 unauthorized error", () => {
        const axiosError = {
          response: {
            status: 401,
            data: { message: "Unauthorized" },
          },
          message: "Error",
        } as unknown as AxiosError;

        const result = normalizeApiError(axiosError);

        expect(result.isClientError).toBe(true);
        expect(result.status).toBe(401);
        expect(result.message).toBe("Unauthorized");
      });

      it("should extract error message from response data", () => {
        const axiosError = {
          response: {
            status: 400,
            data: { message: "Validation failed" },
          },
          message: "Bad Request",
        } as unknown as AxiosError;

        const result = normalizeApiError(axiosError);

        expect(result.message).toBe("Validation failed");
      });

      it("should use error message when response data missing", () => {
        const axiosError = {
          response: {
            status: 400,
            data: {},
          },
          message: "Bad Request",
        } as unknown as AxiosError;

        const result = normalizeApiError(axiosError);

        expect(result.message).toBe("Bad Request");
      });

      it("should detect timeout error", () => {
        const axiosError = {
          response: {
            status: 500,
            data: { message: "Timeout" },
          },
          code: "ECONNABORTED",
          message: "Timeout",
        } as unknown as AxiosError;

        const result = normalizeApiError(axiosError);

        expect(result.isTimeoutError).toBe(true);
        expect(result.code).toBe("ECONNABORTED");
      });
    });

    describe("when no response received", () => {
      it("should detect network error", () => {
        const axiosError = {
          request: {},
          message: "Network Error",
        } as unknown as AxiosError;

        const result = normalizeApiError(axiosError);

        expect(result.isNetworkError).toBe(true);
        expect(result.isAxiosError).toBe(true);
      });

      it("should detect timeout in network error", () => {
        const axiosError = {
          request: {},
          code: "ECONNABORTED",
          message: "Timeout",
        } as unknown as AxiosError;

        const result = normalizeApiError(axiosError);

        expect(result.isNetworkError).toBe(true);
        expect(result.isTimeoutError).toBe(true);
      });
    });

    describe("when error is not AxiosError", () => {
      it("should normalize regular Error object", () => {
        const error = new Error("Something went wrong");

        const result = normalizeApiError(error);

        expect(result.message).toBe("Something went wrong");
        expect(result.isAxiosError).toBe(false);
        expect(result.isNetworkError).toBe(false);
      });

      it("should handle unknown error type", () => {
        const result = normalizeApiError("Some string error");

        expect(result.message).toBe("Unknown error");
        expect(result.isAxiosError).toBe(false);
      });
    });

    it("should mark as AxiosError correctly", () => {
      const axiosError = {
        response: {
          status: 400,
          data: { message: "Error" },
        },
        message: "Error",
      } as unknown as AxiosError;

      const result = normalizeApiError(axiosError);

      expect(result.isAxiosError).toBe(true);
    });
  });

  describe("getErrorMessage", () => {
    it("should return network error message for network errors", () => {
      const axiosError = {
        request: {},
        message: "Network Error",
      } as unknown as AxiosError;

      const message = getErrorMessage(axiosError);

      expect(message).toContain("Network connection error");
    });

    it("should return timeout message for timeout errors", () => {
      const axiosError = {
        request: {},
        code: "ECONNABORTED",
        message: "Timeout",
      } as unknown as AxiosError;

      const message = getErrorMessage(axiosError);

      expect(message).toContain("Request timeout");
    });

    it("should return server error message for 5xx errors", () => {
      const axiosError = {
        response: {
          status: 500,
          data: { message: "Internal error" },
        },
        message: "Error",
      } as unknown as AxiosError;

      const message = getErrorMessage(axiosError);

      expect(message).toContain("Server error");
    });

    it("should return client error message for 4xx errors", () => {
      const axiosError = {
        response: {
          status: 400,
          data: { message: "Bad request" },
        },
        message: "Error",
      } as unknown as AxiosError;

      const message = getErrorMessage(axiosError);

      expect(message).toBe("Bad request");
    });

    it("should use default message when no message available", () => {
      const error = new Error();
      (error as any).response = undefined;
      (error as any).request = undefined;

      const message = getErrorMessage(error, "Custom default");

      expect(message).toBe("Custom default");
    });
  });

  describe("isRetryableError", () => {
    it("should return true for network errors", () => {
      const axiosError = {
        request: {},
        message: "Network Error",
      } as unknown as AxiosError;

      expect(isRetryableError(axiosError)).toBe(true);
    });

    it("should return true for timeout errors", () => {
      const axiosError = {
        request: {},
        code: "ECONNABORTED",
        message: "Timeout",
      } as unknown as AxiosError;

      expect(isRetryableError(axiosError)).toBe(true);
    });

    it("should return true for 5xx server errors", () => {
      const axiosError = {
        response: {
          status: 500,
          data: { message: "Server error" },
        },
        message: "Error",
      } as unknown as AxiosError;

      expect(isRetryableError(axiosError)).toBe(true);
    });

    it("should return false for 501 Not Implemented", () => {
      const axiosError = {
        response: {
          status: 501,
          data: { message: "Not Implemented" },
        },
        message: "Error",
      } as unknown as AxiosError;

      expect(isRetryableError(axiosError)).toBe(false);
    });

    it("should return false for client errors", () => {
      const axiosError = {
        response: {
          status: 400,
          data: { message: "Bad request" },
        },
        message: "Error",
      } as unknown as AxiosError;

      expect(isRetryableError(axiosError)).toBe(false);
    });

    it("should return false for 404 Not Found", () => {
      const axiosError = {
        response: {
          status: 404,
          data: { message: "Not found" },
        },
        message: "Error",
      } as unknown as AxiosError;

      expect(isRetryableError(axiosError)).toBe(false);
    });
  });

  describe("ApiError class", () => {
    it("should create ApiError with all properties", () => {
      const errorDetails: ApiErrorDetails = {
        message: "Test error",
        code: "TEST_001",
        status: 400,
        data: { field: "value" },
        isNetworkError: false,
        isTimeoutError: false,
        isServerError: false,
        isClientError: true,
        isAxiosError: true,
      };

      const error = new ApiError(errorDetails);

      expect(error.message).toBe("Test error");
      expect(error.code).toBe("TEST_001");
      expect(error.status).toBe(400);
      expect(error.isClientError).toBe(true);
      expect(error instanceof Error).toBe(true);
    });

    it("should handle missing optional properties", () => {
      const errorDetails: ApiErrorDetails = {
        message: "Simple error",
        isNetworkError: true,
        isTimeoutError: false,
        isServerError: false,
        isClientError: false,
        isAxiosError: false,
      };

      const error = new ApiError(errorDetails);

      expect(error.message).toBe("Simple error");
      expect(error.code).toBeUndefined();
      expect(error.status).toBeUndefined();
      expect(error.data).toBeUndefined();
    });
  });
});
