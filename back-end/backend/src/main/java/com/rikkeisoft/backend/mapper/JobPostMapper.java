package com.rikkeisoft.backend.mapper;

import com.rikkeisoft.backend.model.dto.req.job.JobPostReq;
import com.rikkeisoft.backend.model.dto.resp.job.JobPostResp;
import com.rikkeisoft.backend.model.entity.Job;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface JobPostMapper {
    JobPostResp toJobPostResponse(Job job);
}
