import { ApplicationStatus, InterviewType } from "../types";
import {
  APPLICATION_STATUS_LABELS,
  INTERVIEW_TYPE_LABELS,
} from "./applicationConstants";

/**
 * Format application status to Vietnamese/English label
 * @param status - ApplicationStatus enum
 * @param t - i18n translation function
 * @returns Formatted status string
 */
export const formatApplicationStatus = (
  status: ApplicationStatus,
  t: (key: string) => string
): string => {
  const labelKey = APPLICATION_STATUS_LABELS[status];
  return t(labelKey);
};

/**
 * Format interview type to label
 * @param type - InterviewType enum
 * @param t - i18n translation function
 * @returns Formatted interview type string
 */
export const formatInterviewType = (
  type: InterviewType,
  t: (key: string) => string
): string => {
  const labelKey = INTERVIEW_TYPE_LABELS[type];
  return t(labelKey);
};

/**
 * Format date to Vietnamese format (dd/MM/yyyy HH:mm)
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDateVN = (dateString: string): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

/**
 * Format date to English format (MM/dd/yyyy HH:mm)
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDateEN = (dateString: string): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

/**
 * Format date based on language
 * @param dateString - ISO date string
 * @param language - 'vi' or 'en'
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string,
  language: string = "vi"
): string => {
  return language === "vi"
    ? formatDateVN(dateString)
    : formatDateEN(dateString);
};

/**
 * Format salary with currency
 * @param salary - Salary number
 * @param currency - Currency code (VND, USD, etc.)
 * @returns Formatted salary string
 */
export const formatSalary = (
  salary: string | number,
  currency: string = "VND"
): string => {
  if (!salary) return "Thương lượng";
  try {
    const numSalary =
      typeof salary === "string" ? parseInt(salary, 10) : salary;
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    });
    return formatter.format(numSalary);
  } catch {
    return salary.toString();
  }
};

/**
 * Format duration in minutes to human readable format
 * @param minutes - Duration in minutes
 * @returns Formatted duration string (e.g., "1h 30m")
 */
export const formatDuration = (minutes: number): string => {
  if (!minutes) return "0m";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

/**
 * Truncate text to specific length
 * @param text - Text to truncate
 * @param length - Max length
 * @returns Truncated text with ellipsis
 */
export const truncateText = (text: string, length: number = 100): string => {
  if (!text) return "";
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
};

/**
 * Get initials from full name
 * @param fullName - Full name
 * @returns Initials (e.g., "JD" from "John Doe")
 */
export const getInitials = (fullName: string): string => {
  if (!fullName) return "?";
  return fullName
    .split(" ")
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

/**
 * Format phone number
 * @param phone - Phone number string
 * @returns Formatted phone (e.g., "09** *** ***")
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return "";
  // Mask phone number: show first 2 digits, hide middle, show last 2
  if (phone.length < 4) return phone;
  return phone.slice(0, 2) + "*".repeat(phone.length - 4) + phone.slice(-2);
};

/**
 * Format email address (mask)
 * @param email - Email address
 * @returns Masked email (e.g., "j***@example.com")
 */
export const formatEmailAddress = (email: string): string => {
  if (!email) return "";
  const [localPart, domain] = email.split("@");
  if (!domain) return email;
  const maskedLocal =
    localPart.charAt(0) +
    "*".repeat(Math.max(0, localPart.length - 2)) +
    localPart.slice(-1);
  return `${maskedLocal}@${domain}`;
};
