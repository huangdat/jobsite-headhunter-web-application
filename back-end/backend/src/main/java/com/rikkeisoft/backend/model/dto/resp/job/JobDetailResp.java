package com.rikkeisoft.backend.model.dto.resp.job;

import com.rikkeisoft.backend.enums.JobStatus;
import com.rikkeisoft.backend.enums.RankLevel;
import com.rikkeisoft.backend.enums.WorkingType;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
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
public class JobDetailResp {
    Long id;
    String jobCode;
    String title;
    String description;
    String responsibilities;
    String requirements;
    String benefits;
    String workingTime;
    String location;
    String addressDetail;
    Double experience;
    Double salaryMin;
    Double salaryMax;
    boolean negotiable;
    String currency;
    Integer quantity;
    RankLevel rankLevel;
    WorkingType workingType;
    LocalDate deadline;
    JobStatus status;
    LocalDateTime createdAt;
    String imageUrl;

    String headhunterId;
    String headhunterName;

    String companyName;
    String companyWebsite;
    String companySize;
    String companyAddress;
    String companyDescription;

    List<JobSkillResp> skills;
}
