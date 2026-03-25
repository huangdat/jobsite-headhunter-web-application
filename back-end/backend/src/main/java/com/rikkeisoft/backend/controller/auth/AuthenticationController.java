package com.rikkeisoft.backend.controller.auth;

import com.nimbusds.jose.JOSEException;
import com.rikkeisoft.backend.enums.AccountStatus;
import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.component.Translator;
import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.req.auth.AuthenticationReq;
import com.rikkeisoft.backend.model.dto.req.auth.LogoutReq;
import com.rikkeisoft.backend.model.dto.req.auth.TokenValidateReq;
import com.rikkeisoft.backend.model.dto.resp.auth.AuthenticationResp;
import com.rikkeisoft.backend.model.dto.resp.auth.TokenValidateResp;
import com.rikkeisoft.backend.model.entity.Account;
import com.rikkeisoft.backend.repository.AccountRepo;
import com.rikkeisoft.backend.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
        AccountRepo accountRepo;
        Translator translator;

        /**
         * Authenticate a user with username and password.
         *
         * @param request
         * @return APIResponse with AuthenticationResponse containing authentication
         *         status and JWT token.
         */
        @PostMapping("/login")
        public ResponseEntity<APIResponse<AuthenticationResp>> authenticate(@RequestBody AuthenticationReq request) {

                AuthenticationResp response = authenticationService.authenticate(request);

                // check if status of account is AccountStatus.ACTIVE, if not return 503
                Account account = accountRepo.findByUsername(request.getUsername())
                                .orElseGet(() -> accountRepo.findByEmail(request.getUsername())
                                                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND)));
                if (account.getStatus() != AccountStatus.ACTIVE) {
                        APIResponse<AuthenticationResp> api = APIResponse.<AuthenticationResp>builder()
                                        .status(HttpStatus.SERVICE_UNAVAILABLE)
                                        .message(translator.toLocale("auth.login.account_not_active"))
                                        .result(AuthenticationResp.builder()
                                                        .authenticated(false)
                                                        .accessToken(null)
                                                        .build())
                                        .build();
                        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(api);
                }

                APIResponse<AuthenticationResp> api = APIResponse.<AuthenticationResp>builder()
                                .status(response.isAuthenticated() ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE)
                                .message(response.isAuthenticated() ? translator.toLocale("auth.login.success")
                                                : translator.toLocale("auth.login.failed"))
                                .result(AuthenticationResp.builder()
                                                .authenticated(response.isAuthenticated())
                                                .accessToken(response.getAccessToken())
                                                .build())
                                .build();

                HttpStatus httpStatus = response.isAuthenticated() ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
                return ResponseEntity.status(httpStatus).body(api);
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
        public APIResponse<TokenValidateResp> tokenValidate(@RequestBody TokenValidateReq request)
                        throws ParseException, JOSEException {

                TokenValidateResp response = authenticationService.validateToken(request);

                if (!response.isValid()) {
                        // Token invalid: chỉ trả status và message, không trả result
                        return APIResponse.<TokenValidateResp>builder()
                                        .status(HttpStatus.UNAUTHORIZED)
                                        .message(translator.toLocale("auth.token.invalid"))
                                        .result(null)
                                        .build();
                }

                return APIResponse.<TokenValidateResp>builder()
                                .status(response.isValid() ? HttpStatus.OK : HttpStatus.UNAUTHORIZED)
                                .message(response.isValid() ? translator.toLocale("auth.token.valid")
                                                : translator.toLocale("auth.token.invalid"))
                                .result(TokenValidateResp.builder()
                                                .valid(response.isValid())
                                                .username(response.getUsername())
                                                .id(response.getId())
                                                .role(response.getRole())
                                                .status(response.getStatus())
                                                .build())
                                .build();
        }

        @PostMapping("/logout")
        public APIResponse<Void> logout(@RequestBody LogoutReq request, HttpServletRequest httpRequest)
                        throws ParseException, JOSEException {
                String authHeader = httpRequest.getHeader("Authorization");
                if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                        throw new AppException(ErrorCode.UNAUTHORIZED);
                }
                String callerToken = authHeader.substring("Bearer ".length()).trim();

                authenticationService.logout(request, callerToken);

                return APIResponse.<Void>builder()
                                .status(HttpStatus.OK)
                                .message(translator.toLocale("auth.logout.success"))
                                .build();
        }

}
