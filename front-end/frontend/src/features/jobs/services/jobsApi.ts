import { apiClient } from "@/shared/utils/axios";
import type {
  JobListResponse,
  JobDetail,
  JobFilterParams,
  JobFormValues,
} from "../types";
import type { ApiResponse } from "@/features/auth/types/api.types";

export const fetchSkills = async () => {
  const res = await apiClient.get<ApiResponse<import("../types").SkillOption[]>>(
    "/api/skills",
  );
  return res.data.result;
};

export const getJobs = async (params: JobFilterParams) => {
  const res = await apiClient.get<ApiResponse<JobListResponse>>("/api/jobs", { params });
  return res.data.result;
};

export const getMyJobs = async (page = 1, size = 10) => {
  console.log(`[API] Calling getMyJobs with page=${page}, size=${size}`);
  const res = await apiClient.get<ApiResponse<JobListResponse>>("/api/jobs/my", {
    params: { page, size },
  });
  console.log(`[API] getMyJobs response:`, res.data);
  return res.data.result;
};

export const getJobDetail = async (id: number) => {
  const res = await apiClient.get<ApiResponse<JobDetail>>(`/api/jobs/${id}`);
  return res.data.result;
};

// Create job: multipart/form-data (may include image file)
export const createJob = async (form: JobFormValues) => {
  const fd = new FormData();
  fd.append("title", form.title);
  fd.append("description", form.description);
  fd.append("rankLevel", form.rankLevel);
  fd.append("workingType", form.workingType);
  fd.append("location", form.location ?? "");
  fd.append("addressDetail", form.addressDetail ?? "");
  fd.append("experience", String(form.experience ?? 0));
  fd.append("salaryMin", String(form.salaryMin ?? 0));
  fd.append("salaryMax", String(form.salaryMax ?? 0));
  fd.append("negotiable", String(Boolean(form.negotiable)));
  fd.append("currency", form.currency ?? "USD");
  fd.append("quantity", String(form.quantity ?? 1));
  if (form.deadline) fd.append("deadline", form.deadline);
  fd.append("responsibilities", form.responsibilities ?? "");
  fd.append("requirements", form.requirements ?? "");
  fd.append("benefits", form.benefits ?? "");
  fd.append("workingTime", form.workingTime ?? "");

  if (form.skillIds && form.skillIds.length > 0) {
    form.skillIds.forEach((id) => fd.append("skillIds", String(id)));
  }

  if (form.postImage && form.postImage.length > 0) {
    // backend expects a single file field named 'image' or similar
    fd.append("image", form.postImage[0]);
  }

  const res = await apiClient.post("/api/jobs", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  // return full response so callers can inspect status (e.g., 201 Created)
  return res;
};

// Partial update: send multipart/form-data when image may be updated
export const updateJob = async (id: number, form: Partial<JobFormValues>) => {
  const fd = new FormData();

  if (form.title) fd.append("title", form.title);
  if (form.description) fd.append("description", form.description);
  if (form.rankLevel) fd.append("rankLevel", form.rankLevel);
  if (form.workingType) fd.append("workingType", form.workingType);
  if (form.location) fd.append("location", form.location);
  if (form.addressDetail) fd.append("addressDetail", form.addressDetail);
  if (form.experience !== undefined) fd.append("experience", String(form.experience));
  if (form.salaryMin !== undefined) fd.append("salaryMin", String(form.salaryMin));
  if (form.salaryMax !== undefined) fd.append("salaryMax", String(form.salaryMax));
  if (form.negotiable !== undefined) fd.append("negotiable", String(Boolean(form.negotiable)));
  if (form.currency) fd.append("currency", form.currency);
  if (form.quantity !== undefined) fd.append("quantity", String(form.quantity));
  if (form.deadline) fd.append("deadline", form.deadline);
  if (form.responsibilities) fd.append("responsibilities", form.responsibilities);
  if (form.requirements) fd.append("requirements", form.requirements);
  if (form.benefits) fd.append("benefits", form.benefits);
  if (form.workingTime) fd.append("workingTime", form.workingTime);

  if (form.skillIds && form.skillIds.length > 0) {
    form.skillIds.forEach((s) => fd.append("skillIds", String(s)));
  }

  if (form.postImage && form.postImage.length > 0) {
    fd.append("image", form.postImage[0]);
  }

  const res = await apiClient.patch(`/api/jobs/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.result;
};

export const toggleJobStatus = async (id: number, newDeadline?: string) => {
  // Always send a JSON body because the backend expects a request body.
  const payload = newDeadline ? { newDeadline } : {};
  const res = await apiClient.patch(`/api/jobs/${id}/toggle-job-status`, payload);
  return res.data;
};

export const deleteJobSoft = async (id: number) => {
  const res = await apiClient.patch(`/api/jobs/${id}/toggle-active`);
  return res.data;
};
// convenience aliases expected by pages/components
export const fetchJobDetail = getJobDetail;
export const fetchJobs = getJobs;

export const saveJobPost = async (jobId: number) => {
  const res = await apiClient.post<ApiResponse<string>>(`/api/jobs/${jobId}/save`);
  return res.data.result;
};

export const removeSavedJob = async (jobId: number) => {
  const res = await apiClient.delete<ApiResponse<string>>(`/api/jobs/${jobId}/save`);
  return res.data.result;
};

export const fetchSavedJobs = async () => {
  const res = await apiClient.get<ApiResponse<import("../types").SavedJob[]>>("/api/jobs/saved");
  return res.data.result;
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
  fetchJobDetail,
  fetchJobs,
  saveJobPost,
  removeSavedJob,
  fetchSavedJobs,
};
