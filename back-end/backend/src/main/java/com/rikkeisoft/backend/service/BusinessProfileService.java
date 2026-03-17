package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.model.dto.req.business.BusinessProfileUpdateReq;
import com.rikkeisoft.backend.model.dto.resp.business.MSTLookupResp;

import com.rikkeisoft.backend.model.dto.resp.business.BusinessProfileResp;
import com.rikkeisoft.backend.model.entity.BusinessProfile;

import java.util.List;

public interface BusinessProfileService {

    MSTLookupResp lookupMST(String taxCode);

    List<BusinessProfileResp> getAllBusinessProfiles();

    BusinessProfileResp getBusinessProfileById(Long businessProfileId);

    List<BusinessProfileResp> getTop10BestBusinessProfiles();

    BusinessProfileResp updateBusinessProfile(Long businessProfileId, BusinessProfileUpdateReq req);
}
