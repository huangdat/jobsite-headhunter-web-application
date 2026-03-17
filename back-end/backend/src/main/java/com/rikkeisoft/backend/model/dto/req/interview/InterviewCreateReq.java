package com.rikkeisoft.backend.model.dto.req.interview;

import com.rikkeisoft.backend.enums.InterviewType;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

/**
 * Request payload used by headhunters to schedule a new interview for an application.
 */
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InterviewCreateReq {
    @NotNull(message = "INTERVIEW_APPLICATION_REQUIRED")
    Long applicationId;

    @NotNull(message = "INTERVIEW_TYPE_REQUIRED")
    InterviewType interviewType;

    @NotNull(message = "INTERVIEW_TIME_REQUIRED")
    @Future(message = "INTERVIEW_TIME_FUTURE")
    LocalDateTime scheduledAt;

    Integer durationMinutes;

    String meetingLink;

    String location;

    String notes;
}
