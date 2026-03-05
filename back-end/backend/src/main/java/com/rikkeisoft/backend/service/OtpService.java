package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.model.dto.req.otp.SendByEmailRequest;
import com.rikkeisoft.backend.model.dto.req.otp.OtpVerifyRequest;
import com.rikkeisoft.backend.model.dto.req.otp.OtpVerifyAndResetPasswordReq;
import com.rikkeisoft.backend.model.dto.resp.otp.OtpSendResp;
import com.rikkeisoft.backend.model.dto.resp.otp.OtpVerifyResp;
import com.rikkeisoft.backend.model.dto.resp.otp.OtpVerifyAndResetPasswordResp;

public interface OtpService {
    OtpSendResp sendOtpSignup(SendByEmailRequest req);
    OtpVerifyResp verifyOtpSignUp(OtpVerifyRequest req);
    OtpSendResp sendOtpForgotPassword(SendByEmailRequest req);
    
    /**
     * Verify OTP and reset password in one step
     * @param req OtpVerifyAndResetPasswordReq containing email, OTP code, and new password
     * @return OtpVerifyAndResetPasswordResp
     */
    OtpVerifyAndResetPasswordResp verifyOtpAndResetPassword(OtpVerifyAndResetPasswordReq req);
}
