package com.rikkeisoft.backend.mapper;

import com.rikkeisoft.backend.model.dto.req.application.ApplicationCreateReq;
import com.rikkeisoft.backend.model.dto.resp.application.ApplicationDetailResp;
import com.rikkeisoft.backend.model.dto.resp.application.ApplicationResp;
import com.rikkeisoft.backend.model.entity.Application;
import org.mapstruct.Mapper;

/**
 * MapStruct mapper for converting between Application entities and DTOs.
 */
@Mapper(componentModel = "spring")
public interface ApplicationMapper {
    Application toEntity(ApplicationCreateReq req);
    ApplicationResp toResponse(Application entity);
    ApplicationDetailResp toDetailResponse(Application entity);
}
