package com.rikkeisoft.backend.controller;

import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.req.otp.SendByEmailRequest;
import com.rikkeisoft.backend.model.dto.req.otp.OtpVerifyRequest;
import com.rikkeisoft.backend.model.dto.req.otp.OtpVerifyAndResetPasswordReq;
import com.rikkeisoft.backend.model.dto.resp.otp.OtpSendResp;
import com.rikkeisoft.backend.model.dto.resp.otp.OtpVerifyResp;
import com.rikkeisoft.backend.model.dto.resp.otp.OtpVerifyAndResetPasswordResp;
import com.rikkeisoft.backend.service.OtpService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequestMapping("/api/otp")
public class OtpController {
    OtpService otpService;

    @PostMapping("/send-signup")
    public APIResponse<OtpSendResp> sendOtpSignup(@RequestBody SendByEmailRequest req) {
        OtpSendResp response = otpService.sendOtpSignup(req);
        return APIResponse.<OtpSendResp>builder()
                .result(response)
                .build();
    }

    @PostMapping("/verify-signup")
    public APIResponse<OtpVerifyResp> verifyOtpSignUp(@RequestBody OtpVerifyRequest req) {
        OtpVerifyResp response = otpService.verifyOtpSignUp(req);
        return APIResponse.<OtpVerifyResp>builder()
                .result(response)
                .build();
    }

    @PostMapping("/send-forgot-password")
    public APIResponse<OtpSendResp> sendOtpForgotPassword(@RequestBody SendByEmailRequest req) {
        OtpSendResp response = otpService.sendOtpForgotPassword(req);
        return  APIResponse.<OtpSendResp>builder()
                .result(response)
                .build();
    }
    
    /**
     * Verify OTP and reset password in one step
     * Combines OTP verification and password reset for simplified flow
     */
    @PostMapping("/verify-and-reset-password")
    public APIResponse<OtpVerifyAndResetPasswordResp> verifyOtpAndResetPassword(@RequestBody OtpVerifyAndResetPasswordReq req) {
        OtpVerifyAndResetPasswordResp response = otpService.verifyOtpAndResetPassword(req);
        return APIResponse.<OtpVerifyAndResetPasswordResp>builder()
                .result(response)
                .build();
    }
}
