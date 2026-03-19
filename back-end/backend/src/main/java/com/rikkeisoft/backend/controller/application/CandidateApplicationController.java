package com.rikkeisoft.backend.controller.application;

import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.req.application.ApplicationCreateReq;
import com.rikkeisoft.backend.model.dto.resp.application.ApplicationDetailResp;
import com.rikkeisoft.backend.model.dto.resp.application.ApplicationResp;
import com.rikkeisoft.backend.model.entity.Account;
import com.rikkeisoft.backend.repository.AccountRepo;
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
        AccountRepo accountRepo;
        // POST /applications - Apply for a job

        @PostMapping("/applications")
        public APIResponse<ApplicationDetailResp> applyForJob(@ModelAttribute ApplicationCreateReq req) {
                return APIResponse.<ApplicationDetailResp>builder()
                                .result(applicationService.applyForJob(req))
                                .build();
        }

        // GET /candidates/me/applications - View applied jobs
        @GetMapping("/candidates/me/applications")
        public APIResponse<Page<ApplicationResp>> getMyApplications(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size) {

              
                JwtAuthenticationToken auth = (JwtAuthenticationToken) SecurityContextHolder.getContext()
                                .getAuthentication();
                String username = auth.getToken().getSubject();

               

               
                Account account = accountRepo.findByUsername(username)
                                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

                String candidateId = account.getId(); 

                // STEP 3: Tạo Pageable và query
                Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "appliedAt");

                return APIResponse.<Page<ApplicationResp>>builder()
                                .result(applicationService.getMyApplications(candidateId, pageable))
                                .build();
        }
}
