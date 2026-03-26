/**
 * Job formatting utilities
 * Helper functions for formatting job data for display
 */

import type { JobSummary } from "../types";

// Currency formatter for VND
const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

/**
 * Format salary range for display
 * Handles cases where only min, only max, or both are provided
 * Returns "Contact for salary" if neither is available
 */
export const formatSalary = (job: JobSummary): string => {
  if (job.salaryMin && job.salaryMax) {
    return `${currencyFormatter.format(job.salaryMin)} - ${currencyFormatter.format(job.salaryMax)} ${job.currency}`;
  }

  if (job.salaryMin) {
    return `${currencyFormatter.format(job.salaryMin)} ${job.currency}`;
  }

  return "Contact for salary";
};

/**
 * Create a new Intl.NumberFormat instance for custom currency formatting
 * Useful for non-VND currencies
 */
export const createCurrencyFormatter = (
  currency: string = "VND",
  locale: string = "vi-VN"
): Intl.NumberFormat => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
};

/**
 * Format date to locale-specific date string
 */
export const formatDeadlineDate = (
  deadline: string | null | undefined
): string | null => {
  if (!deadline) return null;
  const date = new Date(deadline);
  return date.toLocaleDateString();
};

/**
 * Format salary with flexible currency support
 * Used in SavedJobsPage and other detail pages
 */
export const formatSalaryRange = (
  salaryMin: number | null | undefined,
  salaryMax: number | null | undefined,
  currency: string = "VND"
): string => {
  if (salaryMin == null || salaryMax == null) {
    return "Negotiable";
  }

  try {
    const formatter = new Intl.NumberFormat(
      currency === "VND" ? "vi-VN" : "en-US",
      {
        style: "currency",
        currency: currency || "USD",
        maximumFractionDigits: currency === "VND" ? 0 : 2,
      }
    );

    return `${formatter.format(salaryMin)} - ${formatter.format(salaryMax)}`;
  } catch {
    return `${salaryMin.toLocaleString()} - ${salaryMax.toLocaleString()} ${currency}`;
  }
};
