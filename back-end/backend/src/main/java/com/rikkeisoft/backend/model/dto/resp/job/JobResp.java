package com.rikkeisoft.backend.model.dto.resp.job;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.rikkeisoft.backend.enums.JobStatus;
import com.rikkeisoft.backend.enums.WorkingType;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JobResp {
    Long id;
    String jobCode;
    String title;
    Integer quantity;
    WorkingType workingType;
    Double salaryMin;
    Double salaryMax;
    String currency;
    String description;
    LocalDate deadline;
    JobStatus status;
    String city;
    LocalDateTime createdAt;
    String headhunterId;
    String headhunterName;
}
