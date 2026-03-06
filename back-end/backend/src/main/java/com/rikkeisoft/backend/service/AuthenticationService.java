package com.rikkeisoft.backend.service;

import com.nimbusds.jose.JOSEException;
import com.rikkeisoft.backend.model.dto.req.auth.AuthenticationReq;
import com.rikkeisoft.backend.model.dto.req.auth.LogoutReq;
import com.rikkeisoft.backend.model.dto.req.auth.SocialLoginReq;
import com.rikkeisoft.backend.model.dto.req.auth.SocialRegisterReq;
import com.rikkeisoft.backend.model.dto.req.auth.TokenValidateReq;
import com.rikkeisoft.backend.model.dto.resp.auth.AuthenticationResp;
import com.rikkeisoft.backend.model.dto.resp.auth.TokenValidateResp;

import java.text.ParseException;

public interface AuthenticationService {
    AuthenticationResp authenticate(AuthenticationReq req);
    Object loginSocial(SocialLoginReq req);
    AuthenticationResp registerSocial(SocialRegisterReq req);
    TokenValidateResp validateToken(TokenValidateReq req) throws JOSEException, ParseException;
    void logout(LogoutReq req) throws ParseException, JOSEException;
}
