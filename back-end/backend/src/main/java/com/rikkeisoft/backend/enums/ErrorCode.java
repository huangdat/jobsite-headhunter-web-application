package com.rikkeisoft.backend.enums;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@FieldDefaults(level = AccessLevel.PRIVATE)
public enum ErrorCode {
    // Standard HTTP error codes
    OK(HttpStatus.OK, "OK"),
    CREATED(HttpStatus.CREATED, "Created"),
    BAD_REQUEST(HttpStatus.BAD_REQUEST, "Bad Request"),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "Unauthorized error"),
    UNAUTHORIZED_ACTION(HttpStatus.PAYMENT_REQUIRED, "Unauthoried action"),
    FORBIDDEN(HttpStatus.FORBIDDEN, "Forbidden"),
    NOT_FOUND(HttpStatus.NOT_FOUND, "Not Found"),
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "Method Not Allowed"),
    CONFLICT(HttpStatus.CONFLICT, "Conflict"),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
    SERVICE_UNAVAILABLE(HttpStatus.SERVICE_UNAVAILABLE, "Service Unavailable"),
    TOO_MANY_REQUESTS(HttpStatus.TOO_MANY_REQUESTS, "Too many requests. Please try again later."),

    INVALID_KEY(HttpStatus.BAD_REQUEST, "Invalid message key provided"),

    EMAIL_REQUIRED(HttpStatus.BAD_REQUEST, "Email are required to register account"),
    AUTH_FAILED(HttpStatus.UNAUTHORIZED, "Authentication failed"),

    // Custom error codes for File Upload
    FILE_UPLOAD_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Error occurred during file upload"),

    // Custom error codes for Account module
    ACCOUNT_NOT_FOUND(HttpStatus.NOT_FOUND, "Account not found"),
    NO_ACCOUNTS_STORED(HttpStatus.NOT_FOUND, "No accounts stored"),
    USER_EXISTED(HttpStatus.CONFLICT, "Username already exists"),
    EMAIL_EXISTED(HttpStatus.CONFLICT, "Email already exists"),
    PASSWORD_NOT_MATCH(HttpStatus.BAD_REQUEST, "Password and re-password do not match"),
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "Invalid username or password"),
    INVALID_ACCOUNT_STATUS(HttpStatus.BAD_REQUEST, "Invalid account status"),
    INVALID_PASSWORD(HttpStatus.UNAUTHORIZED, "Old password is incorrect"),
    PASSWORD_SAME_AS_OLD(HttpStatus.BAD_REQUEST, "The new password must not be the same as the old password."),
    PASSWORD_INVALID(HttpStatus.BAD_REQUEST,
            "Invalid password! Must be 8-16 characters long, including uppercase letters, lowercase letters, and numbers."),
    // Custom error code for OTP module
    OTP_NOT_FOUND(HttpStatus.NOT_FOUND, "OTP not found"),
    OTP_EXPIRED(HttpStatus.BAD_REQUEST, "OTP has expired"),
    OTP_INVALID(HttpStatus.BAD_REQUEST, "Invalid OTP"),
    OTP_ATTEMPTS_EXCEEDED(HttpStatus.TOO_MANY_REQUESTS,
            "OTP verification attempts exceeded. Please request a new code."),
    OTP_SEND_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to send OTP"),
    EMAIL_INVALID(HttpStatus.BAD_REQUEST, "Invalid email"),
    TOKEN_EXPIRED(HttpStatus.BAD_REQUEST, "Reset password token has expired. Please request a new OTP."),

    // Custom error codes for BusinessProfile module
    BUSINESS_PROFILE_NOT_FOUND(HttpStatus.NOT_FOUND, "Business profile not found"),
    COMPANY_NAME_EXISTED(HttpStatus.CONFLICT, "Company already exists"),

    // Custom error codes for MST (Tax code) lookup
    MST_NOT_FOUND(HttpStatus.NOT_FOUND, "Tax code not found or does not exist"),
    MST_LOOKUP_FAILED(HttpStatus.SERVICE_UNAVAILABLE, "Failed to lookup tax code information. Please try again later."),

    // Custom error codes for Collaborator Commission
    COMMISSION_RATE_INVALID(HttpStatus.BAD_REQUEST, "Commission rate must be between 0 and 100"),
    COMMISSION_RATE_NULL(HttpStatus.BAD_REQUEST, "Commission rate cannot be null"),
    COMMISSION_RATE_MIN(HttpStatus.BAD_REQUEST, "Commission rate must be at least 0"),
    COMMISSION_RATE_MAX(HttpStatus.BAD_REQUEST, "Commission rate cannot exceed 100"),

    // Custom error codes for business profile retrieval
    NO_BUSINESS_PROFILES_STORED(HttpStatus.NOT_FOUND, "No business profiles stored"),
    INVALID_TAX_CODE(HttpStatus.BAD_REQUEST, "Invalid tax code format. Please provide a valid tax code."),

    // Custom error codes for Job module
    JOB_NOT_FOUND(HttpStatus.NOT_FOUND, "Job not found"),
    JOB_EXPIRED(HttpStatus.BAD_REQUEST, "Cannot toggle job status - job has expired"),
    INVALID_DEADLINE(HttpStatus.BAD_REQUEST, "New deadline must be after today"),
    NEW_DEADLINE_REQUIRED(HttpStatus.BAD_REQUEST, "New deadline is required to reopen job"),
    JOB_INVALID_STATUS_TRANSITION(HttpStatus.BAD_REQUEST, "Cannot toggle job in DRAFT status"),
    FORUM_POST_NOT_FOUND(HttpStatus.NOT_FOUND, "Forum post not found"),
    INVALID_POST_STATUS(HttpStatus.BAD_REQUEST, "Invalid post status. Allowed values: VISIBLE, HIDDEN"),

    // Custom error codes for Job Post related component
    JOB_TITLE_EMPTY(HttpStatus.BAD_REQUEST, "Title cannot be empty"),
    JOB_DESCRIPTION_EMPTY(HttpStatus.BAD_REQUEST, "Description cannot be empty"),
    JOB_RANK_REQUIRED(HttpStatus.BAD_REQUEST, "Rank level is required"),
    JOB_WORKING_TYPE_REQUIRED(HttpStatus.BAD_REQUEST, "Working type is required"),
    JOB_QUANTITY_REQUIRED(HttpStatus.BAD_REQUEST, "Quantity is required"),
    JOB_QUANTITY_MIN(HttpStatus.BAD_REQUEST, "Quantity must be greater than 0"),
    JOB_DEADLINE_REQUIRED(HttpStatus.BAD_REQUEST, "Deadline is required"),
    JOB_DEADLINE_FUTURE(HttpStatus.BAD_REQUEST, "Deadline must be today or later"),
    JOB_SKILLS_EMPTY(HttpStatus.BAD_REQUEST, "At least one skill must be selected"),
    JOB_RESPONSIBILITIES_EMPTY(HttpStatus.BAD_REQUEST, "Responsibilities cannot be empty"),
    JOB_RESPONSIBILITIES_SIZE(HttpStatus.BAD_REQUEST, "Responsibilities must be at least 50 characters"),
    JOB_REQUIREMENTS_EMPTY(HttpStatus.BAD_REQUEST, "Requirements cannot be empty"),
    JOB_REQUIREMENTS_SIZE(HttpStatus.BAD_REQUEST, "Requirements must be at least 50 characters"),
    JOB_SALARY_POSITIVE(HttpStatus.BAD_REQUEST, "Salary must be positive"),
    JOB_SALARY_MIN_REQUIRED(HttpStatus.BAD_REQUEST, "Minimum salary is required"),
    JOB_SALARY_MAX_REQUIRED(HttpStatus.BAD_REQUEST, "Maximum salary is required"),
    JOB_EXPERIENCE_REQUIRED(HttpStatus.BAD_REQUEST, "Experience level is required"),
    JOB_EXPERIENCE_POSITIVE(HttpStatus.BAD_REQUEST, "Experience must be 0 or positive"),
    JOB_CURRENCY_REQUIRED(HttpStatus.BAD_REQUEST, "Please specify paid currency"),
    JOB_CURRENCY_INVALID(HttpStatus.BAD_REQUEST, "Invalid currency"),
    JOB_LOCATION_REQUIRED(HttpStatus.BAD_REQUEST, "Location is required"),
    JOB_ADDRESS_DETAIL_REQUIRED(HttpStatus.BAD_REQUEST, "Detailed address is required"),
    JOB_BENEFITS_EMPTY(HttpStatus.BAD_REQUEST, "Benefits cannot be empty"),
    JOB_WORKING_TIME_EMPTY(HttpStatus.BAD_REQUEST, "Working time cannot be empty"),
    // Type/Enum mismatch friendly messages (used by GlobalExceptionHandler)
    JOB_WORKING_TYPE_INVALID(HttpStatus.BAD_REQUEST, "Invalid working type. Accepted: ONSITE, REMOTE, HYBRID"),
    JOB_RANK_LEVEL_INVALID(HttpStatus.BAD_REQUEST,
            "Invalid rank level. Accepted: INTERN, FRESHER, JUNIOR, MIDDLE, SENIOR, LEADER, MANAGER"),
    JOB_STATUS_INVALID(HttpStatus.BAD_REQUEST, "Invalid job status. Accepted: DRAFT, OPEN, CLOSED"),
    JOB_EXPERIENCE_INVALID(HttpStatus.BAD_REQUEST, "Invalid experience year"),
    JOB_DEADLINE_INVALID(HttpStatus.BAD_REQUEST, "Invalid deadline date. Expected format: yyyy-MM-dd"),
    JOB_SALARY_MIN_INVALID(HttpStatus.BAD_REQUEST, "Invalid minimum salary"),
    JOB_SALARY_MAX_INVALID(HttpStatus.BAD_REQUEST, "Invalid maximum salary"),
    JOB_NEGOTIABLE_INVALID(HttpStatus.BAD_REQUEST, "Invalid value for negotiable. Expected: true or false"),
    JOB_QUANTITY_INVALID(HttpStatus.BAD_REQUEST, "Invalid quantity"),
    JOB_SKILL_IDS_INVALID(HttpStatus.BAD_REQUEST, "Invalid skill IDs"),

    // Custom error codes for Application module
    APPLICATION_NOT_FOUND(HttpStatus.NOT_FOUND, "Application not found"),
    APPLICATION_ALREADY_EXISTS(HttpStatus.CONFLICT, "You have already applied for this job"),
    JOB_NOT_OPEN(HttpStatus.BAD_REQUEST, "This job is not currently open for applications"),
    APPLICATION_FULL_NAME_REQUIRED(HttpStatus.BAD_REQUEST, "Full name is required"),
    APPLICATION_EMAIL_REQUIRED(HttpStatus.BAD_REQUEST, "Email is required"),
    APPLICATION_PHONE_REQUIRED(HttpStatus.BAD_REQUEST, "Phone number is required"),
    APPLICATION_JOB_ID_REQUIRED(HttpStatus.BAD_REQUEST, "Job ID is required"),
    APPLICATION_STATUS_REQUIRED(HttpStatus.BAD_REQUEST, "Application status is required"),

    // Generic file extension validation (used by @ValidFileExtension)
    FILE_EXTENSION_INVALID(HttpStatus.BAD_REQUEST, "Invalid file type. Please upload a file with an allowed extension"),

    // Custom error codes for Interview module
    INTERVIEW_APPLICATION_REQUIRED(HttpStatus.BAD_REQUEST, "Application ID is required"),
    INTERVIEW_TYPE_REQUIRED(HttpStatus.BAD_REQUEST, "Interview type is required"),
    INTERVIEW_TIME_REQUIRED(HttpStatus.BAD_REQUEST, "Interview time is required"),
    INTERVIEW_TIME_FUTURE(HttpStatus.BAD_REQUEST, "Interview time must be in the future"),
    INTERVIEW_LINK_REQUIRED(HttpStatus.BAD_REQUEST, "Meeting link is required for ONLINE interviews"),
    INTERVIEW_LOCATION_REQUIRED(HttpStatus.BAD_REQUEST, "Location is required for OFFLINE interviews"),

    // Custom error codes for candidate CV module
    CV_NOT_FOUND(HttpStatus.NOT_FOUND, "Candidate CV not found"),
    CV_ALREADY_EXISTS(HttpStatus.CONFLICT, "Candidate CV already exists"),
    CV_URL_REQUIRED(HttpStatus.BAD_REQUEST, "CV URL is required"),
    CV_URL_INVALID(HttpStatus.BAD_REQUEST, "Invalid CV URL format"),
    CV_VISIBILITY_REQUIRED(HttpStatus.BAD_REQUEST, "CV visibility status is required"),
    NO_CVS_STORED(HttpStatus.NOT_FOUND, "No candidate CVs stored")
    ;

    private final HttpStatus httpStatus;
    private final String message;

    ErrorCode(HttpStatus httpStatus, String message) {
        this.httpStatus = httpStatus;
        this.message = message;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public String getMessage() {
        return message;
    }
}
