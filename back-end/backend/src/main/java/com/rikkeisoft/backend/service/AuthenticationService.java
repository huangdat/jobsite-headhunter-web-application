package com.rikkeisoft.backend.service;

import com.nimbusds.jose.JOSEException;
import com.rikkeisoft.backend.model.dto.req.auth.AuthenticationReq;
import com.rikkeisoft.backend.model.dto.req.auth.TokenValidateReq;
import com.rikkeisoft.backend.model.dto.resp.auth.AuthenticationResp;
import com.rikkeisoft.backend.model.dto.resp.auth.TokenValidateResp;

import java.text.ParseException;

public interface AuthenticationService {
    AuthenticationResp authenticate(AuthenticationReq req);
    TokenValidateResp validateToken(TokenValidateReq req) throws JOSEException, ParseException;
}
