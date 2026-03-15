package com.rikkeisoft.backend.model.dto.resp.job;

import com.rikkeisoft.backend.enums.Currency;
import com.rikkeisoft.backend.enums.RankLevel;
import com.rikkeisoft.backend.enums.WorkingType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JobPostResp {
    String title;
    String description;
    RankLevel rankLevel;
    WorkingType workingType;
    String location;
    String addressDetail;
    Double experience;
    Double salaryMin;
    Double salaryMax;
    boolean negotiable;
    Currency currency;
    Integer quantity;
    LocalDate deadline;
    List<Long> skillIds;
    String responsibilities;
    String requirements;
    String benefits;
    String workingTime;
    String imageUrl;
}
