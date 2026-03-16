package com.rikkeisoft.backend.model.dto.resp.job;


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
public class RecommendationResp {
    String mode;
    Boolean fallbackApplied;
    String message;
    Integer total;
    List<?> jobs;
}