package com.rikkeisoft.backend.service;

import com.nimbusds.jose.JOSEException;
import com.rikkeisoft.backend.model.dto.req.auth.AuthenticationReq;
import com.rikkeisoft.backend.model.dto.req.auth.LogoutReq;
import com.rikkeisoft.backend.model.dto.req.auth.TokenValidateReq;
import com.rikkeisoft.backend.model.dto.resp.auth.AuthenticationResp;
import com.rikkeisoft.backend.model.dto.resp.auth.TokenValidateResp;

import java.text.ParseException;

public interface AuthenticationService {
    AuthenticationResp authenticate(AuthenticationReq req);
    TokenValidateResp validateToken(TokenValidateReq req) throws JOSEException, ParseException;
    /**
     * Logout a token, with authorization check based on caller token.
     * @param req the logout request containing the token to invalidate
     * @param callerToken the caller's access token (from Authorization header)
     */
    void logout(LogoutReq req, String callerToken) throws ParseException, JOSEException;
}
