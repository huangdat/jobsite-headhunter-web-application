package com.rikkeisoft.backend.model.dto.req.job;

import com.rikkeisoft.backend.enums.Currency;
import com.rikkeisoft.backend.enums.JobStatus;
import com.rikkeisoft.backend.enums.RankLevel;
import com.rikkeisoft.backend.enums.WorkingType;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JobRecommendationItemReq {
    Long id;
    String jobCode;
    String title;
    String location;
    RankLevel rankLevel;
    WorkingType workingType;
    Double experience;
    Double salaryMin;
    Double salaryMax;
    Currency currency;
    Integer quantity;
    LocalDate deadline;
    JobStatus status;
    LocalDateTime createdAt;

    String headhunterId;
    String headhunterName;

    Integer totalRequiredSkills;
    Integer matchedSkills;
    Integer matchScore;

    List<String> requiredSkills;
    List<String> matchedSkillNames;
}