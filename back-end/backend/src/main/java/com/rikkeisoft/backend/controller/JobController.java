package com.rikkeisoft.backend.controller;

import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.req.job.JobToggleStatusReq;
import com.rikkeisoft.backend.model.dto.resp.job.JobResp;
import com.rikkeisoft.backend.service.JobService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class JobController {
    JobService jobService;

    /**
     * Toggle job status: OPEN ↔ CLOSED
     * 
     * @param jobId Job ID
     * @param req   Request with optional newDeadline
     * @param jwt   JWT token containing username
     * @return APIResponse with updated JobResp
     */
    @PutMapping("/{id}/toggle-job-status")
 
    public APIResponse<JobResp> toggleJobStatus(
            @PathVariable("id") Long jobId,
            @RequestBody @Valid JobToggleStatusReq req,
            @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        JobResp result = jobService.toggleJobStatus(jobId, req, username);

        return APIResponse.<JobResp>builder()
                .status(HttpStatus.OK)
                .message("Job status updated successfully")
                .result(result)
                .build();
    }
}
