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
@Mapper(componentModel = "spring", uses = {InterviewMapper.class})
public interface ApplicationMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "job", ignore = true)
    @Mapping(target = "candidate", ignore = true)
    @Mapping(target = "collaborator", ignore = true)
    @Mapping(target = "cvSnapshotUrl", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "appliedAt", ignore = true)
    Application toEntity(ApplicationCreateReq req);

    @Mapping(source = "job.id", target = "jobId")
    @Mapping(source = "candidate.id", target = "candidateId")
    ApplicationResp toResponse(Application entity);

    @Mapping(source = "job.id", target = "jobId")
    @Mapping(source = "candidate.id", target = "candidateId")
    @Mapping(source = "job.title", target = "jobTitle")
    ApplicationDetailResp toDetailResponse(Application entity);
}
