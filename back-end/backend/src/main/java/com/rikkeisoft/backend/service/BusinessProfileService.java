package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.model.dto.resp.business.MSTLookupResp;

import com.rikkeisoft.backend.model.dto.resp.business.BusinessProfileResp;

import com.rikkeisoft.backend.model.dto.resp.job.JobDetailResp;

import java.util.List;

public interface BusinessProfileService {

    MSTLookupResp lookupMST(String taxCode);

    List<BusinessProfileResp> getAllBusinessProfiles();

    BusinessProfileResp getBusinessProfileById(Long businessProfileId);

    List<BusinessProfileResp> getTop10BestBusinessProfiles();

    List<JobDetailResp> getJobsByBusinessProfileId(Long businessProfileId);
}
