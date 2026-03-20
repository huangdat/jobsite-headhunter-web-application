package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.enums.ApplicationStatus;
import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.enums.JobStatus;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.mapper.ApplicationMapper;
import com.rikkeisoft.backend.model.dto.req.application.ApplicationCreateReq;
import com.rikkeisoft.backend.model.dto.req.application.ApplicationStatusUpdateReq;
import com.rikkeisoft.backend.model.dto.resp.application.ApplicationDetailResp;
import com.rikkeisoft.backend.model.dto.resp.application.ApplicationResp;
import com.rikkeisoft.backend.model.entity.Application;
import com.rikkeisoft.backend.repository.ApplicationRepo;
import com.rikkeisoft.backend.model.entity.Account;
import com.rikkeisoft.backend.model.entity.Application;
import com.rikkeisoft.backend.model.entity.CandidateCv;
import com.rikkeisoft.backend.model.entity.Job;
import com.rikkeisoft.backend.repository.AccountRepo;
import com.rikkeisoft.backend.repository.ApplicationRepo;
import com.rikkeisoft.backend.repository.CandidateCvRepo;
import com.rikkeisoft.backend.repository.JobRepo;
import com.rikkeisoft.backend.service.ApplicationService;
import jakarta.transaction.Transactional;
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
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

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

    JobRepo jobRepo;

    CandidateCvRepo candidateCvRepo;

    ApplicationRepo applicationRepo;
    ApplicationMapper applicationMapper;

    @Override
    @PreAuthorize("hasAuthority('SCOPE_CANDIDATE')")
    @Transactional
    public ApplicationDetailResp applyForJob(Long jobId, ApplicationCreateReq applicationCreateReq) {
        // get Candidate id to put into ApplicationDetailResp
        var context = SecurityContextHolder.getContext();
        String contextName = context.getAuthentication().getName();
        Account account = accountRepo.findByUsername(contextName)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));

        // AC3 - check if candidate already applied to this job
        if (applicationRepo.existsByJobIdAndCandidateId(jobId, account.getId())) {
            throw new AppException(ErrorCode.APPLICATION_ALREADY_EXISTS);
        }

        Job job = jobRepo.findById(jobId).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        // AC2 - check if Job status still accept application
        if (!job.getStatus().equals(JobStatus.OPEN)) {
            throw new AppException(ErrorCode.JOB_NOT_OPEN);
        }

        // Fetch the candidate's CV from the repository
        // AC6 - check if profile has any CV
        String finalCvUrl = candidateCvRepo.findByCandidate_Id(account.getId())
                .map(CandidateCv::getCvUrl)
                .orElseThrow(() -> new AppException(ErrorCode.APPLICATION_CV_REQUIRED));

        Application application = Application.builder()
                .job(job)
                .candidate(account)
                // .collaborator() // No logic to handle collaborator yet
                .cvSnapshotUrl(finalCvUrl)
                .coverLetter(applicationCreateReq.getCoverLetter())
                .fullName(applicationCreateReq.getFullName())
                .email(applicationCreateReq.getEmail())
                .phone(applicationCreateReq.getPhone())
                .salaryExpectation(applicationCreateReq.getSalaryExpectation())
                .status(ApplicationStatus.APPLIED)
                .appliedAt(LocalDateTime.now())
                .build();

        // Save first to generate the ID, then map to response
        application = applicationRepo.save(application);
        return applicationMapper.toDetailResponse(application);
    }

    @Override

    @PreAuthorize("hasAnyAuthority( 'SCOPE_CANDIDATE')")
    public Page<ApplicationResp> getMyApplications(Pageable pageable, ApplicationStatus status) {

        JwtAuthenticationToken auth = (JwtAuthenticationToken) SecurityContextHolder.getContext()
                .getAuthentication();
        String username = auth.getToken().getSubject();

        Account account = accountRepo.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        String candidateId = account.getId();
        Page<Application> applicationPage;
        if (status != null) {
            applicationPage = applicationRepo.findByCandidate_IdAndStatus(candidateId, status, pageable);
        } else {
            applicationPage = applicationRepo.findAllByCandidate_Id(candidateId, pageable);
        }

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
