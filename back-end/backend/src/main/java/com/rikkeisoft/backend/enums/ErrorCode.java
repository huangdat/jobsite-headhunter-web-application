package com.rikkeisoft.backend.enums;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@FieldDefaults(level = AccessLevel.PRIVATE)
public enum ErrorCode {
    // Standard HTTP error codes
    OK(HttpStatus.OK, "status.ok"),
    CREATED(HttpStatus.CREATED, "status.created"),
    BAD_REQUEST(HttpStatus.BAD_REQUEST, "error.bad_request"),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "error.unauthorized"),
    UNAUTHORIZED_ACTION(HttpStatus.PAYMENT_REQUIRED, "error.unauthorized_action"),
    FORBIDDEN(HttpStatus.FORBIDDEN, "error.forbidden"),
    NOT_FOUND(HttpStatus.NOT_FOUND, "status.not_found"),
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "error.method_not_allowed"),
    CONFLICT(HttpStatus.CONFLICT, "status.conflict"),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "error.internal_server_error"),
    SERVICE_UNAVAILABLE(HttpStatus.SERVICE_UNAVAILABLE, "status.service_unavailable"),
    TOO_MANY_REQUESTS(HttpStatus.TOO_MANY_REQUESTS, "error.too_many_requests"),

    INVALID_KEY(HttpStatus.BAD_REQUEST, "error.invalid_key"),

    EMAIL_REQUIRED(HttpStatus.BAD_REQUEST, "error.email_required"),
    AUTH_FAILED(HttpStatus.UNAUTHORIZED, "error.auth_failed"),

    // Custom error codes for File Upload
    FILE_UPLOAD_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "error.file_upload_error"),

    // Custom error codes for Account module
    ACCOUNT_NOT_FOUND(HttpStatus.NOT_FOUND, "error.account_not_found"),
    NO_ACCOUNTS_STORED(HttpStatus.NOT_FOUND, "error.no_accounts_stored"),
    USER_EXISTED(HttpStatus.CONFLICT, "error.user_existed"),
    EMAIL_EXISTED(HttpStatus.CONFLICT, "error.email_existed"),
    PASSWORD_NOT_MATCH(HttpStatus.BAD_REQUEST, "error.password_not_match"),
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "error.invalid_credentials"),
    INVALID_ACCOUNT_STATUS(HttpStatus.BAD_REQUEST, "error.invalid_account_status"),
    INVALID_PASSWORD(HttpStatus.UNAUTHORIZED, "error.invalid_password"),
    PASSWORD_SAME_AS_OLD(HttpStatus.BAD_REQUEST, "error.password_same_as_old"),
    PASSWORD_INVALID(HttpStatus.BAD_REQUEST, "error.password_invalid"),

    // Custom error code for OTP module
    OTP_NOT_FOUND(HttpStatus.NOT_FOUND, "error.otp_not_found"),
    OTP_EXPIRED(HttpStatus.BAD_REQUEST, "error.otp_expired"),
    OTP_INVALID(HttpStatus.BAD_REQUEST, "error.otp_invalid"),
    OTP_ATTEMPTS_EXCEEDED(HttpStatus.TOO_MANY_REQUESTS, "error.otp_attempts_exceeded"),
    OTP_SEND_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "error.otp_send_failed"),
    EMAIL_INVALID(HttpStatus.BAD_REQUEST, "validation.email.invalid"),
    TOKEN_EXPIRED(HttpStatus.BAD_REQUEST, "error.token_expired"),

    // Custom error codes for BusinessProfile module
    BUSINESS_PROFILE_NOT_FOUND(HttpStatus.NOT_FOUND, "error.business_profile_not_found"),
    COMPANY_NAME_EXISTED(HttpStatus.CONFLICT, "error.company_name_existed"),

    // Custom error codes for MST (Tax code) lookup
    MST_NOT_FOUND(HttpStatus.NOT_FOUND, "error.mst_not_found"),
    MST_LOOKUP_FAILED(HttpStatus.SERVICE_UNAVAILABLE, "error.mst_lookup_failed"),

    // Custom error codes for Collaborator Commission
    COMMISSION_RATE_INVALID(HttpStatus.BAD_REQUEST, "error.commission_rate_invalid"),
    COMMISSION_RATE_NULL(HttpStatus.BAD_REQUEST, "error.commission_rate_null"),
    COMMISSION_RATE_MIN(HttpStatus.BAD_REQUEST, "error.commission_rate_min"),
    COMMISSION_RATE_MAX(HttpStatus.BAD_REQUEST, "error.commission_rate_max"),

    // Custom error codes for business profile retrieval
    NO_BUSINESS_PROFILES_STORED(HttpStatus.NOT_FOUND, "error.no_business_profiles_stored"),
    INVALID_TAX_CODE(HttpStatus.BAD_REQUEST, "error.invalid_tax_code"),

    // Custom error codes for Job module
    JOB_NOT_FOUND(HttpStatus.NOT_FOUND, "error.job.not.found"),
    JOB_EXPIRED(HttpStatus.BAD_REQUEST, "error.job_expired"),
    INVALID_DEADLINE(HttpStatus.BAD_REQUEST, "error.invalid_deadline"),
    NEW_DEADLINE_REQUIRED(HttpStatus.BAD_REQUEST, "error.new_deadline_required"),
    JOB_INVALID_STATUS_TRANSITION(HttpStatus.BAD_REQUEST, "error.job_invalid_status_transition"),
    FORUM_POST_NOT_FOUND(HttpStatus.NOT_FOUND, "error.forum_post_not_found"),
    INVALID_POST_STATUS(HttpStatus.BAD_REQUEST, "error.invalid_post_status"),

    // Custom error codes for Job Post related component
    JOB_TITLE_EMPTY(HttpStatus.BAD_REQUEST, "error.job_title_empty"),
    JOB_DESCRIPTION_EMPTY(HttpStatus.BAD_REQUEST, "error.job_description_empty"),
    JOB_RANK_REQUIRED(HttpStatus.BAD_REQUEST, "error.job_rank_required"),
    JOB_WORKING_TYPE_REQUIRED(HttpStatus.BAD_REQUEST, "error.job_working_type_required"),
    JOB_QUANTITY_REQUIRED(HttpStatus.BAD_REQUEST, "error.job_quantity_required"),
    JOB_QUANTITY_MIN(HttpStatus.BAD_REQUEST, "error.job_quantity_min"),
    JOB_DEADLINE_REQUIRED(HttpStatus.BAD_REQUEST, "error.job_deadline_required"),
    JOB_DEADLINE_FUTURE(HttpStatus.BAD_REQUEST, "error.job_deadline_future"),
    JOB_SKILLS_EMPTY(HttpStatus.BAD_REQUEST, "error.job_skills_empty"),
    JOB_RESPONSIBILITIES_EMPTY(HttpStatus.BAD_REQUEST, "error.job_responsibilities_empty"),
    JOB_RESPONSIBILITIES_SIZE(HttpStatus.BAD_REQUEST, "error.job_responsibilities_size"),
    JOB_REQUIREMENTS_EMPTY(HttpStatus.BAD_REQUEST, "error.job_requirements_empty"),
    JOB_REQUIREMENTS_SIZE(HttpStatus.BAD_REQUEST, "error.job_requirements_size"),
    JOB_SALARY_POSITIVE(HttpStatus.BAD_REQUEST, "error.job_salary_positive"),
    JOB_SALARY_MIN_REQUIRED(HttpStatus.BAD_REQUEST, "error.job_salary_min_required"),
    JOB_SALARY_MAX_REQUIRED(HttpStatus.BAD_REQUEST, "error.job_salary_max_required"),
    JOB_EXPERIENCE_REQUIRED(HttpStatus.BAD_REQUEST, "error.job_experience_required"),
    JOB_EXPERIENCE_POSITIVE(HttpStatus.BAD_REQUEST, "error.job_experience_positive"),
    JOB_CURRENCY_REQUIRED(HttpStatus.BAD_REQUEST, "error.job_currency_required"),
    JOB_CURRENCY_INVALID(HttpStatus.BAD_REQUEST, "error.job_currency_invalid"),
    JOB_LOCATION_REQUIRED(HttpStatus.BAD_REQUEST, "error.job_location_required"),
    JOB_ADDRESS_DETAIL_REQUIRED(HttpStatus.BAD_REQUEST, "error.job_address_detail_required"),
    JOB_BENEFITS_EMPTY(HttpStatus.BAD_REQUEST, "error.job_benefits_empty"),
    JOB_WORKING_TIME_EMPTY(HttpStatus.BAD_REQUEST, "error.job_working_time_empty"),
    // Type/Enum mismatch friendly messages (used by GlobalExceptionHandler)
    JOB_WORKING_TYPE_INVALID(HttpStatus.BAD_REQUEST, "error.job_working_type_invalid"),
    JOB_RANK_LEVEL_INVALID(HttpStatus.BAD_REQUEST, "error.job_rank_level_invalid"),
    JOB_STATUS_INVALID(HttpStatus.BAD_REQUEST, "error.job_status_invalid"),
    JOB_EXPERIENCE_INVALID(HttpStatus.BAD_REQUEST, "error.job_experience_invalid"),
    JOB_DEADLINE_INVALID(HttpStatus.BAD_REQUEST, "error.job_deadline_invalid"),
    JOB_SALARY_MIN_INVALID(HttpStatus.BAD_REQUEST, "error.job_salary_min_invalid"),
    JOB_SALARY_MAX_INVALID(HttpStatus.BAD_REQUEST, "error.job_salary_max_invalid"),
    JOB_NEGOTIABLE_INVALID(HttpStatus.BAD_REQUEST, "error.job_negotiable_invalid"),
    JOB_QUANTITY_INVALID(HttpStatus.BAD_REQUEST, "error.job_quantity_invalid"),
    JOB_SKILL_IDS_INVALID(HttpStatus.BAD_REQUEST, "error.job_skill_ids_invalid"),

    // Custom error codes for Application module
    APPLICATION_NOT_FOUND(HttpStatus.NOT_FOUND, "error.application_not_found"),
    APPLICATION_ALREADY_EXISTS(HttpStatus.CONFLICT, "error.application.already.exists"),
    JOB_NOT_OPEN(HttpStatus.BAD_REQUEST, "error.job.not.open"),
    APPLICATION_FULL_NAME_REQUIRED(HttpStatus.BAD_REQUEST, "error.application_full_name_required"),
    APPLICATION_EMAIL_REQUIRED(HttpStatus.BAD_REQUEST, "error.application_email_required"),
    APPLICATION_PHONE_REQUIRED(HttpStatus.BAD_REQUEST, "error.application_phone_required"),
    APPLICATION_JOB_ID_REQUIRED(HttpStatus.BAD_REQUEST, "error.application_job_id_required"),
    APPLICATION_STATUS_REQUIRED(HttpStatus.BAD_REQUEST, "error.application_status_required"),
    APPLICATION_CV_REQUIRED(HttpStatus.BAD_REQUEST, "error.application.cv.required"),
    INVALID_STATUS_TRANSITION(HttpStatus.BAD_REQUEST, "Invalid application status transition"),

    // Generic file extension validation (used by @ValidFileExtension)
    FILE_EXTENSION_INVALID(HttpStatus.BAD_REQUEST, "error.file_extension_invalid"),

    // Custom error codes for Interview module
    INTERVIEW_APPLICATION_REQUIRED(HttpStatus.BAD_REQUEST, "error.interview_application_required"),
    INTERVIEW_TYPE_REQUIRED(HttpStatus.BAD_REQUEST, "error.interview_type_required"),
    INTERVIEW_TIME_REQUIRED(HttpStatus.BAD_REQUEST, "error.interview_time_required"),
    INTERVIEW_TIME_FUTURE(HttpStatus.BAD_REQUEST, "error.interview_time_future"),
    INTERVIEW_LINK_REQUIRED(HttpStatus.BAD_REQUEST, "error.interview_link_required"),
    INTERVIEW_LOCATION_REQUIRED(HttpStatus.BAD_REQUEST, "error.interview_location_required"),

    // Custom error codes for candidate CV module
    CV_NOT_FOUND(HttpStatus.NOT_FOUND, "error.cv_not_found"),
    CV_ALREADY_EXISTS(HttpStatus.CONFLICT, "error.cv_already_exists"),
    CV_URL_REQUIRED(HttpStatus.BAD_REQUEST, "error.cv_url_required"),
    CV_URL_INVALID(HttpStatus.BAD_REQUEST, "error.cv_url_invalid"),
    CV_VISIBILITY_REQUIRED(HttpStatus.BAD_REQUEST, "error.cv_visibility_required"),
    NO_CVS_STORED(HttpStatus.NOT_FOUND, "error.no_cvs_stored"),

    // Forum Category module
    CATEGORY_NOT_FOUND(HttpStatus.NOT_FOUND, "error.category.not.found"),
    CATEGORY_SLUG_CONFLICT(HttpStatus.CONFLICT, "error.category.slug.conflict"),
    CATEGORY_ALREADY_DELETED(HttpStatus.BAD_REQUEST, "error.category.already.deleted"),

    // Forum Post module
    POST_NOT_FOUND(HttpStatus.NOT_FOUND, "error.post.not.found"),
    POST_ALREADY_DELETED(HttpStatus.BAD_REQUEST, "error.post.already.deleted"),
    POST_FORBIDDEN(HttpStatus.FORBIDDEN, "error.post.forbidden"),

    // Forum Comment module
    COMMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "error.comment.not.found"),
    COMMENT_DELETED(HttpStatus.BAD_REQUEST, "error.comment.deleted"),
    COMMENT_FORBIDDEN(HttpStatus.FORBIDDEN, "error.comment.forbidden"),
    COMMENT_PARENT_MISMATCH(HttpStatus.BAD_REQUEST, "error.comment.parent.mismatch"),

    // Reaction module (Posts & Comments)
    REACTION_TYPE_INVALID(HttpStatus.BAD_REQUEST, "error.reaction.type.invalid")
    ;

    private final HttpStatus httpStatus;
    private final String messageKey;

    ErrorCode(HttpStatus httpStatus, String messageKey) {
        this.httpStatus = httpStatus;
        this.messageKey = messageKey;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public String getMessageKey() {
        return messageKey;
    }
}
