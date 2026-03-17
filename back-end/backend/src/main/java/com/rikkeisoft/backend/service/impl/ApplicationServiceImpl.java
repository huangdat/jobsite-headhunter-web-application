package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.model.dto.req.application.ApplicationCreateReq;
import com.rikkeisoft.backend.model.dto.req.application.ApplicationStatusUpdateReq;
import com.rikkeisoft.backend.model.dto.resp.application.ApplicationDetailResp;
import com.rikkeisoft.backend.model.dto.resp.application.ApplicationResp;
import com.rikkeisoft.backend.service.ApplicationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)

/**
 * Service implement handling business logic for job applications.
 * Includes applying for jobs, fetching pipelines, and updating statuses.
 */
public class ApplicationServiceImpl implements ApplicationService {

    @Override
    public ApplicationDetailResp applyForJob(ApplicationCreateReq req, String candidateId) {
        return null;
    }

    @Override
    public Page<ApplicationResp> getMyApplications(String candidateId, Pageable pageable) {
        return null;
    }

    @Override
    public Page<ApplicationResp> getJobPipeline(Long jobId, Pageable pageable) {
        return null;
    }

    @Override
    public ApplicationDetailResp getApplicationDetail(Long id) {
        return null;
    }

    @Override
    public ApplicationDetailResp updateStatus(Long id, ApplicationStatusUpdateReq req) {
        return null;
    }
}
