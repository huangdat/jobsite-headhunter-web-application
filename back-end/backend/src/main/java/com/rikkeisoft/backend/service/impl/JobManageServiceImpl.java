package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.mapper.JobPostMapper;
import com.rikkeisoft.backend.model.dto.req.job.JobPostReq;
import com.rikkeisoft.backend.model.dto.resp.job.JobPostResp;
import com.rikkeisoft.backend.model.entity.Account;
import com.rikkeisoft.backend.model.entity.Job;
import com.rikkeisoft.backend.repository.AccountRepo;
import com.rikkeisoft.backend.repository.JobRepo;
import com.rikkeisoft.backend.service.JobManageService;
import com.rikkeisoft.backend.service.UploadService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.security.SecureRandom;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class JobManageServiceImpl implements JobManageService {
    JobRepo jobRepo;
    JobPostMapper jobPostMapper;
    AccountRepo accountRepo;
    UploadService uploadService;

    static String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    static SecureRandom RANDOM = new SecureRandom();

    @Override
    @PreAuthorize("hasAuthority('SCOPE_ADMIN') or hasAuthority('SCOPE_HEADHUNTER')")
    public JobPostResp createJobPost(JobPostReq jobPostReq) {
        var context = SecurityContextHolder.getContext();
        String contextName = context.getAuthentication().getName();
        Account account = accountRepo.findByUsername(contextName).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        MultipartFile postImage = jobPostReq.getPostImage();
        Job job = Job.builder()
                .jobCode(generateRandomJobCode())
                .headhunter(account)
                .title(jobPostReq.getTitle())
                .description(jobPostReq.getDescription())
                .rankLevel(jobPostReq.getRankLevel())
                .workingType(jobPostReq.getWorkingType())
                .location(jobPostReq.getLocation())
                .addressDetail(jobPostReq.getAddressDetail())
                .experience(jobPostReq.getExperience())
                .salaryMin(jobPostReq.getSalaryMin())
                .salaryMax(jobPostReq.getSalaryMax())
                .negotiable(jobPostReq.isNegotiable())
                .currency(jobPostReq.getCurrency())
                .quantity(jobPostReq.getQuantity())
                .deadline(jobPostReq.getDeadline())
                .status(jobPostReq.getStatus())
                .createdAt(LocalDateTime.now())
                .imageUrl(postImage == null ? "" : uploadService.uploadFile(postImage))
                .build();
        jobRepo.save(job);
        return jobPostMapper.toJobPostResponse(job);
    }

    private String generateRandomJobCode() {
        StringBuilder sb = new StringBuilder(8);
        for (int i = 0; i < 8; i++) {
            sb.append(CHARACTERS.charAt(RANDOM.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }
}
