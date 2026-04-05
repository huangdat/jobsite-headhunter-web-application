/**
 * Tests for useAuthUser hook
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAuthUser } from "../useAuthUser";
import { useAuthStore } from "@/shared/store/authStore";

// Mock the auth store
vi.mock("@/shared/store/authStore");

describe("useAuthUser", () => {
  const mockUser = {
    id: "user123",
    username: "testuser",
    role: "ADMIN",
    email: "test@example.com",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("user data", () => {
    it("should return user data from store", () => {
      vi.mocked(useAuthStore).mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        hasRole: vi.fn(),
        logout: vi.fn(),
      } as any);

      const { result } = renderHook(() => useAuthUser());

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.userId).toBe("user123");
      expect(result.current.username).toBe("testuser");
      expect(result.current.role).toBe("ADMIN");
    });

    it("should return null for user fields when user is not set", () => {
      vi.mocked(useAuthStore).mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        hasRole: vi.fn(),
        logout: vi.fn(),
      } as any);

      const { result } = renderHook(() => useAuthUser());

      expect(result.current.user).toBeNull();
      expect(result.current.userId).toBeNull();
      expect(result.current.username).toBeNull();
      expect(result.current.role).toBeNull();
    });
  });

  describe("auth state", () => {
    it("should return authentication state", () => {
      vi.mocked(useAuthStore).mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        hasRole: vi.fn(),
        logout: vi.fn(),
      } as any);

      const { result } = renderHook(() => useAuthUser());

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    it("should reflect loading state", () => {
      vi.mocked(useAuthStore).mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        hasRole: vi.fn(),
        logout: vi.fn(),
      } as any);

      const { result } = renderHook(() => useAuthUser());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe("role checking utilities", () => {
    beforeEach(() => {
      const hasRoleMock = vi.fn((role: string) => role === mockUser.role);
      vi.mocked(useAuthStore).mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        hasRole: hasRoleMock,
        logout: vi.fn(),
      } as any);
    });

    it("should check arbitrary roles with hasRole", () => {
      const { result } = renderHook(() => useAuthUser());

      expect(result.current.hasRole("ADMIN")).toBe(true);
      expect(result.current.hasRole("USER")).toBe(false);
    });

    it("should identify admin users", () => {
      const { result } = renderHook(() => useAuthUser());

      expect(result.current.isAdmin()).toBe(true);
    });

    it("should identify headhunter users", () => {
      const headhunterUser = { ...mockUser, role: "HEADHUNTER" };
      const hasRoleMock = vi.fn((role: string) => role === headhunterUser.role);

      vi.mocked(useAuthStore).mockReturnValue({
        user: headhunterUser,
        isAuthenticated: true,
        isLoading: false,
        hasRole: hasRoleMock,
        logout: vi.fn(),
      } as any);

      const { result } = renderHook(() => useAuthUser());

      expect(result.current.isHeadhunter()).toBe(true);
    });

    it("should identify candidate users", () => {
      const candidateUser = { ...mockUser, role: "CANDIDATE" };
      const hasRoleMock = vi.fn((role: string) => role === candidateUser.role);

      vi.mocked(useAuthStore).mockReturnValue({
        user: candidateUser,
        isAuthenticated: true,
        isLoading: false,
        hasRole: hasRoleMock,
        logout: vi.fn(),
      } as any);

      const { result } = renderHook(() => useAuthUser());

      expect(result.current.isCandidate()).toBe(true);
    });

    it("should identify collaborator users", () => {
      const collaboratorUser = { ...mockUser, role: "COLLABORATOR" };
      const hasRoleMock = vi.fn(
        (role: string) => role === collaboratorUser.role
      );

      vi.mocked(useAuthStore).mockReturnValue({
        user: collaboratorUser,
        isAuthenticated: true,
        isLoading: false,
        hasRole: hasRoleMock,
        logout: vi.fn(),
      } as any);

      const { result } = renderHook(() => useAuthUser());

      expect(result.current.isCollaborator()).toBe(true);
    });
  });

  describe("actions", () => {
    it("should call logout when logout is called", () => {
      const logoutMock = vi.fn();
      vi.mocked(useAuthStore).mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        hasRole: vi.fn(),
        logout: logoutMock,
      } as any);

      const { result } = renderHook(() => useAuthUser());

      act(() => {
        result.current.logout();
      });

      expect(logoutMock).toHaveBeenCalled();
    });
  });
});
