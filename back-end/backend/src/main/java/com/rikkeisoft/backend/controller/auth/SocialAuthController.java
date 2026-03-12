package com.rikkeisoft.backend.controller.auth;

import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.req.auth.LinkedInTokenReq;
import com.rikkeisoft.backend.model.dto.req.auth.GoogleTokenReq;
import com.rikkeisoft.backend.model.dto.req.auth.SocialRegisterReq;
import com.rikkeisoft.backend.model.dto.resp.auth.AuthenticationResp;
import com.rikkeisoft.backend.model.dto.resp.auth.SocialAuthResp;
import com.rikkeisoft.backend.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.env.Environment;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequestMapping("/api/auth")
public class SocialAuthController {
    AuthenticationService authenticationService;
    Environment environment;

    @GetMapping("/social-config")
    public ResponseEntity<APIResponse<Map<String, String>>> getSocialConfig() {
        return ResponseEntity.ok(APIResponse.<Map<String, String>>builder()
                .result(Map.of(
                        "googleClientId", environment.getProperty("google.client-id"),
                        "linkedinClientId", environment.getProperty("linkedin.client-id")))
                .build());
    }

    @PostMapping("/google/login")
    public ResponseEntity<APIResponse<Object>> googleLogin(@RequestBody @Valid GoogleTokenReq req) {
        Object result = authenticationService.googleLogin(req);
        if (result instanceof SocialAuthResp) {
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(APIResponse.<Object>builder()
                    .message("User not registered, please proceed to registration")
                    .status(HttpStatus.ACCEPTED)
                    .result(result)
                    .build());
        }
        return ResponseEntity.ok(APIResponse.<Object>builder()
                .result(result)
                .build());
    }

    @PostMapping("/linkedin/oauth")
    public ResponseEntity<APIResponse<Object>> linkedinLogin(@RequestBody @Valid LinkedInTokenReq req) {
        Object result = authenticationService.linkedinLogin(req);
        if (result instanceof SocialAuthResp) {
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(APIResponse.<Object>builder()
                    .message("User not registered, please proceed to registration")
                    .status(HttpStatus.ACCEPTED)
                    .result(result)
                    .build());
        }
        return ResponseEntity.ok(APIResponse.<Object>builder()
                .result(result)
                .build());
    }

    @PostMapping("/register-social")
    public ResponseEntity<APIResponse<AuthenticationResp>> registerSocial(@RequestBody @Valid SocialRegisterReq req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(APIResponse.<AuthenticationResp>builder()
                .status(HttpStatus.CREATED)
                .result(authenticationService.registerSocial(req))
                .build());
    }
}
