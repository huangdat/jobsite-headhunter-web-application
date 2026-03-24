package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.enums.ApplicationStatus;
import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.mapper.ApplicationMapper;
import com.rikkeisoft.backend.model.dto.req.application.ApplicationCreateReq;
import com.rikkeisoft.backend.model.dto.req.application.ApplicationStatusUpdateReq;
import com.rikkeisoft.backend.model.dto.req.otp.SendNormalEmailReq;
import com.rikkeisoft.backend.model.dto.resp.application.ApplicationDetailResp;
import com.rikkeisoft.backend.model.dto.resp.application.ApplicationResp;
import com.rikkeisoft.backend.model.entity.Account;
import com.rikkeisoft.backend.model.entity.Application;
import com.rikkeisoft.backend.repository.ApplicationRepo;
import com.rikkeisoft.backend.model.entity.Account;
import com.rikkeisoft.backend.model.entity.CandidateCv;
import com.rikkeisoft.backend.model.entity.Job;
import com.rikkeisoft.backend.enums.JobStatus;
import com.rikkeisoft.backend.repository.AccountRepo;
import com.rikkeisoft.backend.repository.CandidateCvRepo;
import com.rikkeisoft.backend.repository.JobRepo;
import com.rikkeisoft.backend.service.AccountService;
import com.rikkeisoft.backend.service.ApplicationService;
import jakarta.transaction.Transactional;
import com.rikkeisoft.backend.service.OtpService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;
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
    AccountService accountService;
    JobRepo jobRepo;
    CandidateCvRepo candidateCvRepo;
    ApplicationRepo applicationRepo;
    ApplicationMapper applicationMapper;
    OtpService otpService;

    private static final Map<ApplicationStatus, Set<ApplicationStatus>> ALLOWED_TRANSITIONS = Map.of(
            ApplicationStatus.APPLIED,
            Set.of(ApplicationStatus.SCREENING, ApplicationStatus.REJECTED, ApplicationStatus.CANCELLED),
            ApplicationStatus.SCREENING,
            Set.of(ApplicationStatus.REJECTED, ApplicationStatus.PASSED, ApplicationStatus.INTERVIEW,
                    ApplicationStatus.CANCELLED),
            ApplicationStatus.INTERVIEW,
            Set.of(ApplicationStatus.REJECTED, ApplicationStatus.PASSED, ApplicationStatus.CANCELLED),
            ApplicationStatus.PASSED, Set.of(),
            ApplicationStatus.REJECTED, Set.of(),
            ApplicationStatus.CANCELLED, Set.of());

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
        public Page<ApplicationResp> getJobPipeline(Long jobId, ApplicationStatus status, String keyword, Pageable pageable) {
        Account currentAccount = accountService.getCurrentAccount();
        Job job = jobRepo.findById(jobId)
            .orElseThrow(() -> new AppException(ErrorCode.JOB_NOT_FOUND));

        checkPermissions(currentAccount, job);

        // If client didn't provide a sort, default to appliedAt desc
        if (pageable.getSort().isUnsorted()) {
            pageable = org.springframework.data.domain.PageRequest.of(
                pageable.getPageNumber(), pageable.getPageSize(), org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "appliedAt")
            );
        }

        Page<Application> page = applicationRepo.searchByJobIdAndOptionalStatusAndKeyword(jobId, status, (keyword == null || keyword.isBlank()) ? null : keyword.trim(), pageable);

        return page.map(applicationMapper::toResponse);
        }

    @Override
    public ApplicationDetailResp getApplicationDetail(Long applicationId) {
        Account currentAccount = accountService.getCurrentAccount();
        Application application = applicationRepo.findById(applicationId)
                .orElseThrow(() -> new AppException(ErrorCode.APPLICATION_NOT_FOUND));

        checkPermissions(currentAccount, application.getJob());
        return applicationMapper.toDetailResponse(application);
    }

    @Override
    public ApplicationDetailResp updateStatus(Long applicationId, ApplicationStatusUpdateReq req) {
        Account currentAccount = accountService.getCurrentAccount();
        Application application = applicationRepo.findById(applicationId)
                .orElseThrow(() -> new AppException(ErrorCode.APPLICATION_NOT_FOUND));

        checkPermissions(currentAccount, application.getJob());
        validateStatusTransition(application.getStatus(), req.getStatus());

        application.setStatus(req.getStatus());
        applicationRepo.save(application);

        sendStatusUpdateEmail(application, req.getStatus());

        return applicationMapper.toDetailResponse(application);
    }

    private void checkPermissions(Account account, Job job) {
        boolean isAdmin = account.getRoles().contains("ADMIN");
        boolean isJobOwner = job.getHeadhunter().getId().equals(account.getId());
        if (!isAdmin && !isJobOwner) {
            throw new AppException(ErrorCode.UNAUTHORIZED_ACTION);
        }
    }

    private void validateStatusTransition(ApplicationStatus current, ApplicationStatus target) {
        Set<ApplicationStatus> allowed = ALLOWED_TRANSITIONS.get(current);
        if (allowed == null || !allowed.contains(target)) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }
    }

    private void sendStatusUpdateEmail(Application application, ApplicationStatus newStatus) {
        try {
            Job job = application.getJob();
            otpService.sendNormalEmail(SendNormalEmailReq.builder()
                    .email(application.getEmail())
                    .subject("Cập nhật trạng thái ứng tuyển - " + job.getTitle())
                    .content("""
                            Xin chào %s,
                            Đơn ứng tuyển của bạn cho vị trí "%s" đã được cập nhật.
                            Trạng thái mới: %s

                            Vui lòng đăng nhập hệ thống để xem chi tiết.

                            Trân trọng,
                            Đội ngũ tuyển dụng HeadHunt
                            """.formatted(application.getFullName(), job.getTitle(), newStatus.name()))
                    .build());
        } catch (Exception e) {
            log.warn("Failed to send status update email for application {}: {}",
                    application.getId(), e.getMessage());
        }
    }

}
