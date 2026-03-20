package com.rikkeisoft.backend.exception;

import com.rikkeisoft.backend.controller.jobs.JobController;
import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.model.dto.APIResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Exception advice scoped exclusively to {@link JobController}.
 *
 * <p>Spring evaluates scoped (assignableTypes) advices BEFORE the global
 * {@link GlobalExceptionHandler}, so these handlers take priority for all
 * requests routed through {@code JobController}. Every other controller
 * continues to use {@code GlobalExceptionHandler} unchanged.
 *
 * <p>Responsibilities:
 * <ul>
 *   <li>Return ALL validation field errors at once (not just the first one).
 *   <li>Map {@code typeMismatch} errors for known Job fields to friendly messages.
 * </ul>
 */
@Slf4j
@RestControllerAdvice(assignableTypes = JobController.class)
public class JobControllerAdvice {

    // -----------------------------------------------------------------------
    // Field-name → ErrorCode mapping for type/enum binding failures.
    // Kept here (not in GlobalExceptionHandler) because these are Job-domain
    // field names and do not apply to the rest of the application.
    // -----------------------------------------------------------------------
    private static final Map<String, ErrorCode> TYPE_MISMATCH_MESSAGES = new LinkedHashMap<>();

    static {
        TYPE_MISMATCH_MESSAGES.put("workingType", ErrorCode.JOB_WORKING_TYPE_INVALID);
        TYPE_MISMATCH_MESSAGES.put("rankLevel",   ErrorCode.JOB_RANK_LEVEL_INVALID);
        TYPE_MISMATCH_MESSAGES.put("status",      ErrorCode.JOB_STATUS_INVALID);
        TYPE_MISMATCH_MESSAGES.put("experience",  ErrorCode.JOB_EXPERIENCE_INVALID);
        TYPE_MISMATCH_MESSAGES.put("deadline",    ErrorCode.JOB_DEADLINE_INVALID);
        TYPE_MISMATCH_MESSAGES.put("salaryMin",   ErrorCode.JOB_SALARY_MIN_INVALID);
        TYPE_MISMATCH_MESSAGES.put("salaryMax",   ErrorCode.JOB_SALARY_MAX_INVALID);
        TYPE_MISMATCH_MESSAGES.put("negotiable",  ErrorCode.JOB_NEGOTIABLE_INVALID);
        TYPE_MISMATCH_MESSAGES.put("quantity",    ErrorCode.JOB_QUANTITY_INVALID);
        TYPE_MISMATCH_MESSAGES.put("skillIds",    ErrorCode.JOB_SKILL_IDS_INVALID);
    }

    // -----------------------------------------------------------------------
    // Resolves a defaultMessage string as an ErrorCode key.
    // Returns null if the string is not a valid ErrorCode name so the caller
    // can fall back to using the string as-is (plain human-readable message).
    // -----------------------------------------------------------------------
    private String resolveMessage(String defaultMessage) {
        try {
            return ErrorCode.valueOf(defaultMessage).getMessageKey();
        } catch (IllegalArgumentException | NullPointerException ignored) {
            return defaultMessage; // plain string — return as-is
        }
    }

    // -----------------------------------------------------------------------
    // Builds the per-field error message for a single FieldError.
    // Priority: typeMismatch lookup → ErrorCode key lookup → raw string.
    // -----------------------------------------------------------------------
    private String buildMessage(FieldError fe) {
        if ("typeMismatch".equals(fe.getCode())) {
            ErrorCode ec = TYPE_MISMATCH_MESSAGES.get(fe.getField());
            return (ec != null) ? ec.getMessageKey()
                    : "Invalid value for field: " + fe.getField();
        }
        return resolveMessage(fe.getDefaultMessage());
    }

    // -----------------------------------------------------------------------
    // Shared response builder used by both handlers below.
    // -----------------------------------------------------------------------
    private ResponseEntity<APIResponse<Map<String, String>>> buildValidationResponse(
            Iterable<FieldError> fieldErrors) {

        Map<String, String> errors = new LinkedHashMap<>();
        for (FieldError fe : fieldErrors) {
            // Keep the first message per field if the same field has multiple violations
            errors.putIfAbsent(fe.getField(), buildMessage(fe));
        }

        log.warn("Job validation errors: {}", errors);

        APIResponse<Map<String, String>> response = new APIResponse<>();
        response.setStatus(HttpStatus.BAD_REQUEST);
        response.setMessage("Validation failed");
        response.setResult(errors);
        return ResponseEntity.badRequest().body(response);
    }

    /**
     * Catches Bean-Validation failures on {@code @RequestBody} payloads.
     * Returns ALL field errors at once instead of just the first one.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<APIResponse<Map<String, String>>> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex) {
        return buildValidationResponse(ex.getBindingResult().getFieldErrors());
    }

    /**
     * Catches Bean-Validation failures on {@code @ModelAttribute} payloads
     * (multipart/form-data). Spring raises {@link BindException} — not
     * {@link MethodArgumentNotValidException} — for these bindings.
     * Returns ALL field errors at once.
     */
    @ExceptionHandler(BindException.class)
    public ResponseEntity<APIResponse<Map<String, String>>> handleBindException(
            BindException ex) {
        return buildValidationResponse(ex.getFieldErrors());
    }
}
