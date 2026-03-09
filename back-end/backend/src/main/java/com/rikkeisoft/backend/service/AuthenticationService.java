package com.rikkeisoft.backend.service;

import com.nimbusds.jose.JOSEException;
import com.rikkeisoft.backend.model.dto.req.auth.AuthenticationReq;
import com.rikkeisoft.backend.model.dto.req.auth.LogoutReq;
import com.rikkeisoft.backend.model.dto.req.auth.GoogleTokenReq;
import com.rikkeisoft.backend.model.dto.req.auth.SocialRegisterReq;
import com.rikkeisoft.backend.model.dto.req.auth.TokenValidateReq;
import com.rikkeisoft.backend.model.dto.resp.auth.AuthenticationResp;
import com.rikkeisoft.backend.model.dto.resp.auth.TokenValidateResp;

import java.text.ParseException;

import com.rikkeisoft.backend.model.dto.req.auth.LinkedInTokenReq;

public interface AuthenticationService {
    AuthenticationResp authenticate(AuthenticationReq req);

    Object googleLogin(GoogleTokenReq req);

    Object linkedinLogin(LinkedInTokenReq req);

    AuthenticationResp registerSocial(SocialRegisterReq req);

    TokenValidateResp validateToken(TokenValidateReq req) throws JOSEException, ParseException;

    void logout(LogoutReq req) throws ParseException, JOSEException;
}
