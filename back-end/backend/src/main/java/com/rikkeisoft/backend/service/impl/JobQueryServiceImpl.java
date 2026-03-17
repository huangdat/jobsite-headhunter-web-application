package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.enums.JobStatus;
import com.rikkeisoft.backend.enums.RankLevel;
import com.rikkeisoft.backend.enums.WorkingType;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.mapper.JobMapper;
import com.rikkeisoft.backend.model.dto.PagedResponse;
import com.rikkeisoft.backend.model.dto.resp.job.JobDetailResp;
import com.rikkeisoft.backend.model.dto.resp.job.JobResp;
import com.rikkeisoft.backend.model.dto.resp.job.JobSkillResp;
import com.rikkeisoft.backend.model.entity.Account;
import com.rikkeisoft.backend.model.entity.BusinessProfile;
import com.rikkeisoft.backend.model.entity.Job;
import com.rikkeisoft.backend.model.entity.JobSkill;
import com.rikkeisoft.backend.model.entity.Skill;
import com.rikkeisoft.backend.repository.AccountRepo;
import com.rikkeisoft.backend.repository.JobRepo;
import com.rikkeisoft.backend.repository.JobSkillRepo;
import com.rikkeisoft.backend.service.JobQueryService;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDate;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class JobQueryServiceImpl implements JobQueryService {
    JobRepo jobRepo;
    JobSkillRepo jobSkillRepo;
    AccountRepo accountRepo;
    JobMapper jobMapper;

    @Override
    public JobDetailResp getJobDetail(Long jobId) {
        Job job = jobRepo.findById(jobId)
                .orElseThrow(() -> new AppException(ErrorCode.JOB_NOT_FOUND));

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
                .negotiable(job.isNegotiable())
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

    @Override
    public PagedResponse<JobResp> searchJobs(
            int page,
            int size,
            String keyword,
            String location,
            Double salaryMin,
            Double salaryMax,
            String workingType,
            String status,
            String industryName,
            String rankLevel,
            boolean mine,
            String authorId,
            String currentUsername) {

        String safeKeyword = keyword == null ? null : HtmlUtils.htmlEscape(keyword).trim();
        String safeLocation = location == null ? null : HtmlUtils.htmlEscape(location).trim();

        int pageIndex = Math.max(1, page) - 1;
        Pageable pageable = PageRequest.of(pageIndex, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Specification<Job> spec = (root, query, cb) -> {
            query.distinct(true);
            List<Predicate> predicates = new ArrayList<>();

            if (safeKeyword != null && !safeKeyword.isEmpty()) {
                String like = "%" + safeKeyword.toLowerCase() + "%";
                Expression<String> titleExp = cb.lower(root.get("title"));
                Expression<String> descExp = cb.lower(root.get("description"));
                predicates.add(cb.or(cb.like(titleExp, like), cb.like(descExp, like)));
            }

            if (safeLocation != null && !safeLocation.isEmpty()) {
                String like = "%" + safeLocation.toLowerCase() + "%";
                Expression<String> locationExp = cb.lower(root.get("location"));
                predicates.add(cb.like(locationExp, like));
            }

            if (salaryMin != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("salaryMax"), salaryMin));
            }

            if (salaryMax != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("salaryMin"), salaryMax));
            }

            if (workingType != null && !workingType.isEmpty()) {
                try {
                    predicates.add(cb.equal(root.get("workingType"), WorkingType.valueOf(workingType.toUpperCase())));
                } catch (Exception ignored) {
                }
            }

            if (rankLevel != null && !rankLevel.isEmpty()) {
                try {
                    predicates.add(cb.equal(root.get("rankLevel"), RankLevel.valueOf(rankLevel.toUpperCase())));
                } catch (Exception ignored) {
                }
            }

            JobStatus parsedStatus = null;
            if (status != null && !status.isEmpty()) {
                try {
                    parsedStatus = JobStatus.valueOf(status.toUpperCase());
                } catch (Exception ignored) {
                }
            }

            if (mine) {
                if (currentUsername == null || currentUsername.isEmpty()) {
                    throw new AppException(ErrorCode.UNAUTHORIZED_ACTION);
                }
                Account account = accountRepo.findByUsername(currentUsername)
                        .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
                predicates.add(cb.equal(root.get("headhunter").get("id"), account.getId()));
                if (parsedStatus != null) {
                    predicates.add(cb.equal(root.get("status"), parsedStatus));
                }
            } else if (authorId != null && !authorId.isEmpty()) {
                predicates.add(cb.equal(root.get("headhunter").get("id"), authorId));
                if (parsedStatus != null) {
                    predicates.add(cb.equal(root.get("status"), parsedStatus));
                }
            } else {
                predicates.add(cb.equal(root.get("status"), JobStatus.OPEN));
                predicates.add(cb.or(
                        cb.isNull(root.get("deadline")),
                        cb.greaterThanOrEqualTo(root.get("deadline"), LocalDate.now())));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Job> result = jobRepo.findAll(spec, pageable);
        List<JobResp> data = result.getContent().stream()
                .map(jobMapper::toJobResp)
                .collect(Collectors.toList());

        PagedResponse<JobResp> resp = new PagedResponse<>();
        resp.setPage(pageIndex + 1);
        resp.setSize(size);
        resp.setTotalElements(result.getTotalElements());
        resp.setTotalPages(result.getTotalPages());
        resp.setData(data);

        return resp;
    }

    @Override
    public List<JobResp> getBestJobs(int size) {
        int limitedSize = Math.max(1, size);
        Pageable pageable = PageRequest.of(
                0,
                limitedSize,
                Sort.by(Sort.Order.desc("salaryMax"), Sort.Order.desc("createdAt")));

        Specification<Job> spec = (root, query, cb) -> cb.and(
                cb.equal(root.get("status"), JobStatus.OPEN),
                cb.or(
                        cb.isNull(root.get("deadline")),
                        cb.greaterThanOrEqualTo(root.get("deadline"), LocalDate.now())));

        return jobRepo.findAll(spec, pageable)
                .getContent()
                .stream()
                .map(jobMapper::toJobResp)
                .collect(Collectors.toList());
    }
}
