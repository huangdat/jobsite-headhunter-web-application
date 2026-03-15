package com.rikkeisoft.backend.mapper;

import com.rikkeisoft.backend.model.dto.resp.business.BusinessProfileResp;
import com.rikkeisoft.backend.model.entity.BusinessProfile;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BusinessProfileMapper {

    BusinessProfileResp toBusinessProfileResp(BusinessProfile businessProfile);

    @InheritInverseConfiguration(name = "toBusinessProfileResp")
    BusinessProfile toBusinessProfile(BusinessProfileResp businessProfileResp);
}
