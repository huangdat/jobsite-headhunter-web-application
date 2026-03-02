package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.model.dto.req.otp.SendByEmailRequest;
import com.rikkeisoft.backend.model.dto.req.otp.OtpVerifyRequest;
import com.rikkeisoft.backend.model.dto.resp.otp.OtpSendResp;
import com.rikkeisoft.backend.model.dto.resp.otp.OtpVerifyResp;

public interface OtpService {
    OtpSendResp sendOtpSignup(SendByEmailRequest req);
    OtpVerifyResp verifyOtpSignUp(OtpVerifyRequest req);
    OtpSendResp sendOtpForgotPassword(SendByEmailRequest req);
    OtpVerifyResp verifyOtpForgotPassword(OtpVerifyRequest req);
}
