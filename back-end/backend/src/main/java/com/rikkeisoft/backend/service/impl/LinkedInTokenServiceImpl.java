package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.model.dto.req.auth.LinkedInTokenReq;
import com.rikkeisoft.backend.model.dto.resp.auth.LinkedInTokenResp;
import com.rikkeisoft.backend.model.dto.resp.auth.LinkedInUserInfoResp;
import com.rikkeisoft.backend.service.LinkedInTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
public class LinkedInTokenServiceImpl implements LinkedInTokenService {

    @Value("${linkedin.client-id}")
    private String clientId;

    @Value("${linkedin.client-secret}")
    private String clientSecret;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public LinkedInTokenResp getAccessToken(LinkedInTokenReq req) {
        String tokenUrl = "https://www.linkedin.com/oauth/v2/accessToken";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("code", req.getCode());
        body.add("redirect_uri", req.getRedirectUri());
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<LinkedInTokenResp> response = restTemplate.postForEntity(tokenUrl, request,
                    LinkedInTokenResp.class);
            return response.getBody();
        } catch (Exception e) {
            log.error("Error exchanging LinkedIn token: {}", e.getMessage());
            throw new AppException(ErrorCode.AUTH_FAILED);
        }
    }

    @Override
    public LinkedInUserInfoResp getUserInfo(String accessToken) {
        String userInfoUrl = "https://api.linkedin.com/v2/userinfo";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<LinkedInUserInfoResp> response = restTemplate.exchange(
                    userInfoUrl,
                    HttpMethod.GET,
                    request,
                    LinkedInUserInfoResp.class);
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching LinkedIn user info: {}", e.getMessage());
            throw new AppException(ErrorCode.AUTH_FAILED);
        }
    }
}
