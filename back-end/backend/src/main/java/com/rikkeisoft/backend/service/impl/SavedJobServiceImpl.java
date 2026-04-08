package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.constant.SecurityConstants;
import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.model.dto.resp.job.SavedJobResp;
import com.rikkeisoft.backend.model.entity.Account;
import com.rikkeisoft.backend.model.entity.BusinessProfile;
import com.rikkeisoft.backend.model.entity.Job;
import com.rikkeisoft.backend.model.entity.SavedJob;
import com.rikkeisoft.backend.repository.AccountRepo;
import com.rikkeisoft.backend.repository.JobRepo;
import com.rikkeisoft.backend.repository.SavedJobRepo;
import com.rikkeisoft.backend.service.SavedJobService;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class SavedJobServiceImpl implements SavedJobService {
    SavedJobRepo savedJobRepo;
    JobRepo jobRepo;
    AccountRepo accountRepo;

    @Override
    @PreAuthorize(SecurityConstants.CANDIDATE)
    public void saveJob(Long jobId, String username) {
        Account account = accountRepo.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
        Job job = jobRepo.findById(jobId)
                .orElseThrow(() -> new AppException(ErrorCode.JOB_NOT_FOUND));

        if (savedJobRepo.existsByJobIdAndCandidateId(jobId, account.getId())) {
            return;
        }

        SavedJob savedJob = SavedJob.builder()
                .candidate(account)
                .job(job)
                .createdAt(LocalDateTime.now())
                .build();
        savedJobRepo.save(savedJob);
    }

    @Override
    @PreAuthorize(SecurityConstants.CANDIDATE)
        @Transactional
        public void removeSavedJob(Long jobId, String username) {
        Account account = accountRepo.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
        savedJobRepo.deleteByJobIdAndCandidateId(jobId, account.getId());
    }

    @Override
    @PreAuthorize(SecurityConstants.CANDIDATE)
    public List<SavedJobResp> getSavedJobs(String username) {
        Account account = accountRepo.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        List<SavedJob> savedJobs = savedJobRepo.findByCandidateIdOrderByCreatedAtDesc(account.getId());
        List<SavedJobResp> responses = new ArrayList<>();
        for (SavedJob savedJob : savedJobs) {
            Job job = savedJob.getJob();
            BusinessProfile businessProfile = job.getHeadhunter() != null
                    ? job.getHeadhunter().getBusinessProfile()
                    : null;

            responses.add(SavedJobResp.builder()
                    .jobId(job.getId())
                    .title(job.getTitle())
                    .companyName(businessProfile != null ? businessProfile.getCompanyName() : null)
                    .location(job.getLocation())
                    .salaryMin(job.getSalaryMin())
                    .salaryMax(job.getSalaryMax())
                    .currency(job.getCurrency() != null ? job.getCurrency().name() : null)
                    .postedDate(job.getCreatedAt())
                    .status(job.getStatus())
                    .build());
        }
        return responses;
    }
}
