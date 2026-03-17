package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.model.dto.resp.job.JobDetailResp;
import com.rikkeisoft.backend.model.dto.resp.job.JobSkillResp;
import com.rikkeisoft.backend.model.entity.BusinessProfile;
import com.rikkeisoft.backend.model.entity.Job;
import com.rikkeisoft.backend.model.entity.JobSkill;
import com.rikkeisoft.backend.model.entity.Skill;
import com.rikkeisoft.backend.repository.JobRepo;
import com.rikkeisoft.backend.repository.JobSkillRepo;
import com.rikkeisoft.backend.service.JobQueryService;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class JobQueryServiceImpl implements JobQueryService {
    JobRepo jobRepo;
    JobSkillRepo jobSkillRepo;

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
}
