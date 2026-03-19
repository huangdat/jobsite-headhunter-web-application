package com.rikkeisoft.backend.mapper;

import com.rikkeisoft.backend.model.dto.req.application.ApplicationCreateReq;
import com.rikkeisoft.backend.model.dto.resp.application.ApplicationDetailResp;
import com.rikkeisoft.backend.model.dto.resp.application.ApplicationResp;
import com.rikkeisoft.backend.model.entity.Application;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * MapStruct mapper for converting between Application entities and DTOs.
 */
@Mapper(componentModel = "spring")
public interface ApplicationMapper {
    Application toEntity(ApplicationCreateReq req);

    @Mapping(target = "jobId", source = "job.id")
    @Mapping(target = "candidateId", source = "candidate.id")
    ApplicationResp toResponse(Application entity);

    @Mapping(target = "jobTitle", source = "job.title")
    ApplicationDetailResp toDetailResponse(Application entity);
}
