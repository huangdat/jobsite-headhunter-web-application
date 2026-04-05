/**
 * Tests for useJobsQueries hooks
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import {
  useSkillsQuery,
  useJobsQuery,
  useMyJobsQuery,
  useJobDetailQuery,
  useSavedJobsQuery,
} from "../useJobsQueries";
import * as jobsApi from "@/features/jobs/services/jobsApi";
import type { JobListResponse, SkillOption } from "@/features/jobs/types";

// Mock the API module
vi.mock("@/features/jobs/services/jobsApi");

// Create test wrapper with React Query provider
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import React from "react";

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}

function Wrapper({ children }: { children: ReactNode }) {
  const testQueryClient = createTestQueryClient();
  return React.createElement(
    QueryClientProvider,
    { client: testQueryClient },
    children
  );
}

describe("useJobsQueries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useSkillsQuery", () => {
    it("should fetch skills successfully", async () => {
      const mockSkills: SkillOption[] = [
        { id: 1, name: "JavaScript" },
        { id: 2, name: "React" },
        { id: 3, name: "TypeScript" },
      ];
      vi.mocked(jobsApi.fetchSkills).mockResolvedValue(mockSkills);

      const { result } = renderHook(() => useSkillsQuery(), {
        wrapper: Wrapper,
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSkills);
    });

    it("should handle skill fetch error", async () => {
      const error = new Error("Failed to fetch skills");
      vi.mocked(jobsApi.fetchSkills).mockRejectedValue(error);

      const { result } = renderHook(() => useSkillsQuery(), {
        wrapper: Wrapper,
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });

    it("should not retry on error", async () => {
      const error = new Error("API Error");
      vi.mocked(jobsApi.fetchSkills).mockRejectedValue(error);

      const { result } = renderHook(() => useSkillsQuery(), {
        wrapper: Wrapper,
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      // Should only be called once (no retry)
      expect(jobsApi.fetchSkills).toHaveBeenCalledTimes(1);
    });
  });

  describe("useJobsQuery", () => {
    const mockJobs: JobListResponse = {
      page: 1,
      size: 5,
      totalElements: 5,
      totalPages: 1,
      data: [
        {
          id: 0,
          jobCode: "JOB001",
          title: "Job 0",
          quantity: 1,
          workingType: "REMOTE",
          salaryMin: 5000,
          salaryMax: 8000,
          currency: "USD",
          description: "Test",
          deadline: null,
          status: "OPEN",
          city: "HCM",
          createdAt: "2026-01-01",
        } as any,
        {
          id: 1,
          jobCode: "JOB002",
          title: "Job 1",
          quantity: 1,
          workingType: "REMOTE",
          salaryMin: 5000,
          salaryMax: 8000,
          currency: "USD",
          description: "Test",
          deadline: null,
          status: "OPEN",
          city: "HCM",
          createdAt: "2026-01-01",
        } as any,
        {
          id: 2,
          jobCode: "JOB003",
          title: "Job 2",
          quantity: 1,
          workingType: "REMOTE",
          salaryMin: 5000,
          salaryMax: 8000,
          currency: "USD",
          description: "Test",
          deadline: null,
          status: "OPEN",
          city: "HCM",
          createdAt: "2026-01-01",
        } as any,
        {
          id: 3,
          jobCode: "JOB004",
          title: "Job 3",
          quantity: 1,
          workingType: "REMOTE",
          salaryMin: 5000,
          salaryMax: 8000,
          currency: "USD",
          description: "Test",
          deadline: null,
          status: "OPEN",
          city: "HCM",
          createdAt: "2026-01-01",
        } as any,
        {
          id: 4,
          jobCode: "JOB005",
          title: "Job 4",
          quantity: 1,
          workingType: "REMOTE",
          salaryMin: 5000,
          salaryMax: 8000,
          currency: "USD",
          description: "Test",
          deadline: null,
          status: "OPEN",
          city: "HCM",
          createdAt: "2026-01-01",
        } as any,
      ],
    };

    it("should fetch jobs with filters", async () => {
      vi.mocked(jobsApi.getJobs).mockResolvedValue(mockJobs);

      const params = { page: 1, search: "React" };
      const { result } = renderHook(() => useJobsQuery(params), {
        wrapper: Wrapper,
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockJobs);
      expect(jobsApi.getJobs).toHaveBeenCalledWith(params);
    });

    it("should handle jobs fetch error", async () => {
      const error = new Error("Failed to fetch jobs");
      vi.mocked(jobsApi.getJobs).mockRejectedValue(error);

      const params = { page: 1 };
      const { result } = renderHook(() => useJobsQuery(params), {
        wrapper: Wrapper,
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });

    it("should refetch when params change", async () => {
      vi.mocked(jobsApi.getJobs).mockResolvedValue(mockJobs);

      const { result, rerender } = renderHook(
        (props) => useJobsQuery(props.params),
        {
          wrapper: Wrapper,
          initialProps: { params: { page: 1 } },
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(jobsApi.getJobs).toHaveBeenCalledTimes(1);

      // Change params to trigger refetch
      rerender({ params: { page: 2 } });

      expect(jobsApi.getJobs).toHaveBeenCalledWith({ page: 2 });
    });
  });

  describe("useMyJobsQuery", () => {
    const mockMyJobs: JobListResponse = {
      page: 1,
      size: 3,
      totalElements: 3,
      totalPages: 1,
      data: [
        {
          id: 0,
          jobCode: "JOB001",
          title: "My Job 0",
          quantity: 1,
          workingType: "REMOTE",
          salaryMin: 5000,
          salaryMax: 8000,
          currency: "USD",
          description: "Test",
          deadline: null,
          status: "OPEN",
          city: "HCM",
          createdAt: "2026-01-01",
        } as any,
        {
          id: 1,
          jobCode: "JOB002",
          title: "My Job 1",
          quantity: 1,
          workingType: "REMOTE",
          salaryMin: 5000,
          salaryMax: 8000,
          currency: "USD",
          description: "Test",
          deadline: null,
          status: "OPEN",
          city: "HCM",
          createdAt: "2026-01-01",
        } as any,
        {
          id: 2,
          jobCode: "JOB003",
          title: "My Job 2",
          quantity: 1,
          workingType: "REMOTE",
          salaryMin: 5000,
          salaryMax: 8000,
          currency: "USD",
          description: "Test",
          deadline: null,
          status: "OPEN",
          city: "HCM",
          createdAt: "2026-01-01",
        } as any,
      ],
    };

    it("should fetch user's jobs with pagination", async () => {
      vi.mocked(jobsApi.getMyJobs).mockResolvedValue(mockMyJobs);

      const { result } = renderHook(() => useMyJobsQuery(1, 10), {
        wrapper: Wrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockMyJobs);
      expect(jobsApi.getMyJobs).toHaveBeenCalledWith(1, 10);
    });

    it("should use default pagination values", async () => {
      vi.mocked(jobsApi.getMyJobs).mockResolvedValue(mockMyJobs);

      renderHook(() => useMyJobsQuery(), { wrapper: Wrapper });

      await waitFor(() => {
        expect(jobsApi.getMyJobs).toHaveBeenCalledWith(1, 10);
      });
    });
  });

  describe("useJobDetailQuery", () => {
    const mockJobDetail = {
      id: 1,
      jobCode: "JOB001",
      title: "Senior Developer",
      description: "We are looking for...",
      responsibilities: "Design and implement features",
      requirements: "5+ years experience",
      benefits: "Competitive salary",
      workingTime: "9 AM - 6 PM",
      location: "HCM",
      addressDetail: "123 Tech Street",
      experience: 5,
      salaryMin: 15000,
      salaryMax: 25000,
      negotiable: true,
      currency: "USD",
      quantity: 1,
      rankLevel: "SENIOR",
      workingType: "REMOTE",
      deadline: "2026-12-31",
      status: "OPEN",
      createdAt: "2026-01-01",
      skills: [],
    } as any;

    it("should fetch job detail when id is provided", async () => {
      vi.mocked(jobsApi.getJobDetail).mockResolvedValue(mockJobDetail);

      const { result } = renderHook(() => useJobDetailQuery(1), {
        wrapper: Wrapper,
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockJobDetail);
    });

    it("should not fetch when id is null", () => {
      vi.mocked(jobsApi.getJobDetail).mockResolvedValue(mockJobDetail);

      renderHook(() => useJobDetailQuery(null), { wrapper: Wrapper });

      // Should not call API when id is null
      expect(jobsApi.getJobDetail).not.toHaveBeenCalled();
    });

    it("should refetch when id changes", async () => {
      vi.mocked(jobsApi.getJobDetail).mockResolvedValue(mockJobDetail);

      const { rerender } = renderHook((props) => useJobDetailQuery(props.id), {
        wrapper: Wrapper,
        initialProps: { id: 1 },
      });

      await waitFor(() => {
        expect(jobsApi.getJobDetail).toHaveBeenCalledWith(1);
      });

      rerender({ id: 2 });

      await waitFor(() => {
        expect(jobsApi.getJobDetail).toHaveBeenCalledWith(2);
      });
    });
  });

  describe("useSavedJobsQuery", () => {
    const mockSavedJobs = [
      {
        jobId: 0,
        title: "Saved Job 0",
        companyName: "Tech Corp",
        location: "HCM",
        salaryMin: 5000,
        salaryMax: 8000,
        currency: "USD",
        postedDate: "2026-01-01",
        status: "OPEN",
      },
      {
        jobId: 1,
        title: "Saved Job 1",
        companyName: "Tech Corp",
        location: "HCM",
        salaryMin: 5000,
        salaryMax: 8000,
        currency: "USD",
        postedDate: "2026-01-01",
        status: "OPEN",
      },
    ] as any;

    it("should fetch saved jobs when enabled", async () => {
      vi.mocked(jobsApi.fetchSavedJobs).mockResolvedValue(mockSavedJobs);

      const { result } = renderHook(() => useSavedJobsQuery(true), {
        wrapper: Wrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSavedJobs);
    });

    it("should not fetch saved jobs when disabled", () => {
      vi.mocked(jobsApi.fetchSavedJobs).mockResolvedValue(mockSavedJobs);

      renderHook(() => useSavedJobsQuery(false), {
        wrapper: Wrapper,
      });

      // Should not call API when disabled
      expect(jobsApi.fetchSavedJobs).not.toHaveBeenCalled();
    });

    it("should use true as default enabled value", async () => {
      vi.mocked(jobsApi.fetchSavedJobs).mockResolvedValue(mockSavedJobs);

      const { result } = renderHook(() => useSavedJobsQuery(), {
        wrapper: Wrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(jobsApi.fetchSavedJobs).toHaveBeenCalled();
    });
  });
});
