package com.rikkeisoft.backend.mapper;

import com.rikkeisoft.backend.model.dto.req.job.JobReq;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.rikkeisoft.backend.model.dto.resp.job.JobResp;
import com.rikkeisoft.backend.model.entity.Job;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import org.mapstruct.NullValuePropertyMappingStrategy;
import com.rikkeisoft.backend.model.dto.resp.job.JobDetailResp;
import com.rikkeisoft.backend.model.dto.resp.job.JobSkillResp;
import com.rikkeisoft.backend.model.entity.JobSkill;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface JobMapper {
    @Mapping(source = "headhunter.id", target = "headhunterId")
    @Mapping(source = "headhunter.fullName", target = "headhunterName")
    @Mapping(source = "location", target = "city")
    JobResp toJobResp(Job job);

    @Mapping(source = "headhunter.id", target = "headhunterId")
    @Mapping(source = "headhunter.fullName", target = "headhunterName")
    @Mapping(source = "headhunter.businessProfile.companyName", target = "companyName")
    @Mapping(source = "headhunter.businessProfile.websiteUrl", target = "companyWebsite")
    @Mapping(source = "headhunter.businessProfile.companyScale", target = "companySize")
    @Mapping(source = "headhunter.businessProfile.addressMain", target = "companyAddress")
//    @Mapping(source = "headhunter.businessProfile.description", target = "companyDescription")
    @Mapping(target = "skills", ignore = true)
    JobDetailResp toJobDetailResp(Job job);

    @Mapping(source = "skill.id", target = "id")
    @Mapping(source = "skill.name", target = "name")
    JobSkillResp toJobSkillResp(JobSkill jobSkill);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "jobCode", ignore = true)
    @Mapping(target = "headhunter", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateJobFromRequest(JobReq request, @MappingTarget Job job);
}
