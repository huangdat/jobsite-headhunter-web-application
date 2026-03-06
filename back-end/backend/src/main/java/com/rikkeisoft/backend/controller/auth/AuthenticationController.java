package com.rikkeisoft.backend.controller.auth;

import com.nimbusds.jose.JOSEException;
import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.req.auth.AuthenticationReq;
import com.rikkeisoft.backend.model.dto.req.auth.LogoutReq;
import com.rikkeisoft.backend.model.dto.req.auth.TokenValidateReq;
import com.rikkeisoft.backend.model.dto.resp.auth.AuthenticationResp;
import com.rikkeisoft.backend.model.dto.resp.auth.TokenValidateResp;
import com.rikkeisoft.backend.service.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequestMapping("/api/auth")
public class AuthenticationController {
        AuthenticationService authenticationService;

        /**
         * Authenticate a user with username and password.
         * 
         * @param request
         * @return APIResponse with AuthenticationResponse containing authentication
         *         status and JWT token.
         */
        @PostMapping("/login")
        public APIResponse<AuthenticationResp> authenticate(@RequestBody AuthenticationReq request) {

                AuthenticationResp response = authenticationService.authenticate(request);

                return APIResponse.<AuthenticationResp>builder()
                                .status(response.isAuthenticated() ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE)
                                .message(response.isAuthenticated() ? "Authentication successful"
                                                : "Authentication failed")
                                .result(AuthenticationResp.builder()
                                                .authenticated(response.isAuthenticated())
                                                .accessToken(response.getAccessToken())
                                                .build())
                                .build();
        }

        /**
         * Introspect a JWT token to check its validity.
         * 
         * @param request
         * @return APIResponse with IntrospectResponse indicating whether the token is
         *         valid.
         * @throws ParseException
         * @throws JOSEException
         */
        @PostMapping("/token-validate")
        public APIResponse<TokenValidateResp> introspect(@RequestBody TokenValidateReq request)
                        throws ParseException, JOSEException {

                TokenValidateResp response = authenticationService.validateToken(request);

                if (!response.isValid()) {
                        // Token invalid: chỉ trả status và message, không trả result
                        return APIResponse.<TokenValidateResp>builder()
                                        .status(HttpStatus.UNAUTHORIZED)
                                        .message("Token invalid")
                                        .result(null)
                                        .build();
                }

                // Token valid: trả full thông tin
                return APIResponse.<TokenValidateResp>builder()
                                .status(HttpStatus.OK)
                                .message("Token valid")
                                .result(TokenValidateResp.builder()
                                                .valid(response.isValid())
                                                .username(response.getUsername())
                                                .id(response.getId())
                                                .role(response.getRole())
                                                .status(response.getStatus())
                                                .build())
                                .build();
        }

        /**
         * Logout user by invalidating the JWT token.
         * 
         * @param request
         * @return APIResponse indicating logout success
         * @throws ParseException
         * @throws JOSEException
         */
        @PostMapping("/logout")
        public APIResponse<Void> logout(@RequestBody LogoutReq request) throws ParseException, JOSEException {
                authenticationService.logout(request);

                return APIResponse.<Void>builder()
                                .status(HttpStatus.OK)
                                .message("Logout successfully")
                                .build();
        }

}
