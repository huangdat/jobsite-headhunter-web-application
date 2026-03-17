package com.rikkeisoft.backend.model.dto.req.application;

import com.rikkeisoft.backend.enums.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Request payload used by headhunters to change the status of an application.
 */
@Data
public class ApplicationStatusUpdateReq {
    // fetch the Application ID from URL instead
    @NotNull(message = "APPLICATION_STATUS_REQUIRED")
    private ApplicationStatus status;

    private String note;
}
