package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.mapper.JobMapper;
import com.rikkeisoft.backend.model.dto.req.job.JobReq;
import com.rikkeisoft.backend.model.dto.req.job.JobRecommendationItemReq;
import com.rikkeisoft.backend.model.dto.req.job.JobToggleStatusReq;
import com.rikkeisoft.backend.model.dto.resp.job.JobDetailResp;
import com.rikkeisoft.backend.model.dto.resp.job.JobResp;
import com.rikkeisoft.backend.model.dto.resp.job.RecommendationResp;
import com.rikkeisoft.backend.model.entity.Account;
import com.rikkeisoft.backend.model.entity.AccountSkill;
import com.rikkeisoft.backend.model.entity.Job;
import com.rikkeisoft.backend.model.entity.JobSkill;
import com.rikkeisoft.backend.model.entity.Skill;
import com.rikkeisoft.backend.repository.AccountRepo;
import com.rikkeisoft.backend.repository.AccountSkillRepo;
import com.rikkeisoft.backend.repository.JobRepo;
import com.rikkeisoft.backend.repository.JobSkillRepo;
import com.rikkeisoft.backend.repository.SkillRepo;
import com.rikkeisoft.backend.enums.JobStatus;
import com.rikkeisoft.backend.enums.RecommendationMode;
import com.rikkeisoft.backend.service.JobManageService;
import com.rikkeisoft.backend.service.UploadService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class JobManageServiceImpl implements JobManageService {
    JobRepo jobRepo;
    AccountRepo accountRepo;
    UploadService uploadService;
    JobSkillRepo jobSkillRepo;
    SkillRepo skillRepo;
    JobMapper jobMapper;

    AccountSkillRepo accountSkillRepo;
    // JobSkillRepo jobSkillRepo;

    static String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    static SecureRandom RANDOM = new SecureRandom();

    static int LATEST_POOL_SIZE = 20;

    static String MSG_SUCCESS = "The job application was successful.";
    static String MSG_NO_CANDIDATE_SKILLS = "Please update your skills to receive better recommendations.";
    static String MSG_NO_MATCHED_JOBS = "No job is a perfect fit for your skills.";
    static String MSG_NO_OPEN_JOBS = "The system currently has no job postings.";

    @Override
    @PreAuthorize("hasAuthority('SCOPE_ADMIN') or hasAuthority('SCOPE_HEADHUNTER')")
    public JobDetailResp createJobPost(JobReq jobReq) {
        var context = SecurityContextHolder.getContext();
        String contextName = context.getAuthentication().getName();
        Account account = accountRepo.findByUsername(contextName)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));
        MultipartFile postImage = jobReq.getPostImage();
        Job job = Job.builder()
                .jobCode(generateRandomJobCode())
                .headhunter(account)
                .title(jobReq.getTitle())
                .description(jobReq.getDescription())
                .responsibilities(jobReq.getResponsibilities())
                .requirements(jobReq.getRequirements())
                .benefits(jobReq.getBenefits())
                .workingTime(jobReq.getWorkingTime())
                .rankLevel(jobReq.getRankLevel())
                .workingType(jobReq.getWorkingType())
                .location(jobReq.getLocation())
                .addressDetail(jobReq.getAddressDetail())
                .experience(jobReq.getExperience())
                .salaryMin(jobReq.getSalaryMin())
                .salaryMax(jobReq.getSalaryMax())
                .negotiable(Boolean.TRUE.equals(jobReq.getNegotiable()))
                .currency(jobReq.getCurrency())
                .quantity(jobReq.getQuantity())
                .deadline(jobReq.getDeadline())
                .status(jobReq.getStatus())
                .createdAt(LocalDateTime.now())
                .imageUrl(postImage == null ? "" : uploadService.uploadFile(postImage))
                .build();
        Job savedJob = jobRepo.save(job);

        List<JobSkill> updatedJobSkillsList = new ArrayList<>();
        List<Long> requestedSkillIds = jobReq.getSkillIds();
        if (requestedSkillIds != null && !requestedSkillIds.isEmpty()) {
            Set<Long> uniqueSkillIds = new LinkedHashSet<>(requestedSkillIds);
            for (Long skillId : uniqueSkillIds) {
                Skill skill = skillRepo.findById(skillId)
                        .orElseThrow(() -> new AppException(ErrorCode.JOB_SKILL_IDS_INVALID));
                updatedJobSkillsList.add(JobSkill.builder()
                        .job(savedJob)
                        .skill(skill)
                        .build());
            }
            jobSkillRepo.saveAll(updatedJobSkillsList);
        }

        JobDetailResp jobDetailResp = jobMapper.toJobDetailResp(savedJob);
        jobDetailResp.setSkills(updatedJobSkillsList.stream()
                .map(jobMapper::toJobSkillResp)
                .collect(Collectors.toList()));
        return jobDetailResp;
    }

    @PreAuthorize("hasAuthority('SCOPE_ADMIN') or hasAuthority('SCOPE_HEADHUNTER')")
    @Transactional
    public JobDetailResp updateJobPost(Long jobId, JobReq jobReq){
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        Account account = accountRepo.findByUsername(authentication.getName())
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));

        Job job = jobRepo.findById(jobId).orElseThrow(() -> new AppException(ErrorCode.JOB_NOT_FOUND));

        boolean isHeadhunter = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("SCOPE_HEADHUNTER"));

        if(isHeadhunter && !account.getId().equals(job.getHeadhunter().getId())){
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        // update job post
        jobMapper.updateJobFromRequest(jobReq, job);

        // Update Job Skills if provided
        List<JobSkill> updatedJobSkills = new ArrayList<>();
        List<Long> requestedSkillIds = jobReq.getSkillIds();

        if (requestedSkillIds != null) {
            // Delete existing skills
            jobSkillRepo.deleteByJobId(jobId);

            if (!requestedSkillIds.isEmpty()) {
                Set<Long> uniqueSkillIds = new LinkedHashSet<>(requestedSkillIds);
                for (Long skillId : uniqueSkillIds) {
                    Skill skill = skillRepo.findById(skillId)
                            .orElseThrow(() -> new AppException(ErrorCode.JOB_SKILL_IDS_INVALID));
                    updatedJobSkills.add(JobSkill.builder()
                            .job(job)
                            .skill(skill)
                            .build());
                }
                jobSkillRepo.saveAll(updatedJobSkills);
            }
        } else {
            // If skillIds is null (not provided in request), retain existing skills
            updatedJobSkills = jobSkillRepo.findByJobId(jobId);
        }

        JobDetailResp resp = jobMapper.toJobDetailResp(job);
        resp.setSkills(updatedJobSkills.stream()
                .map(jobMapper::toJobSkillResp)
                .collect(Collectors.toList()));
        return resp;
    }

    private String generateRandomJobCode() {
        StringBuilder sb = new StringBuilder(8);
        for (int i = 0; i < 8; i++) {
            sb.append(CHARACTERS.charAt(RANDOM.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }

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

    // recommendation job by skill
    @Override
    @PreAuthorize("hasAuthority('SCOPE_CANDIDATE')")
    public RecommendationResp getRecommendedJobs(String username) {
        Account account = accountRepo.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        List<Job> openJobs = getOpenActiveJobs();
        if (openJobs.isEmpty()) {
            return RecommendationResp.builder()
                    .mode(RecommendationMode.MODE_NO_OPEN_JOBS.name())
                    .fallbackApplied(false)
                    .message(MSG_NO_OPEN_JOBS)
                    .total(0)
                    .jobs(Collections.emptyList())
                    .build();
        }

        List<AccountSkill> accountSkills = accountSkillRepo.findByAccountId(account.getId());
        if (accountSkills == null || accountSkills.isEmpty()) {
            return buildFallbackResponse(MSG_NO_CANDIDATE_SKILLS);
        }

        Set<Long> candidateSkillIds = accountSkills.stream()
                .map(AccountSkill::getSkill)
                .filter(Objects::nonNull)
                .map(skill -> skill.getId())
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        if (candidateSkillIds.isEmpty()) {
            return buildFallbackResponse(MSG_NO_CANDIDATE_SKILLS);
        }

        List<Long> openJobIds = openJobs.stream()
                .map(Job::getId)
                .filter(Objects::nonNull)
                .toList();

        Map<Long, List<JobSkill>> jobSkillsByJobId = getJobSkillsByJobIds(openJobIds);

        List<JobRecommendationItemReq> matchedJobs = new ArrayList<>();
        for (Job job : openJobs) {
            List<JobSkill> jobSkills = jobSkillsByJobId.getOrDefault(job.getId(), Collections.emptyList());

            Set<Long> jobSkillIds = jobSkills.stream()
                    .map(JobSkill::getSkill)
                    .filter(Objects::nonNull)
                    .map(skill -> skill.getId())
                    .filter(Objects::nonNull)
                    .collect(Collectors.toSet());

            int totalRequiredSkills = jobSkillIds.size();
            int matchedSkillCount = (int) jobSkillIds.stream().filter(candidateSkillIds::contains).count();

            if (matchedSkillCount <= 0) {
                continue;
            }

            int matchScore = calculateMatchScore(matchedSkillCount, totalRequiredSkills);

            List<String> requiredSkillNames = jobSkills.stream()
                    .map(JobSkill::getSkill)
                    .filter(Objects::nonNull)
                    .map(skill -> skill.getName())
                    .filter(Objects::nonNull)
                    .distinct()
                    .collect(Collectors.toList());

            List<String> matchedSkillNames = jobSkills.stream()
                    .map(JobSkill::getSkill)
                    .filter(Objects::nonNull)
                    .filter(skill -> skill.getId() != null && candidateSkillIds.contains(skill.getId()))
                    .map(skill -> skill.getName())
                    .filter(Objects::nonNull)
                    .distinct()
                    .collect(Collectors.toList());

            JobRecommendationItemReq item = mapToRecommendationItem(
                    job,
                    totalRequiredSkills,
                    matchedSkillCount,
                    matchScore,
                    requiredSkillNames,
                    matchedSkillNames);
            matchedJobs.add(item);
        }

        if (matchedJobs.isEmpty()) {
            return buildFallbackResponse(MSG_NO_MATCHED_JOBS);
        }

        matchedJobs.sort(
                Comparator
                        .comparing(JobRecommendationItemReq::getMatchScore,
                                Comparator.nullsLast(Comparator.reverseOrder()))
                        .thenComparing(JobRecommendationItemReq::getMatchedSkills,
                                Comparator.nullsLast(Comparator.reverseOrder()))
                        .thenComparing(JobRecommendationItemReq::getCreatedAt,
                                Comparator.nullsLast(Comparator.reverseOrder())));

        return RecommendationResp.builder()
                .mode(RecommendationMode.MODE_RECOMMENDED.name())
                .fallbackApplied(false)
                .message(MSG_SUCCESS)
                .total(matchedJobs.size())
                .jobs(matchedJobs)
                .build();
    }

    @Override
    public RecommendationResp getRandomLatestJobs() {
        List<JobRecommendationItemReq> randomLatest = pickRandomLatestFromLatestPool();

        if (randomLatest.isEmpty()) {
            return RecommendationResp.builder()
                    .mode(RecommendationMode.MODE_NO_OPEN_JOBS.name())
                    .fallbackApplied(false)
                    .message(MSG_NO_OPEN_JOBS)
                    .total(0)
                    .jobs(Collections.emptyList())
                    .build();
        }

        return RecommendationResp.builder()
                .mode(RecommendationMode.MODE_FALLBACK_RANDOM_LATEST.name())
                .fallbackApplied(true)
                .message(MSG_SUCCESS)
                .total(randomLatest.size())
                .jobs(randomLatest)
                .build();
    }

    private RecommendationResp buildFallbackResponse(String message) {
        List<JobRecommendationItemReq> randomLatest = pickRandomLatestFromLatestPool();

        if (randomLatest.isEmpty()) {
            return RecommendationResp.builder()
                    .mode(RecommendationMode.MODE_NO_OPEN_JOBS.name())
                    .fallbackApplied(false)
                    .message(MSG_NO_OPEN_JOBS)
                    .total(0)
                    .jobs(Collections.emptyList())
                    .build();
        }

        return RecommendationResp.builder()
                .mode(RecommendationMode.MODE_FALLBACK_RANDOM_LATEST.name())
                .fallbackApplied(true)
                .message(message)
                .total(randomLatest.size())
                .jobs(randomLatest)
                .build();
    }

    private List<Job> getOpenActiveJobs() {
        return jobRepo.findOpenJobsForRecommendation(JobStatus.OPEN, LocalDate.now());
    }

    private List<JobRecommendationItemReq> pickRandomLatestFromLatestPool() {
        List<Job> latestPool = jobRepo.findLatestOpenJobs(
                JobStatus.OPEN,
                LocalDate.now(),
                PageRequest.of(0, LATEST_POOL_SIZE));

        if (latestPool == null || latestPool.isEmpty()) {
            return Collections.emptyList();
        }

        int poolSize = latestPool.size();
        int targetSize = poolSize >= 5
                ? ThreadLocalRandom.current().nextInt(4, 6)
                : poolSize;

        Collections.shuffle(latestPool);

        List<Job> selected = latestPool.subList(0, targetSize);

        List<Long> selectedJobIds = selected.stream()
                .map(Job::getId)
                .filter(Objects::nonNull)
                .toList();

        Map<Long, List<JobSkill>> jobSkillsByJobId = getJobSkillsByJobIds(selectedJobIds);

        List<JobRecommendationItemReq> responseItems = new ArrayList<>();
        for (Job job : selected) {
            List<JobSkill> jobSkills = jobSkillsByJobId.getOrDefault(job.getId(), Collections.emptyList());

            List<String> requiredSkillNames = jobSkills.stream()
                    .map(JobSkill::getSkill)
                    .filter(Objects::nonNull)
                    .map(skill -> skill.getName())
                    .filter(Objects::nonNull)
                    .distinct()
                    .collect(Collectors.toList());

            responseItems.add(mapToRecommendationItem(
                    job,
                    requiredSkillNames.size(),
                    0,
                    0,
                    requiredSkillNames,
                    Collections.emptyList()));
        }

        responseItems.sort(Comparator.comparing(JobRecommendationItemReq::getCreatedAt,
                Comparator.nullsLast(Comparator.reverseOrder())));
        return responseItems;
    }

    private Map<Long, List<JobSkill>> getJobSkillsByJobIds(List<Long> jobIds) {
        if (jobIds == null || jobIds.isEmpty()) {
            return Collections.emptyMap();
        }

        List<JobSkill> jobSkills = jobSkillRepo.findByJobIdIn(jobIds);

        return jobSkills.stream()
                .filter(Objects::nonNull)
                .filter(jobSkill -> jobSkill.getJob() != null && jobSkill.getJob().getId() != null)
                .collect(Collectors.groupingBy(jobSkill -> jobSkill.getJob().getId()));
    }

    private int calculateMatchScore(int matchedSkillCount, int totalRequiredSkills) {
        if (totalRequiredSkills <= 0) {
            return 0;
        }
        double score = (matchedSkillCount * 100.0) / totalRequiredSkills;
        return (int) Math.round(score);
    }

    private JobRecommendationItemReq mapToRecommendationItem(
            Job job,
            int totalRequiredSkills,
            int matchedSkillCount,
            int matchScore,
            List<String> requiredSkillNames,
            List<String> matchedSkillNames) {

        String headhunterId = null;
        String headhunterName = null;
        if (job.getHeadhunter() != null) {
            headhunterId = job.getHeadhunter().getId();
            headhunterName = job.getHeadhunter().getFullName();
        }

        LocalDateTime createdAt = job.getCreatedAt();

        return JobRecommendationItemReq.builder()
                .id(job.getId())
                .jobCode(job.getJobCode())
                .title(job.getTitle())
                .location(job.getLocation())
                .rankLevel(job.getRankLevel())
                .workingType(job.getWorkingType())
                .experience(job.getExperience())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .currency(job.getCurrency())
                .quantity(job.getQuantity())
                .deadline(job.getDeadline())
                .status(job.getStatus())
                .createdAt(createdAt)
                .headhunterId(headhunterId)
                .headhunterName(headhunterName)
                .totalRequiredSkills(totalRequiredSkills)
                .matchedSkills(matchedSkillCount)
                .matchScore(matchScore)
                .requiredSkills(requiredSkillNames)
                .matchedSkillNames(matchedSkillNames)
                .build();
    }
}
