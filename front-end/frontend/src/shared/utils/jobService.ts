import { apiClient } from "./axios";
import { API_ENDPOINTS } from "@/lib/constants";
import type { Job } from "@/features/home/types";

export interface JobResp {
  id: number;
  jobCode: string;
  title: string;
  quantity: number;
  workingType: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  description: string;
  deadline: string;
  status: string;
  city: string;
  createdAt: string;
  headhunterId: string;
  headhunterName: string;
  matchScore?: number;
}

export interface RecommendationResp {
  mode: string;
  fallbackApplied: boolean;
  message: string;
  total: number;
  jobs: JobResp[];
}

/**
 * Map backend JobResp to frontend Job interface
 */
function mapJobRespToJob(jobResp: JobResp): Job {
  const salary = jobResp.salaryMax
    ? `$${jobResp.salaryMin} - $${jobResp.salaryMax} / ${jobResp.currency || "month"}`
    : `$${jobResp.salaryMin} / ${jobResp.currency || "month"}`;

  return {
    id: String(jobResp.id),
    title: jobResp.title,
    company: jobResp.headhunterName || "Unknown Company",
    salary,
    location: jobResp.city || "Unknown Location",
    workingType: jobResp.workingType,
    match:
      jobResp.matchScore !== undefined && jobResp.matchScore !== null
        ? `${jobResp.matchScore}%`
        : undefined,
  };
}

/**
 * Fetch recommended jobs for the current user
 */
export async function getRecommendedJobs(): Promise<{
  jobs: Job[];
  message?: string;
  fallbackApplied?: boolean;
}> {
  try {
    const response = await apiClient.get<{ result: RecommendationResp }>(
      API_ENDPOINTS.JOBS.GET_RECOMMENDED
    );
    const data = response.data.result;
    const mappedJobs = data.jobs.map(mapJobRespToJob);
    return {
      jobs: mappedJobs,
      message: data.message,
      fallbackApplied: data.fallbackApplied,
    };
  } catch (error: unknown) {
    // If access forbidden (e.g., non-candidate), fallback to random latest jobs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err: any = error;
    if (err && err.response && err.response.status === 403) {
      try {
        const fallback = await getRandomLatestJobs();
        return {
          jobs: fallback.jobs,
          message: "Access denied. Showing latest jobs.",
          fallbackApplied: true,
        };
      } catch (fallbackErr) {
        console.error("Error fetching fallback latest jobs:", fallbackErr);
        throw error;
      }
    }

    console.error("Error fetching recommended jobs:", error);
    throw error;
  }
}

/**
 * Fetch random latest jobs (featured jobs)
 */
export async function getRandomLatestJobs(): Promise<{ jobs: Job[] }> {
  try {
    const response = await apiClient.get<{ result: RecommendationResp }>(
      API_ENDPOINTS.JOBS.GET_RANDOM_LATEST
    );
    const data = response.data.result;
    const mappedJobs = data.jobs.map(mapJobRespToJob);
    return { jobs: mappedJobs };
  } catch (error) {
    console.error("Error fetching latest jobs:", error);
    throw error;
  }
}

export default {
  getRecommendedJobs,
  getRandomLatestJobs,
};
