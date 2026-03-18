package com.rikkeisoft.backend.model.dto.req.application;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

/**
 * Request payload used by candidates to apply for a job.
 * Carries application details and candidate snapshot data.
 */
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApplicationCreateReq {
    // There is no candidateId, backend should fetch candidate ID from Security Context token instead for security sake
    @NotNull(message = "APPLICATION_JOB_ID_REQUIRED")
    Long jobId;

    MultipartFile cvFile; // Or cvUrl if selected from their library

    String coverLetter;

    @NotBlank(message = "APPLICATION_FULL_NAME_REQUIRED")
    String fullName;

    @Email(message = "EMAIL_INVALID")
    @NotBlank(message = "APPLICATION_EMAIL_REQUIRED")
    String email;

    @NotBlank(message = "APPLICATION_PHONE_REQUIRED")
    String phone;

    String salaryExpectation;
}
