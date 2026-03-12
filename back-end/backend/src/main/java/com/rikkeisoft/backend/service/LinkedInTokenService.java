package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.model.dto.req.auth.LinkedInTokenReq;
import com.rikkeisoft.backend.model.dto.resp.auth.LinkedInTokenResp;
import com.rikkeisoft.backend.model.dto.resp.auth.LinkedInUserInfoResp;

public interface LinkedInTokenService {
    LinkedInTokenResp getAccessToken(LinkedInTokenReq req);

    LinkedInUserInfoResp getUserInfo(String accessToken);
}
