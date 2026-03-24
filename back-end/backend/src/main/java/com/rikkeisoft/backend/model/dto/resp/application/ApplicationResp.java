package com.rikkeisoft.backend.model.dto.resp.application;

import com.rikkeisoft.backend.enums.ApplicationStatus;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

/**
 * Concise response payload for applications, typically used in list/pipeline
 * views.
 * Contains necessary tracking IDs (jobId, candidateId).
 */
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApplicationResp {
    Long id;
    Long jobId;
    String candidateId; // id of Account entity. not CandidateProfile's Id
    String jobTitle;

    String fullName;
  
    LocalDateTime appliedAt;

    ApplicationStatus status;

    String email;
    String phone;
    String coverLetter;
    String salaryExpectation;
}
