package com.rikkeisoft.backend.model.dto.resp.interview;

import com.rikkeisoft.backend.enums.InterviewStatus;
import com.rikkeisoft.backend.enums.InterviewType;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

/**
 * Response payload representing detailed information about an interview.
 */
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InterviewResp {
    Long id;
    Long applicationId;
    String interviewCode;
    InterviewType interviewType;
    InterviewStatus status;
    LocalDateTime scheduledAt;
    Integer durationMinutes;
    String meetingLink;
    String location;
    String notes;
}
