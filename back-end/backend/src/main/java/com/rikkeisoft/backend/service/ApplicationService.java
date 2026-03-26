package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.enums.ApplicationStatus;
import com.rikkeisoft.backend.model.dto.req.application.ApplicationCreateReq;
import com.rikkeisoft.backend.model.dto.req.application.ApplicationStatusUpdateReq;
import com.rikkeisoft.backend.model.dto.resp.application.ApplicationDetailResp;
import com.rikkeisoft.backend.model.dto.resp.application.ApplicationResp;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface handling business logic for job applications.
 * Includes applying for jobs, fetching pipelines, and updating statuses.
 */
public interface ApplicationService {
    // Candidate features
    ApplicationDetailResp applyForJob(Long jobId, ApplicationCreateReq req);

    Page<ApplicationResp> getMyApplications(Pageable pageable, ApplicationStatus status);

    // Headhunter features
    Page<ApplicationResp> getJobPipeline(Long jobId, ApplicationStatus status, String keyword, Pageable pageable);

    ApplicationDetailResp getApplicationDetail(Long applicationId);

    // Status update (Includes logic for hiding profile and triggering commission if
    // PASSED)
    ApplicationDetailResp updateStatus(Long applicationId, ApplicationStatusUpdateReq req);
}
