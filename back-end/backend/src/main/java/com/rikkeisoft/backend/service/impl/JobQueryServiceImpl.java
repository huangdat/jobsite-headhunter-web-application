package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.enums.JobStatus;
import com.rikkeisoft.backend.enums.Role;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.mapper.JobMapper;
import com.rikkeisoft.backend.model.dto.PagedResponse;
import com.rikkeisoft.backend.model.dto.req.job.JobSearchCriteria;
import com.rikkeisoft.backend.model.dto.resp.job.JobDetailResp;
import com.rikkeisoft.backend.model.dto.resp.job.JobResp;
import com.rikkeisoft.backend.model.dto.resp.job.JobSkillResp;
import com.rikkeisoft.backend.model.entity.Account;
import com.rikkeisoft.backend.model.entity.BusinessProfile;
import com.rikkeisoft.backend.model.entity.Job;
import com.rikkeisoft.backend.model.entity.JobSkill;
import com.rikkeisoft.backend.model.entity.Skill;
import com.rikkeisoft.backend.repository.JobRepo;
import com.rikkeisoft.backend.repository.JobSkillRepo;
import com.rikkeisoft.backend.service.JobQueryService;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class JobQueryServiceImpl implements JobQueryService {
    JobRepo jobRepo;
    JobSkillRepo jobSkillRepo;
    JobMapper jobMapper;
    com.rikkeisoft.backend.repository.AccountRepo accountRepo;

    @Override
    public JobDetailResp getJobDetail(Long jobId) {
        Job job = jobRepo.findById(jobId)
                .orElseThrow(() -> new AppException(ErrorCode.JOB_NOT_FOUND));

        // Check access permission for CLOSED or hidden jobs neww
        // Only job owner (headhunter) or ADMIN can view CLOSED/hidden jobs
        if (job.getStatus() == JobStatus.CLOSED || !job.getVisible()) {
            validateJobDetailAccess(job);
        }

        List<JobSkill> jobSkills = jobSkillRepo.findByJobId(job.getId());
        List<JobSkillResp> skillResps = new ArrayList<>();
        for (JobSkill jobSkill : jobSkills) {
            Skill skill = jobSkill.getSkill();
            if (skill != null) {
                skillResps.add(JobSkillResp.builder()
                        .id(skill.getId())
                        .name(skill.getName())
                        .build());
            }
        }

        BusinessProfile businessProfile = job.getHeadhunter() != null
                ? job.getHeadhunter().getBusinessProfile()
                : null;

        return JobDetailResp.builder()
                .id(job.getId())
                .jobCode(job.getJobCode())
                .title(job.getTitle())
                .description(job.getDescription())
                .responsibilities(job.getResponsibilities())
                .requirements(job.getRequirements())
                .benefits(job.getBenefits())
                .workingTime(job.getWorkingTime())
                .location(job.getLocation())
                .addressDetail(job.getAddressDetail())
                .experience(job.getExperience())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .negotiable(job.getNegotiable())
                .currency(job.getCurrency() != null ? job.getCurrency().name() : null)
                .quantity(job.getQuantity())
                .rankLevel(job.getRankLevel())
                .workingType(job.getWorkingType())
                .deadline(job.getDeadline())
                .status(job.getStatus())
                .createdAt(job.getCreatedAt())
                .imageUrl(job.getImageUrl())
                .headhunterId(job.getHeadhunter() != null ? job.getHeadhunter().getId() : null)
                .headhunterName(job.getHeadhunter() != null ? job.getHeadhunter().getFullName() : null)
                .companyName(businessProfile != null ? businessProfile.getCompanyName() : null)
                .companyWebsite(businessProfile != null ? businessProfile.getWebsiteUrl() : null)
                .companySize(businessProfile != null ? businessProfile.getCompanyScale() : null)
                .companyAddress(businessProfile != null ? businessProfile.getAddressMain() : null)
                .companyDescription(null)
                .skills(skillResps)
                .build();
    }

    /**
     * Validates if current user has permission to view CLOSED/hidden job detail
     * Only job owner (headhunter) or ADMIN can view CLOSED or hidden
     * (visible=false) jobs
     */
    private void validateJobDetailAccess(Job job) {
        Account currentAccount;
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            currentAccount = accountRepo.findByUsername(username).orElse(null);
        } catch (Exception e) {
            // User not authenticated - cannot view CLOSED/hidden jobs
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        if (currentAccount == null) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        // Check if user is ADMIN
        Set<String> roles = currentAccount.getRoles();
        boolean isAdmin = roles != null && roles.contains(Role.ADMIN.name());

        // Check if user is job owner (headhunter)
        boolean isJobOwner = job.getHeadhunter() != null &&
                job.getHeadhunter().getId().equals(currentAccount.getId());

        // Allow access if user is admin OR job owner
        if (!isAdmin && !isJobOwner) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }
    }

    @Override
    public PagedResponse<JobResp> searchJobs(JobSearchCriteria criteria) {
        int sanitizedPage = Math.max(criteria.getPage(), 1);
        int sanitizedSize = Math.min(Math.max(criteria.getSize(), 1), 50);

        Pageable pageable = PageRequest.of(sanitizedPage - 1, sanitizedSize, Sort.by(Sort.Direction.DESC, "createdAt"));

        Specification<Job> specification = (root, query, cb) -> {
            query.distinct(true);
            List<Predicate> predicates = new ArrayList<>();

            String keyword = criteria.getKeyword();
            if (keyword != null && !keyword.isBlank()) {
                String safeKeyword = HtmlUtils.htmlEscape(keyword.trim()).toLowerCase();
                String likeKeyword = "%" + safeKeyword + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), likeKeyword),
                        cb.like(cb.lower(root.get("description")), likeKeyword),
                        cb.like(cb.lower(root.get("location")), likeKeyword)));
            }

            if (criteria.getLocation() != null && !criteria.getLocation().isBlank()) {
                String likeLocation = "%" + criteria.getLocation().trim().toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("location")), likeLocation));
            }

            if (criteria.getRankLevel() != null) {
                predicates.add(cb.equal(root.get("rankLevel"), criteria.getRankLevel()));
            }

            if (criteria.getWorkingType() != null) {
                predicates.add(cb.equal(root.get("workingType"), criteria.getWorkingType()));
            }

            // If headhunterId is specified (viewing "My Jobs"), show all jobs regardless of
            // status/visible
            // Otherwise, apply default filters for public job search
            boolean isMyJobsView = criteria.getHeadhunterId() != null && !criteria.getHeadhunterId().isBlank();

            String headhunterIdStr = null;
            String resolvedHeadhunterAccountId = null;
            if (isMyJobsView) {
                headhunterIdStr = criteria.getHeadhunterId().trim();

                // frontend may send username instead of account id (UUID). Resolve both cases.
                // Try find by id first
                try {
                    if (accountRepo.existsById(headhunterIdStr)) {
                        resolvedHeadhunterAccountId = headhunterIdStr;
                    } else {
                        // fallback to username lookup
                        accountRepo.findByUsername(headhunterIdStr).ifPresent(a -> {
                            // set via single-element array workaround
                            // but we'll capture below after optional
                        });
                        resolvedHeadhunterAccountId = accountRepo.findByUsername(headhunterIdStr)
                                .map(a -> a.getId())
                                .orElse(null);
                    }
                } catch (Exception ex) {
                    resolvedHeadhunterAccountId = null;
                }
                if (resolvedHeadhunterAccountId == null) {
                    resolvedHeadhunterAccountId = "__NO_SUCH_ID__";
                }
            }

            if (criteria.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), criteria.getStatus()));
            } else if (!isMyJobsView) {
                // Only filter by OPEN status if NOT viewing "My Jobs"
                predicates.add(cb.equal(root.get("status"), JobStatus.OPEN));
            }

            if (criteria.getVisible() != null) {
                predicates.add(cb.equal(root.get("visible"), criteria.getVisible()));
            } else if (!isMyJobsView) {
                // Only filter by visible=true if NOT viewing "My Jobs"
                predicates.add(cb.equal(root.get("visible"), true));
            }

            if (criteria.getFeatured() != null) {
                predicates.add(cb.equal(root.get("featured"), criteria.getFeatured()));
            }

            if (criteria.getSalaryMin() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("salaryMax"), criteria.getSalaryMin()));
            }

            if (criteria.getSalaryMax() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("salaryMin"), criteria.getSalaryMax()));
            }

            if (criteria.getExperienceMin() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("experience"), criteria.getExperienceMin()));
            }

            if (criteria.getExperienceMax() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("experience"), criteria.getExperienceMax()));
            }

            if (criteria.getNegotiable() != null) {
                predicates.add(cb.equal(root.get("negotiable"), criteria.getNegotiable()));
            }

            if (isMyJobsView) {
                predicates.add(cb.equal(root.get("headhunter").get("id"), resolvedHeadhunterAccountId));
            }

            if (criteria.getSkillIds() != null && !criteria.getSkillIds().isEmpty()) {
                Join<Job, JobSkill> jobSkillJoin = root.join("jobSkills", JoinType.INNER);
                predicates.add(jobSkillJoin.get("skill").get("id").in(criteria.getSkillIds()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Job> result = jobRepo.findAll(specification, pageable);

        List<JobResp> jobResps = result.getContent().stream()
                .map(jobMapper::toJobResp)
                .collect(Collectors.toList());

        return PagedResponse.<JobResp>builder()
                .page(sanitizedPage)
                .size(sanitizedSize)
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .data(jobResps)
                .build();
    }

    @Override
    public List<JobResp> getHighlightedJobs(int limit) {
        int safeLimit = Math.min(Math.max(limit, 1), 20);
        Pageable pageable = PageRequest.of(0, safeLimit, Sort.by(Sort.Direction.DESC, "createdAt"));
        List<Job> jobs = jobRepo.findHighlightedJobs(JobStatus.OPEN, LocalDateTime.now(), pageable);
        return jobs.stream().map(jobMapper::toJobResp).collect(Collectors.toList());
    }
}
