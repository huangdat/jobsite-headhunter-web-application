package com.rikkeisoft.backend.model.dto.req.job;

import com.rikkeisoft.backend.annotation.ValidFileExtension;
import com.rikkeisoft.backend.enums.Currency;
import com.rikkeisoft.backend.enums.JobStatus;
import com.rikkeisoft.backend.enums.RankLevel;
import com.rikkeisoft.backend.enums.WorkingType;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JobPostReq {
    @NotBlank(message = "JOB_TITLE_EMPTY")
    String title;

    @NotBlank(message = "JOB_DESCRIPTION_EMPTY")
    String description;

    @NotNull(message = "JOB_RANK_REQUIRED")
    RankLevel rankLevel;

    // ONSITE, REMOTE, HYBRID
    @NotNull(message = "JOB_WORKING_TYPE_REQUIRED")
    WorkingType workingType;

    @NotBlank(message = "JOB_LOCATION_REQUIRED")
    String location; // Ho Chi Minh city, Can Tho city

    @NotBlank(message = "JOB_ADDRESS_DETAIL_REQUIRED")
    String addressDetail; // detailed address

    @NotNull(message = "JOB_EXPERIENCE_REQUIRED")
    @PositiveOrZero(message = "JOB_EXPERIENCE_POSITIVE")
    Double experience;

    @NotNull(message = "JOB_SALARY_MIN_REQUIRED")
    @PositiveOrZero(message = "JOB_SALARY_POSITIVE")
    Double salaryMin;

    @NotNull(message = "JOB_SALARY_MAX_REQUIRED")
    @PositiveOrZero(message = "JOB_SALARY_POSITIVE")
    Double salaryMax;

    // Default is false
    boolean negotiable;

    @NotNull(message = "JOB_CURRENCY_REQUIRED")
    Currency currency;

    // Default is 1
    @NotNull(message = "JOB_QUANTITY_REQUIRED")
    @Min(value = 1, message = "JOB_QUANTITY_MIN")
    Integer quantity;

    @NotNull(message = "JOB_DEADLINE_REQUIRED")
    @FutureOrPresent(message = "JOB_DEADLINE_FUTURE")
    LocalDate deadline;

    // at least 1 skill should be chosen
    @NotEmpty(message = "JOB_SKILLS_EMPTY")
    List<Long> skillIds;

    @NotBlank(message = "JOB_RESPONSIBILITIES_EMPTY")
    @Size(min = 50, message = "JOB_RESPONSIBILITIES_SIZE")
    String responsibilities;

    @NotBlank(message = "JOB_REQUIREMENTS_EMPTY")
    @Size(min = 50, message = "JOB_REQUIREMENTS_SIZE")
    String requirements;

    @NotBlank(message = "JOB_BENEFITS_EMPTY")
    String benefits;

    @NotBlank(message = "JOB_WORKING_TIME_EMPTY")
    String workingTime;

    @Builder.Default
    JobStatus status = JobStatus.OPEN;

    @ValidFileExtension(
            allowedExtensions = {"png", "jpg", "jpeg"},
            message = "Invalid file extension, please only upload .jpg .jpeg .png"
    )
    MultipartFile postImage;
}