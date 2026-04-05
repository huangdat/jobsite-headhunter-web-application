import type { ApplicationStatus, InterviewType } from "../types";
import {
  APPLICATION_STATUS as ApplicationStatusValues,
  INTERVIEW_TYPE as InterviewTypeValues,
  INTERVIEW_TYPE,
} from "@/shared/types/enums";

// Status Labels (dùng cho UI display)
export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  [ApplicationStatusValues.APPLIED]: "applications.status.applied",
  [ApplicationStatusValues.SCREENING]: "applications.status.screening",
  [ApplicationStatusValues.INTERVIEW]: "applications.status.interview",
  [ApplicationStatusValues.PASSED]: "applications.status.passed",
  [ApplicationStatusValues.REJECTED]: "applications.status.rejected",
  [ApplicationStatusValues.CANCELLED]: "applications.status.cancelled",
};

// Status Colors (cho Badge component)
export const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, string> = {
  [ApplicationStatusValues.APPLIED]: "bg-blue-100 text-blue-800",
  [ApplicationStatusValues.SCREENING]: "bg-yellow-100 text-yellow-800",
  [ApplicationStatusValues.INTERVIEW]: "bg-purple-100 text-purple-800",
  [ApplicationStatusValues.PASSED]: "bg-green-100 text-green-800",
  [ApplicationStatusValues.REJECTED]: "bg-red-100 text-red-800",
  [ApplicationStatusValues.CANCELLED]: "bg-gray-100 text-gray-800",
};

// Interview Type Labels
export const INTERVIEW_TYPE_LABELS: Record<InterviewType, string> = {
  [InterviewTypeValues.ONLINE]: "applications.interview.typeOnline",
  [InterviewTypeValues.OFFLINE]: "applications.interview.typeOffline",
};

// Allowed Status Transitions (workflow validation)
export const ALLOWED_STATUS_TRANSITIONS: Record<
  ApplicationStatus,
  ApplicationStatus[]
> = {
  [ApplicationStatusValues.APPLIED]: [
    ApplicationStatusValues.SCREENING,
    ApplicationStatusValues.REJECTED,
  ],
  [ApplicationStatusValues.SCREENING]: [
    ApplicationStatusValues.INTERVIEW,
    ApplicationStatusValues.REJECTED,
  ],
  [ApplicationStatusValues.INTERVIEW]: [
    ApplicationStatusValues.PASSED,
    ApplicationStatusValues.REJECTED,
  ],
  [ApplicationStatusValues.PASSED]: [],
  [ApplicationStatusValues.REJECTED]: [],
  [ApplicationStatusValues.CANCELLED]: [],
};

// Pagination defaults
export const APPLICATIONS_PAGE_SIZE = 10;
export const APPLICATIONS_PAGE_OPTIONS = [10, 20, 50];

// API endpoints (base endpoints, full paths sẽ được construct ở service)
export const APPLICATION_ENDPOINTS = {
  // eslint-disable-next-line custom/no-api-urls
  APPLY_JOB: "/api/jobs/:jobId/applications",
  // eslint-disable-next-line custom/no-api-urls
  GET_HEADHUNTER_APPLICATIONS: "/api/headhunter/jobs/:jobId/applications",
  // eslint-disable-next-line custom/no-api-urls
  GET_APPLICATION_DETAIL: "/api/headhunter/applications/:id",
  // eslint-disable-next-line custom/no-api-urls
  UPDATE_APPLICATION_STATUS: "/api/headhunter/applications/:id/status",
  // eslint-disable-next-line custom/no-api-urls
  CREATE_INTERVIEW: "/api/interviews",
  // eslint-disable-next-line custom/no-api-urls
  GET_CANDIDATE_APPLICATIONS: "/api/candidates/me/applications",
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
  [INTERVIEW_TYPE.ONLINE]: ["meetingLink"],
  [INTERVIEW_TYPE.OFFLINE]: ["location"],
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
