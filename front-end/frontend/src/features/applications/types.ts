// Application Status (using const as const pattern for erasable syntax)
export const ApplicationStatus = {
  APPLIED: "APPLIED",
  SCREENING: "SCREENING",
  INTERVIEW: "INTERVIEW",
  PASSED: "PASSED",
  REJECTED: "REJECTED",
} as const;
export type ApplicationStatus =
  (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

export const InterviewType = {
  ONLINE: "ONLINE",
  OFFLINE: "OFFLINE",
} as const;
export type InterviewType = (typeof InterviewType)[keyof typeof InterviewType];

export const InterviewStatus = {
  SCHEDULED: "SCHEDULED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;
export type InterviewStatus =
  (typeof InterviewStatus)[keyof typeof InterviewStatus];

// Main Application Interface
export interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  candidateId: string;
  fullName: string;
  email: string;
  phone: string;
  cvSnapshotUrl: string;
  coverLetter: string;
  salaryExpectation: string;
  appliedAt: string; // ISO date
  status: ApplicationStatus;
  interviews: Interview[];
}

// Application Snapshot (lưu thông tin tại thời điểm nộp)
export interface ApplicationSnapshot {
  fullName: string;
  email: string;
  phone: string;
  cvSnapshotUrl: string;
  salaryExpectation: string;
  coverLetter: string;
}

// Interview Interface
export interface Interview {
  id: number;
  applicationId: number;
  interviewCode: string;
  interviewType: InterviewType;
  status: InterviewStatus;
  scheduledAt: string; // ISO date
  durationMinutes: number;
  meetingLink?: string; // Dành cho ONLINE
  location?: string; // Dành cho OFFLINE
  notes?: string;
}

// Form data khi nộp hồ sơ
export interface ApplicationFormData {
  cvSnapshotUrl: string;
  fullName: string;
  email: string;
  phone: string;
  coverLetter: string;
  salaryExpectation: string;
}

// Form data khi tạo lịch phỏng vấn
export interface InterviewScheduleFormData {
  interviewType: InterviewType;
  scheduledAt: string; // ISO date
  durationMinutes: number;
  meetingLink?: string;
  location?: string;
  notes?: string;
}

// Pagination Response
export interface PaginatedResponse<T> {
  totalElements: number;
  totalPages: number;
  size: number;
  content: T[];
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// API Response Wrapper
export interface ApiResponse<T> {
  status: string;
  message: string;
  result: T;
}

// Filter params untuk danh sách applications
export interface ApplicationFilterParams {
  page?: number;
  size?: number;
  sortBy?: "APPLIED_AT" | "STATUS" | "SALARY_EXPECTATION";
  direction?: "ASC" | "DESC";
  status?: ApplicationStatus;
  keyword?: string; // Tìm kiếm theo tên hoặc email
}

// CV Info (khi candidate chọn CV)
export interface CVInfo {
  id: string;
  fileName: string;
  url: string;
  uploadedAt: string;
}
