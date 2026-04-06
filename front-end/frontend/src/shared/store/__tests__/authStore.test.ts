/**
 * Auth Store Tests
 * Tests for centralized authentication state management
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuthStore } from "../authStore";
import { validateToken } from "@/features/auth/services/authApi";

// Mock API calls
vi.mock("@/features/auth/services/authApi", () => ({
  validateToken: vi.fn(),
  logout: vi.fn(),
}));

describe("useAuthStore", () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });

    // Clear mocks
    vi.clearAllMocks();
  });

  describe("setAuth", () => {
    it("should set user and token correctly", () => {
      const mockUser = {
        id: "123",
        username: "testuser",
        role: "CANDIDATE",
        status: "ACTIVE",
      };
      const mockToken = "test-token-123";

      useAuthStore.getState().setAuth(mockUser, mockToken);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe(mockToken);
      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe("clearAuth", () => {
    it("should clear user and token", () => {
      // First set auth
      useAuthStore.getState().setAuth(
        {
          id: "123",
          username: "testuser",
          role: "CANDIDATE",
          status: "ACTIVE",
        },
        "test-token"
      );

      // Then clear
      useAuthStore.getState().clearAuth();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe("checkAuth", () => {
    it("should return false when no token exists", async () => {
      const result = await useAuthStore.getState().checkAuth();

      expect(result).toBe(false);
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it("should validate token and set user when token is valid", async () => {
      // Setup: Set token first
      useAuthStore.setState({ token: "valid-token" });

      // Mock successful validation
      vi.mocked(validateToken).mockResolvedValue({
        valid: true,
        id: "123",
        username: "testuser",
        role: "CANDIDATE",
        status: "ACTIVE",
      });

      const result = await useAuthStore.getState().checkAuth();

      expect(result).toBe(true);
      expect(validateToken).toHaveBeenCalledWith({ token: "valid-token" });

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual({
        id: "123",
        username: "testuser",
        role: "CANDIDATE",
        status: "ACTIVE",
      });
    });

    it("should clear auth when token is invalid", async () => {
      useAuthStore.setState({ token: "invalid-token" });

      vi.mocked(validateToken).mockResolvedValue({
        valid: false,
        id: "0",
        username: "",
        role: "CANDIDATE",
        status: "ACTIVE",
      });

      const result = await useAuthStore.getState().checkAuth();

      expect(result).toBe(false);
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().user).toBeNull();
    });

    it("should handle API errors gracefully", async () => {
      useAuthStore.setState({ token: "test-token" });

      vi.mocked(validateToken).mockRejectedValue(new Error("Network error"));

      const result = await useAuthStore.getState().checkAuth();

      expect(result).toBe(false);
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe("hasRole", () => {
    it("should return true when user has the specified role", () => {
      useAuthStore.setState({
        user: {
          id: "123",
          username: "testuser",
          role: "ADMIN",
          status: "ACTIVE",
        },
        isAuthenticated: true,
        token: "token",
      });

      const result = useAuthStore.getState().hasRole("ADMIN");
      expect(result).toBe(true);
    });

    it("should return false when user has different role", () => {
      useAuthStore.setState({
        user: {
          id: "123",
          username: "testuser",
          role: "CANDIDATE",
          status: "ACTIVE",
        },
        isAuthenticated: true,
        token: "token",
      });

      const result = useAuthStore.getState().hasRole("ADMIN");
      expect(result).toBe(false);
    });

    it("should return false when not authenticated", () => {
      const result = useAuthStore.getState().hasRole("ADMIN");
      expect(result).toBe(false);
    });
  });
});
