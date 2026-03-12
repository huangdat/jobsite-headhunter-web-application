package com.rikkeisoft.backend.service.impl;

import java.time.LocalDate;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.enums.JobStatus;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.mapper.JobMapper;
import com.rikkeisoft.backend.model.dto.req.job.JobToggleStatusReq;
import com.rikkeisoft.backend.model.dto.resp.job.JobResp;
import com.rikkeisoft.backend.model.entity.Account;
import com.rikkeisoft.backend.model.entity.Job;
import com.rikkeisoft.backend.repository.AccountRepo;
import com.rikkeisoft.backend.repository.JobRepo;
import com.rikkeisoft.backend.service.JobService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class JobServiceImpl implements JobService {
    JobRepo jobRepo;
    AccountRepo accountRepo;
    JobMapper jobMapper;

    @Override
    @PreAuthorize("hasAuthority('SCOPE_HEADHUNTER') or hasAuthority('SCOPE_ADMIN')")
    public JobResp toggleJobStatus(Long jobId, JobToggleStatusReq req, String currentUsername) {
        // Step 1: Fetch job by ID
        Job job = jobRepo.findById(jobId)
                .orElseThrow(() -> new AppException(ErrorCode.JOB_NOT_FOUND));

        // Step 2: Validate deadline (expired check)
        if (job.getStatus() == JobStatus.OPEN && job.getDeadline() != null
                && job.getDeadline().isBefore(LocalDate.now())) {
            throw new AppException(ErrorCode.JOB_EXPIRED);
        }

        // Step 3: Ownership check (headhunter + admin)
        Account currentAccount = accountRepo.findByUsername(currentUsername)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        boolean isOwner = job.getHeadhunter().getId().equals(currentAccount.getId());
        boolean isAdmin = currentAccount.getRoles() != null
                && currentAccount.getRoles().contains("ADMIN");

        if (!isOwner && !isAdmin) {
            throw new AppException(ErrorCode.UNAUTHORIZED_ACTION);
        }

        // Step 4: Validate status and apply transition logic
        JobStatus currentStatus = job.getStatus();

        if (currentStatus == JobStatus.DRAFT) {
            throw new AppException(ErrorCode.JOB_INVALID_STATUS_TRANSITION);
        }

        if (currentStatus == JobStatus.OPEN) {
            // Transition: OPEN → CLOSED
            job.setStatus(JobStatus.CLOSED);
            log.info("Job {} toggled from OPEN to CLOSED by user {}", jobId, currentUsername);
        } else if (currentStatus == JobStatus.CLOSED) {
            // Transition: CLOSED → OPEN (requires new deadline)

            // Check if newDeadline is provided
            if (req.getNewDeadline() == null) {
                throw new AppException(ErrorCode.NEW_DEADLINE_REQUIRED); 
            }

            // Check if deadline is in the future
            if (req.getNewDeadline().isBefore(LocalDate.now())
                    || req.getNewDeadline().isEqual(LocalDate.now())) {
                throw new AppException(ErrorCode.INVALID_DEADLINE);
            }
            job.setStatus(JobStatus.OPEN);
            job.setDeadline(req.getNewDeadline());
            log.info("Job {} reopened with new deadline {} by user {}", jobId, req.getNewDeadline(), currentUsername);
        }
        // Step 5: Persist and return
        Job updatedJob = jobRepo.save(job);
        return jobMapper.toJobResp(updatedJob);

    }

}
