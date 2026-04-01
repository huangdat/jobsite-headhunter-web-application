import { ApplicationStatus, InterviewType } from "../types";
import { API_ENDPOINTS } from "@/lib/constants";

// Status Labels (dùng cho UI display)
export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.APPLIED]: "applications.status.applied",
  [ApplicationStatus.SCREENING]: "applications.status.screening",
  [ApplicationStatus.INTERVIEW]: "applications.status.interview",
  [ApplicationStatus.PASSED]: "applications.status.passed",
  [ApplicationStatus.REJECTED]: "applications.status.rejected",
};

// Status Colors (cho Badge component)
export const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.APPLIED]: "bg-blue-100 text-blue-800",
  [ApplicationStatus.SCREENING]: "bg-yellow-100 text-yellow-800",
  [ApplicationStatus.INTERVIEW]: "bg-purple-100 text-purple-800",
  [ApplicationStatus.PASSED]: "bg-green-100 text-green-800",
  [ApplicationStatus.REJECTED]: "bg-red-100 text-red-800",
};

// Interview Type Labels
export const INTERVIEW_TYPE_LABELS: Record<InterviewType, string> = {
  [InterviewType.ONLINE]: "applications.interview.typeOnline",
  [InterviewType.OFFLINE]: "applications.interview.typeOffline",
};

// Allowed Status Transitions (workflow validation)
export const ALLOWED_STATUS_TRANSITIONS: Record<
  ApplicationStatus,
  ApplicationStatus[]
> = {
  [ApplicationStatus.APPLIED]: [
    ApplicationStatus.SCREENING,
    ApplicationStatus.REJECTED,
  ],
  [ApplicationStatus.SCREENING]: [
    ApplicationStatus.INTERVIEW,
    ApplicationStatus.REJECTED,
  ],
  [ApplicationStatus.INTERVIEW]: [
    ApplicationStatus.PASSED,
    ApplicationStatus.REJECTED,
  ],
  [ApplicationStatus.PASSED]: [],
  [ApplicationStatus.REJECTED]: [],
};

// Pagination defaults
export const APPLICATIONS_PAGE_SIZE = 10;
export const APPLICATIONS_PAGE_OPTIONS = [10, 20, 50];

// API endpoints - Using API_ENDPOINTS from constants
export const APPLICATION_ENDPOINTS = {
  APPLY_JOB: API_ENDPOINTS.CANDIDATE.APPLY_JOB,
  GET_HEADHUNTER_APPLICATIONS: API_ENDPOINTS.HEADHUNTER.GET_JOB_APPLICATIONS,
  GET_APPLICATION_DETAIL: API_ENDPOINTS.HEADHUNTER.GET_APPLICATION_DETAIL,
  UPDATE_APPLICATION_STATUS: API_ENDPOINTS.HEADHUNTER.UPDATE_APPLICATION_STATUS,
  CREATE_INTERVIEW: API_ENDPOINTS.INTERVIEW.SCHEDULE,
  GET_CANDIDATE_APPLICATIONS: API_ENDPOINTS.CANDIDATE.GET_MY_APPLICATIONS,
} as const;

// Validation rules
export const APPLICATION_VALIDATION = {
  COVER_LETTER_MIN_LENGTH: 0, // Optional
  SALARY_MIN: 0,
  SALARY_MAX: 999999999,
  CV_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  CV_ALLOWED_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ] as const,
  INTERVIEW_DURATION_MIN: 15,
  INTERVIEW_DURATION_MAX: 480, // 8 hours
} as const;

// Interview type conditional fields
export const INTERVIEW_TYPE_FIELDS = {
  [InterviewType.ONLINE]: ["meetingLink"],
  [InterviewType.OFFLINE]: ["location"],
} as const;

// Default sort options
export const DEFAULT_SORT = {
  sortBy: "APPLIED_AT" as const,
  direction: "DESC" as const,
};

// Empty state messages
export const EMPTY_STATE_MESSAGES = {
  NO_APPLICATIONS: "applications.empty.noApplications",
  NO_CANDIDATES: "applications.empty.noCandidates",
  NO_CV: "applications.empty.noCV",
} as const;

// Error messages (i18n keys)
export const ERROR_MESSAGES = {
  JOB_INVALID: "applications.error.jobInvalid",
  ALREADY_APPLIED: "applications.error.alreadyApplied",
  NO_CV: "applications.error.noCV",
  INVALID_TIME: "applications.error.invalidTime",
  REQUIRED_MEETING_LINK: "applications.error.requiredMeetingLink",
  REQUIRED_LOCATION: "applications.error.requiredLocation",
  INVALID_STATUS_TRANSITION: "Invalid status transition",
} as const;

// Success messages (i18n keys)
export const SUCCESS_MESSAGES = {
  APPLIED: "applications.success.applied",
  REVIEWED: "applications.success.reviewed",
  REJECTED: "applications.success.rejected",
  INTERVIEW_SCHEDULED: "applications.success.interviewScheduled",
  HIRED: "applications.success.hired",
} as const;
