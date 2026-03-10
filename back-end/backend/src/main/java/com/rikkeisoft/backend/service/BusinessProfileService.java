package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.model.dto.resp.business.MSTLookupResp;

public interface BusinessProfileService {

    MSTLookupResp lookupMST(String taxCode);

}
