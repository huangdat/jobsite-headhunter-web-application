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
    JOB_INVALID_STATUS_TRANSITION(HttpStatus.BAD_REQUEST, "Cannot toggle job in DRAFT status");

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
