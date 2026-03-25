package com.rikkeisoft.backend.model.dto.req.job;

import com.rikkeisoft.backend.enums.JobStatus;
import com.rikkeisoft.backend.enums.RankLevel;
import com.rikkeisoft.backend.enums.WorkingType;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JobSearchCriteria {
    int page;
    int size;
    String keyword;
    String location;
    RankLevel rankLevel;
    WorkingType workingType;
    JobStatus status;
    Double salaryMin;
    Double salaryMax;
    Double experienceMin;
    Double experienceMax;
    Boolean negotiable;
    Boolean featured;
    Boolean visible;
    String headhunterId;
    List<Long> skillIds;
}
