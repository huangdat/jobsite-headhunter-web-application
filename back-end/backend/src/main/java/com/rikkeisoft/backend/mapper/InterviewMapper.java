package com.rikkeisoft.backend.mapper;

import com.rikkeisoft.backend.model.dto.req.interview.InterviewCreateReq;
import com.rikkeisoft.backend.model.dto.resp.interview.InterviewResp;
import com.rikkeisoft.backend.model.entity.Interview;
import org.mapstruct.Mapper;

/**
 * MapStruct mapper for converting between Interview entities and DTOs.
 */
@Mapper(componentModel = "spring")
public interface InterviewMapper {
    Interview toEntity(InterviewCreateReq req);
    InterviewResp toResponse(Interview entity);
}
