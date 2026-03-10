package com.rikkeisoft.backend.mapper;

import com.rikkeisoft.backend.model.dto.resp.business.BusinessProfileResp;
import com.rikkeisoft.backend.model.entity.BusinessProfile;
import com.rikkeisoft.backend.repository.AccountRepo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BusinessProfileMapper {

    BusinessProfileResp toBusinessProfileResp(BusinessProfile businessProfile);

    @Mapping(target = "verificationStatus", source = "verificationStatus")
    BusinessProfile toBusinessProfile(BusinessProfileResp businessProfileResp);
}
