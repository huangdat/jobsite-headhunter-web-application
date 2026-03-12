package com.rikkeisoft.backend.model.dto.req.job;

import java.time.LocalDate;

import jakarta.validation.constraints.FutureOrPresent;
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
public class JobToggleStatusReq {
    @FutureOrPresent(message = "Deadline must be today or in the future")
    LocalDate newDeadline;
}
