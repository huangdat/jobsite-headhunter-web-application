package com.rikkeisoft.backend.controller.application;

import com.rikkeisoft.backend.enums.ApplicationSortField;
import com.rikkeisoft.backend.enums.ApplicationStatus;
import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.req.application.ApplicationCreateReq;
import com.rikkeisoft.backend.model.dto.resp.application.ApplicationDetailResp;
import com.rikkeisoft.backend.model.dto.resp.application.ApplicationResp;
import com.rikkeisoft.backend.model.entity.Account;
import com.rikkeisoft.backend.repository.AccountRepo;
import com.rikkeisoft.backend.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
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
        @PostMapping("/jobs/{jobId}/applications")
        public APIResponse<ApplicationDetailResp> applyForJob(@PathVariable Long jobId,
                        @ModelAttribute @Valid ApplicationCreateReq req) {
                return APIResponse.<ApplicationDetailResp>builder()
                                .status(HttpStatus.OK)
                                .result(applicationService.applyForJob(jobId, req))
                                .build();
        }

        // GET /candidates/me/applications - View applied jobs
        @GetMapping("/candidates/me/applications")
        public APIResponse<Page<ApplicationResp>> getMyApplications(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size,
                        @RequestParam(defaultValue = "APPLIED_AT") ApplicationSortField sortBy,
                        @RequestParam(defaultValue = "DESC") Sort.Direction direction,
                        @RequestParam(required = false) ApplicationStatus status) {

                // STEP 3: Tạo Pageable và query
                Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy.getFieldName()));

                return APIResponse.<Page<ApplicationResp>>builder()
                                .result(applicationService.getMyApplications(pageable, status))
                                .build();
        }
}
