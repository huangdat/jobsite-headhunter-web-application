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
    match: undefined, // Match percentage can be calculated elsewhere if needed
  };
}

/**
 * Fetch recommended jobs for the current user
 */
export async function getRecommendedJobs(): Promise<{ jobs: Job[] }> {
  try {
    const response = await apiClient.get<{ result: RecommendationResp }>(
      API_ENDPOINTS.JOBS.GET_RECOMMENDED
    );
    const data = response.data.result;
    const mappedJobs = data.jobs.map(mapJobRespToJob);
    return { jobs: mappedJobs };
  } catch (error) {
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
