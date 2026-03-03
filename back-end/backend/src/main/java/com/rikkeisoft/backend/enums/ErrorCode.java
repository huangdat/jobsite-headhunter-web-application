package com.rikkeisoft.backend.enums;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@FieldDefaults(level = AccessLevel.PRIVATE)
public enum ErrorCode {
    // Standard HTTP error codes
    OK( HttpStatus.OK, "OK"),
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

    INVALID_KEY(HttpStatus.BAD_REQUEST, "Invalid message key provided"),

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
    // Custom error code for OTP module
    OTP_NOT_FOUND(HttpStatus.NOT_FOUND, "OTP not found"),
    OTP_EXPIRED(HttpStatus.BAD_REQUEST, "OTP has expired"),
    OTP_INVALID(HttpStatus.BAD_REQUEST, "Invalid OTP"),
    OTP_SEND_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to send OTP"),
    EMAIL_INVALID(HttpStatus.BAD_REQUEST, "Invalid email")
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
