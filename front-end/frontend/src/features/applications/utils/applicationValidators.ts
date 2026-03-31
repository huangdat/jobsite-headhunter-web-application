import type {
  ApplicationFormData,
  InterviewScheduleFormData,
} from "@/features/applications/types";
import { InterviewType } from "@/features/applications/types";
import { APPLICATION_VALIDATION } from "./applicationConstants";

/**
 * Validate form ứng tuyển
 * Hỗ trợ nhận diện ID từ Profile hoặc URL Azure
 */
export const validateApplicationForm = (
  data: Partial<ApplicationFormData>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Validate CV - Sử dụng key i18n
  if (!data.cvSnapshotUrl) {
    errors.cvSnapshotUrl = "applications.validation.cvRequired";
  }

  // Validate full name
  if (!data.fullName?.trim()) {
    errors.fullName = "applications.validation.fullNameRequired";
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = "applications.validation.fullNameMinLength";
  }

  // Validate email
  if (!data.email?.trim()) {
    errors.email = "applications.validation.emailRequired";
  } else if (!isValidEmail(data.email)) {
    errors.email = "applications.validation.emailInvalid";
  }

  // Validate phone
  if (!data.phone?.trim()) {
    errors.phone = "applications.validation.phoneRequired";
  } else if (!isValidPhone(data.phone)) {
    errors.phone = "applications.validation.phoneInvalid";
  }

  // Validate salary expectation
  if (data.salaryExpectation) {
    const salary = parseInt(String(data.salaryExpectation), 10);
    if (isNaN(salary) || salary < 0) {
      errors.salaryExpectation = "applications.validation.salaryInvalid";
    }
  }

  return errors;
};

/**
 * Validate lịch phỏng vấn
 */
export const validateInterviewScheduleForm = (
  data: Partial<InterviewScheduleFormData>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Validate interview type
  if (!data.interviewType) {
    errors.interviewType = "applications.validation.interviewTypeRequired";
  }

  // Validate scheduled time
  if (!data.scheduledAt) {
    errors.scheduledAt = "applications.validation.scheduledAtRequired";
  } else if (!isValidFutureTime(data.scheduledAt)) {
    errors.scheduledAt = "applications.validation.scheduledAtNotInFuture";
  }

  // Validate duration
  if (!data.durationMinutes) {
    errors.durationMinutes = "applications.validation.durationRequired";
  } else if (
    data.durationMinutes <
      (APPLICATION_VALIDATION?.INTERVIEW_DURATION_MIN || 15) ||
    data.durationMinutes >
      (APPLICATION_VALIDATION?.INTERVIEW_DURATION_MAX || 180)
  ) {
    errors.durationMinutes = "applications.validation.durationRange";
  }

  // Validate interview type specific fields
  if (data.interviewType === InterviewType.ONLINE) {
    if (!data.meetingLink?.trim()) {
      errors.meetingLink = "applications.validation.meetingLinkRequired";
    } else if (!isValidUrl(data.meetingLink)) {
      errors.meetingLink = "applications.validation.meetingLinkInvalid";
    }
  }

  if (data.interviewType === InterviewType.OFFLINE) {
    if (!data.location?.trim()) {
      errors.location = "applications.validation.locationRequired";
    }
  }

  return errors;
};

/**
 * Validate CV file vật lý trước khi upload lên Profile
 */
export const validateCVFile = (file: File | null): string => {
  if (!file) return "applications.validation.cvFileRequired";

  const allowedExtensions = [".pdf", ".doc", ".docx"];
  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedExtensions.some((ext) =>
    fileName.endsWith(ext)
  );

  if (!hasValidExtension) {
    return "applications.validation.cvFileFormatInvalid";
  }

  // Check file size (5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return "applications.validation.cvFileSizeExceeded";
  }

  return "";
};

/**
 * Các hàm Utility hỗ trợ kiểm tra định dạng
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[^\d+]/g, "");
  return cleanPhone.length >= 9 && cleanPhone.length <= 15;
};

export const isValidUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
};

export const isValidFutureTime = (dateString: string): boolean => {
  try {
    const selectedDate = new Date(dateString);
    const now = new Date();
    return selectedDate > now;
  } catch {
    return false;
  }
};

/**
 * Làm sạch dữ liệu đầu vào (XSS Prevention)
 */
export const sanitizeText = (text: string): string => {
  if (!text) return "";
  let sanitized = text.trim();
  sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, "");
  sanitized = sanitized.replace(/<iframe[^>]*>.*?<\/iframe>/gi, "");
  return sanitized;
};
