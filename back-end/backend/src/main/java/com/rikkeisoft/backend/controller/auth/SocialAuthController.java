package com.rikkeisoft.backend.controller.auth;

import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.req.auth.SocialLoginReq;
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

@RestController
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequestMapping("/api/v1/auth")
public class SocialAuthController {
    AuthenticationService authenticationService;

    @PostMapping("/google/login")
    public ResponseEntity<APIResponse<Object>> googleLogin(@RequestBody @Valid SocialLoginReq req) {
        Object result = authenticationService.loginSocial(req);
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

    // Placeholder for LinkedIn
    @PostMapping("/linkedin/login")
    public void linkedinLogin() {
        // TODO: Implement LinkedIn OAuth2 later
    }
}
