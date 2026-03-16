package com.rikkeisoft.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.rikkeisoft.backend.model.dto.resp.job.JobResp;
import com.rikkeisoft.backend.model.entity.Job;

@Mapper(componentModel = "spring")
public interface JobMapper {
    @Mapping(source = "headhunter.id", target = "headhunterId")
    @Mapping(source = "headhunter.fullName", target = "headhunterName")
    @Mapping(source = "location", target = "city")
    JobResp toJobResp(Job job);
}
