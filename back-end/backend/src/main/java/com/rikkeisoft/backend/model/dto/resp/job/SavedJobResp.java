package com.rikkeisoft.backend.model.dto.resp.job;

import com.rikkeisoft.backend.enums.JobStatus;
import java.time.LocalDateTime;
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
public class SavedJobResp {
    Long jobId;
    String title;
    String companyName;
    String location;
    Double salaryMin;
    Double salaryMax;
    String currency;
    LocalDateTime postedDate;
    JobStatus status;
}
