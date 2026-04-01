import { apiClient } from "@/shared/utils/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { extractResult } from "@/shared/api/responseAdapter";
import { cachedApiCall } from "@/shared/utils/apiCache";
import {
  appendString,
  appendNumber,
  appendBoolean,
  appendFile,
  appendArrayItems,
} from "@/shared/api/formDataBuilder";
import type {
  JobListResponse,
  JobDetail,
  JobFilterParams,
  JobFormValues,
} from "../types";
import type { ApiResponse } from "@/features/auth/types/api.types";

export const fetchSkills = async () => {
  return cachedApiCall(
    "jobs-skills",
    async () => {
      const res = await apiClient.get<
        ApiResponse<import("../types").SkillOption[]>
      >(API_ENDPOINTS.JOBS.GET_SKILLS);
      return extractResult(res);
    },
    { ttl: 600000 } // Cache for 10 minutes (static data)
  );
};

export const getJobs = async (params: JobFilterParams) => {
  return cachedApiCall(
    `jobs-list-${JSON.stringify(params)}`,
    async () => {
      const res = await apiClient.get<ApiResponse<JobListResponse>>(
        API_ENDPOINTS.JOBS.GET_LIST,
        {
          params,
        }
      );
      return extractResult(res);
    },
    { ttl: 180000 } // Cache for 3 minutes (volatile search results)
  );
};

export const getMyJobs = async (page = 1, size = 10) => {
  return cachedApiCall(
    `my-jobs-${page}-${size}`,
    async () => {
      console.log(`[API] Calling getMyJobs with page=${page}, size=${size}`);
      const res = await apiClient.get<ApiResponse<JobListResponse>>(
        API_ENDPOINTS.JOBS.GET_MY_JOBS,
        {
          params: { page, size },
        }
      );
      console.log(`[API] getMyJobs response:`, res.data);
      return extractResult(res);
    },
    { ttl: 300000 } // Cache for 5 minutes (personalized data)
  );
};

export const getJobDetail = async (id: number) => {
  return cachedApiCall(
    `job-detail-${id}`,
    async () => {
      const res = await apiClient.get<ApiResponse<JobDetail>>(
        API_ENDPOINTS.JOBS.GET_BY_ID.replace("{id}", String(id))
      );
      return extractResult(res);
    },
    { ttl: 300000 } // Cache for 5 minutes
  );
};

// Create job: multipart/form-data (may include image file)
export const createJob = async (form: JobFormValues) => {
  const fd = new FormData();

  // Append all string fields
  appendString(fd, "title", form.title);
  appendString(fd, "description", form.description);
  appendString(fd, "rankLevel", form.rankLevel);
  appendString(fd, "workingType", form.workingType);
  appendString(fd, "location", form.location);
  appendString(fd, "addressDetail", form.addressDetail);
  appendString(fd, "currency", form.currency);
  appendString(fd, "deadline", form.deadline);
  appendString(fd, "responsibilities", form.responsibilities);
  appendString(fd, "requirements", form.requirements);
  appendString(fd, "benefits", form.benefits);
  appendString(fd, "workingTime", form.workingTime);

  // Append numeric fields
  appendNumber(fd, "experience", form.experience ?? 0);
  appendNumber(fd, "salaryMin", form.salaryMin ?? 0);
  appendNumber(fd, "salaryMax", form.salaryMax ?? 0);
  appendNumber(fd, "quantity", form.quantity ?? 1);

  // Append boolean field
  appendBoolean(fd, "negotiable", form.negotiable);

  // Append skill IDs as array
  appendArrayItems(fd, "skillIds", form.skillIds);

  // Append image file
  if (form.postImage && form.postImage.length > 0) {
    appendFile(fd, "image", form.postImage[0]);
  }

  const res = await apiClient.post<ApiResponse<JobDetail>>(
    API_ENDPOINTS.JOBS.CREATE,
    fd,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return extractResult(res);
};

// Partial update: send multipart/form-data when image may be updated
export const updateJob = async (id: number, form: Partial<JobFormValues>) => {
  const fd = new FormData();

  // Append conditional string fields
  appendString(fd, "title", form.title);
  appendString(fd, "description", form.description);
  appendString(fd, "rankLevel", form.rankLevel);
  appendString(fd, "workingType", form.workingType);
  appendString(fd, "location", form.location);
  appendString(fd, "addressDetail", form.addressDetail);
  appendString(fd, "currency", form.currency);
  appendString(fd, "deadline", form.deadline);
  appendString(fd, "responsibilities", form.responsibilities);
  appendString(fd, "requirements", form.requirements);
  appendString(fd, "benefits", form.benefits);
  appendString(fd, "workingTime", form.workingTime);

  // Append conditional numeric fields
  if (form.experience !== undefined)
    appendNumber(fd, "experience", form.experience);
  if (form.salaryMin !== undefined)
    appendNumber(fd, "salaryMin", form.salaryMin);
  if (form.salaryMax !== undefined)
    appendNumber(fd, "salaryMax", form.salaryMax);
  if (form.quantity !== undefined) appendNumber(fd, "quantity", form.quantity);

  // Append conditional boolean field
  if (form.negotiable !== undefined)
    appendBoolean(fd, "negotiable", form.negotiable);

  // Append skill IDs
  appendArrayItems(fd, "skillIds", form.skillIds);

  // Append image file
  if (form.postImage && form.postImage.length > 0) {
    appendFile(fd, "image", form.postImage[0]);
  }

  const res = await apiClient.patch<ApiResponse<JobDetail>>(
    API_ENDPOINTS.JOBS.UPDATE.replace("{id}", String(id)),
    fd,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return extractResult(res);
};

export const toggleJobStatus = async (id: number, newDeadline?: string) => {
  // Always send a JSON body because the backend expects a request body.
  const payload = newDeadline ? { newDeadline } : {};
  const res = await apiClient.patch<ApiResponse<void>>(
    API_ENDPOINTS.JOBS.TOGGLE_STATUS.replace("{id}", String(id)),
    payload
  );
  return extractResult(res);
};

export const deleteJobSoft = async (id: number) => {
  const res = await apiClient.patch<ApiResponse<void>>(
    API_ENDPOINTS.JOBS.DELETE_SOFT.replace("{id}", String(id))
  );
  return extractResult(res);
};

export const saveJobPost = async (jobId: number) => {
  const res = await apiClient.post<ApiResponse<string>>(
    API_ENDPOINTS.JOBS.SAVE.replace("{id}", String(jobId))
  );
  return extractResult(res);
};

export const removeSavedJob = async (jobId: number) => {
  const res = await apiClient.delete<ApiResponse<string>>(
    API_ENDPOINTS.JOBS.REMOVE_SAVED.replace("{id}", String(jobId))
  );
  return extractResult(res);
};

export const fetchSavedJobs = async () => {
  return cachedApiCall(
    "saved-jobs",
    async () => {
      const res = await apiClient.get<
        ApiResponse<import("../types").SavedJob[]>
      >(API_ENDPOINTS.JOBS.GET_SAVED);
      return extractResult(res);
    },
    { ttl: 300000 } // Cache for 5 minutes
  );
};

export default {
  getJobs,
  getMyJobs,
  getJobDetail,
  createJob,
  updateJob,
  toggleJobStatus,
  deleteJobSoft,
  fetchSkills,
  saveJobPost,
  removeSavedJob,
  fetchSavedJobs,
};
