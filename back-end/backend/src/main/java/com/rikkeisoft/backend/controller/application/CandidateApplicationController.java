package com.rikkeisoft.backend.controller.application;

import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.req.application.ApplicationCreateReq;
import com.rikkeisoft.backend.model.dto.resp.application.ApplicationDetailResp;
import com.rikkeisoft.backend.model.dto.resp.application.ApplicationResp;
import com.rikkeisoft.backend.service.ApplicationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller managing application endpoints for Candidates.
 * Allows candidates to apply for jobs and view their application history.
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class CandidateApplicationController {
    ApplicationService applicationService;

//    // POST /applications - Apply for a job
//    @PostMapping("/applications")
//    public APIResponse<ApplicationDetailResp> applyForJob(@ModelAttribute ApplicationCreateReq req) {
//        return APIResponse.<ApplicationDetailResp>builder()
//                .result(applicationService.applyForJob(req, /** userid placeholder **/))
//                .build();
//    }
//
//    // GET /candidates/me/applications - View applied jobs
//    @GetMapping("/candidates/me/applications")
//    public APIResponse<Page<ApplicationResp>> getMyApplications(Pageable pageable) {
//        return APIResponse.<Page<ApplicationResp>>builder()
//                .result(applicationService.getMyApplications(/** userid placeholder **/, pageable))
//                .build();
//    }
}
