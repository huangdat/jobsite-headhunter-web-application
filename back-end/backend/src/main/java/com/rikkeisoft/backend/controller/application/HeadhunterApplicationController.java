package com.rikkeisoft.backend.controller.application;

import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.req.application.ApplicationStatusUpdateReq;
import com.rikkeisoft.backend.model.dto.req.interview.InterviewCreateReq;
import com.rikkeisoft.backend.model.dto.resp.application.ApplicationDetailResp;
import com.rikkeisoft.backend.model.dto.resp.application.ApplicationResp;
import com.rikkeisoft.backend.model.dto.resp.interview.InterviewResp;
import com.rikkeisoft.backend.service.ApplicationService;
import com.rikkeisoft.backend.service.InterviewService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.rikkeisoft.backend.enums.ApplicationStatus;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller managing application endpoints for Headhunters.
 * Provides APIs for pipeline tracking, application review, and status updates.
 */
@RestController
@RequestMapping("/api/headhunter")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class HeadhunterApplicationController {
    ApplicationService applicationService;
    InterviewService interviewService;

    // GET /jobs/{jobId}/applications - Pipeline view
    @GetMapping("/jobs/{jobId}/applications")
    public APIResponse<Page<ApplicationResp>> getJobPipeline(
            @PathVariable Long jobId,
            @RequestParam(name = "status", required = false) ApplicationStatus status,
            @RequestParam(name = "keyword", required = false) String keyword,
            @org.springframework.data.web.PageableDefault(size = 10) Pageable pageable) {

        return APIResponse.<Page<ApplicationResp>>builder()
                .result(applicationService.getJobPipeline(jobId, status, keyword, pageable))
                .build();
    }

    // GET /applications/{id} - View application details
    @GetMapping("/applications/{id}")
    public APIResponse<ApplicationDetailResp> getApplicationDetail(@PathVariable Long id) {
        return APIResponse.<ApplicationDetailResp>builder()
                .result(applicationService.getApplicationDetail(id))
                .build();
    }

    // PATCH /applications/{id}/status - Approve/Reject/Hire
    @PatchMapping("/applications/{id}/status")
    public APIResponse<ApplicationDetailResp> updateStatus(@PathVariable Long id,@Valid @RequestBody ApplicationStatusUpdateReq req) {
        return APIResponse.<ApplicationDetailResp>builder()
                .result(applicationService.updateStatus(id, req))
                .build();
    }

    // PATCH /applications/{id}/interview - Schedule interview
    @PatchMapping("/applications/{id}/interview")
    public APIResponse<InterviewResp> scheduleInterview(@PathVariable Long id, @RequestBody InterviewCreateReq req) {
        return APIResponse.<InterviewResp>builder()
                .result(interviewService.scheduleInterview(req))
                .build();
    }
}
