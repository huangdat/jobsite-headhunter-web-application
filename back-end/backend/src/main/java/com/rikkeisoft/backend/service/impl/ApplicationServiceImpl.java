package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.mapper.ApplicationMapper;
import com.rikkeisoft.backend.model.dto.req.application.ApplicationCreateReq;
import com.rikkeisoft.backend.model.dto.req.application.ApplicationStatusUpdateReq;
import com.rikkeisoft.backend.model.dto.resp.application.ApplicationDetailResp;
import com.rikkeisoft.backend.model.dto.resp.application.ApplicationResp;
import com.rikkeisoft.backend.model.entity.Application;
import com.rikkeisoft.backend.repository.ApplicationRepo;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
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
    AccountRepo accountRepo;

    ApplicationRepo applicationRepo;
    ApplicationMapper applicationMapper;

    @Override
    public ApplicationDetailResp applyForJob(ApplicationCreateReq req) {
        // get Candidate id to put into ApplicationDetailResp

        return null;
    }

    @Override

    @PreAuthorize("hasAnyAuthority( 'SCOPE_CANDIDATE')")
    public Page<ApplicationResp> getMyApplications(String candidateId, Pageable pageable) {
        // STEP 1: Validate candidateId
        if (candidateId == null || candidateId.isEmpty()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

      
        Page<Application> applicationPage = applicationRepo.findAllByCandidate_Id(
                candidateId,
                pageable);

        // STEP 4: Map Entity → DTO
        // MapStruct tự động map snapshot fields
        Page<ApplicationResp> result = applicationPage.map(application -> {
            ApplicationResp resp = applicationMapper.toResponse(application);

            // Lazy load job title từ Job entity
            if (application.getJob() != null) {
                resp.setJobTitle(application.getJob().getTitle());
            }

            return resp;
        });

        return result;

    }
    @Override
    public Page<ApplicationResp> getJobPipeline(Long jobId, Pageable pageable) {
        // get Candidate id to put into ApplicationDetailResp
        return null;
    }

    @Override
    public ApplicationDetailResp getApplicationDetail(Long applicationId) {
        // get Candidate id to put into ApplicationDetailResp
        return null;
    }

    @Override
    public ApplicationDetailResp updateStatus(Long applicationId, ApplicationStatusUpdateReq req) {
        // get Candidate id to put into ApplicationDetailResp
        return null;
    }

}
