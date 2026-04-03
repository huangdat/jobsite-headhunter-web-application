package com.rikkeisoft.backend.mapper;

import com.rikkeisoft.backend.model.dto.req.interview.InterviewCreateReq;
import com.rikkeisoft.backend.model.dto.resp.interview.InterviewResp;
import com.rikkeisoft.backend.model.entity.Interview;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * MapStruct mapper for converting between Interview entities and DTOs.
 */
@Mapper(componentModel = "spring")
public interface InterviewMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "application", ignore = true)
    @Mapping(target = "interviewCode", ignore = true)
    @Mapping(target = "status", ignore = true)
    Interview toEntity(InterviewCreateReq req);

    @Mapping(source = "application.id", target = "applicationId")
    InterviewResp toResponse(Interview entity);
}
