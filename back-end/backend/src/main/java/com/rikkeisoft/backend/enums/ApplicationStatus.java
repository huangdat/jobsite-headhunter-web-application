package com.rikkeisoft.backend.enums;

/**
 * Defines the allowed statuses for a job application throughout the recruitment pipeline.
 */
public enum ApplicationStatus {
    APPLIED,    // Newly applied
    SCREENING,  // Under review
    INTERVIEW,  // Interview scheduled
    PASSED,     // Hired/Passed
    REJECTED,   // Rejected
    CANCELLED   // Cancelled by the candidate
}