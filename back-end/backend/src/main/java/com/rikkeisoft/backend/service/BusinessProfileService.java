package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.model.dto.resp.business.BusinessProfileResp;

import java.util.List;

public interface BusinessProfileService {

    List<BusinessProfileResp> getAllBusinessProfiles();
}
