package com.rikkeisoft.backend.controller.application;

import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.req.application.ApplicationCreateReq;
import com.rikkeisoft.backend.model.dto.resp.application.ApplicationDetailResp;
import com.rikkeisoft.backend.model.dto.resp.application.ApplicationResp;
import com.rikkeisoft.backend.service.ApplicationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller managing application endpoints for Candidates.
 * Allows candidates to apply for jobs and view their application history.
 */
@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class CandidateApplicationController {
    ApplicationService applicationService;

    // POST /applications - Apply for a job
    // @PostMapping("/applications")
    // public APIResponse<ApplicationDetailResp> applyForJob(@ModelAttribute
    // ApplicationCreateReq req) {
    // return APIResponse.<ApplicationDetailResp>builder()
    // .result(applicationService.applyForJob(req, /** userid placeholder **/))
    // .build();
    // }

    // GET /candidates/me/applications - View applied jobs
    @GetMapping("/candidates/me/applications")
    public APIResponse<Page<ApplicationResp>> getMyApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        // STEP 1: Extract candidateId từ Security Context (JWT token)
        String candidateId = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        log.info("Candidate {} requesting their applications", candidateId);

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "appliedAt") // ← Sort ở đây
        );
        // STEP 2: Call service
        Page<ApplicationResp> result = applicationService.getMyApplications(
                candidateId,
                pageable);

        // STEP 3: Wrap APIResponse
        return APIResponse.<Page<ApplicationResp>>builder()
                .result(result)
                .build();
    }
}
