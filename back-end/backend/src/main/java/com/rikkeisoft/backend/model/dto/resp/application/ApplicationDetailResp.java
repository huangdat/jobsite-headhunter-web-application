package com.rikkeisoft.backend.model.dto.resp.application;

import com.rikkeisoft.backend.enums.ApplicationStatus;
import com.rikkeisoft.backend.model.dto.resp.interview.InterviewResp;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Comprehensive response payload for a single application, including snapshot data
 * and embedded interview schedules. Used for detailed profile viewing.
 */
@Data
public class ApplicationDetailResp {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String candidateId;
    private String fullName;
    private String email;
    private String phone;
    private String cvSnapshotUrl;
    private String coverLetter;
    private String salaryExpectation;
    private LocalDateTime appliedAt;
    private ApplicationStatus status;
    private List<InterviewResp> interviews;
}
