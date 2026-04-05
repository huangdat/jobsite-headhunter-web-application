/**
 * Interview Management API Service
 * Handles interview scheduling and management
 */

import { apiClient } from "@/shared/utils/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import type { ApiResponse } from "@/features/auth/types/api.types";
import type {
  InterviewType,
  InterviewStatus as InterviewStatusType,
} from "@/shared/types/enums";

export interface InterviewScheduleRequest {
  applicationId: number;
  interviewDate: string; // ISO datetime format (YYYY-MM-DDTHH:mm:ss)
  interviewType?: InterviewType;
  location?: string;
  notes?: string;
  meetingLink?: string; // For online interviews
}

export interface InterviewResponse {
  id: number;
  applicationId: number;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  jobId: number;
  jobTitle: string;
  interviewDate: string;
  interviewType: InterviewType;
  location?: string;
  meetingLink?: string;
  notes?: string;
  status: InterviewStatusType;
  createdAt: string;
  updatedAt: string;
}

/**
 * Schedule a new interview
 * POST /api/interviews
 */
export const scheduleInterview = async (
  data: InterviewScheduleRequest
): Promise<InterviewResponse> => {
  const response = await apiClient.post<ApiResponse<InterviewResponse>>(
    API_ENDPOINTS.INTERVIEW.SCHEDULE,
    data
  );

  return response.data.result;
};

/**
 * Convenience: Schedule an online interview (via video call or phone)
 */
export const scheduleOnlineInterview = async (
  applicationId: number,
  interviewDate: string,
  meetingLink?: string,
  notes?: string
): Promise<InterviewResponse> => {
  return scheduleInterview({
    applicationId,
    interviewDate,
    interviewType: "ONLINE",
    meetingLink,
    notes,
  });
};

/**
 * Convenience: Schedule an offline/in-person interview
 */
export const scheduleOfflineInterview = async (
  applicationId: number,
  interviewDate: string,
  location: string,
  notes?: string
): Promise<InterviewResponse> => {
  return scheduleInterview({
    applicationId,
    interviewDate,
    interviewType: "OFFLINE",
    location,
    notes,
  });
};

export default {
  scheduleInterview,
  scheduleOnlineInterview,
  scheduleOfflineInterview,
};
