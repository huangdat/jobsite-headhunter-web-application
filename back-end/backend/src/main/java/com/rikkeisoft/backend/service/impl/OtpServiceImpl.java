package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.enums.OtpTokenType;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.model.dto.req.otp.SendByEmailRequest;
import com.rikkeisoft.backend.model.dto.req.otp.OtpVerifyRequest;
import com.rikkeisoft.backend.model.dto.resp.otp.OtpSendResp;
import com.rikkeisoft.backend.model.dto.resp.otp.OtpVerifyResp;
import com.rikkeisoft.backend.model.entity.OtpToken;
import com.rikkeisoft.backend.repository.AccountRepo;
import com.rikkeisoft.backend.repository.OtpTokenRepo;
import com.rikkeisoft.backend.service.AccountService;
import com.rikkeisoft.backend.service.OtpService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;

@RequiredArgsConstructor // Generates a constructor with required arguments for final fields.
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
public class OtpServiceImpl implements OtpService {
    JavaMailSender mailSender;
    OtpTokenRepo otpTokenRepo;
    SecureRandom random = new SecureRandom();
    Duration ttl = Duration.ofMinutes(5);
    int resendCooldownSec = 45;
    AccountRepo accountRepo;
    AccountService userService;

    @NonFinal
    @Value("${spring.mail.username}")
    String mailUsername;

    /**
     * Generate a 6-digit OTP code
     *
     * @return String
     */
    String gen6Digit() {
        return String.format("%06d", random.nextInt(1_000_000));
    }

    /**
     * Send OTP code to email
     *
     * @param to   String
     * @param code String
     */
    void sendEmailVerify(String to, String code, String msgSubject, String msgText) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(mailUsername);
        msg.setTo(to);
        msg.setSubject(msgSubject);
        msg.setText((msgText).formatted(code));
        mailSender.send(msg);
    }

    /**
     * Send OTP code to email for verification.
     * Using email as identifier since account may not exist yet.
     * @param req
     */
    @Transactional
    public OtpSendResp sendOtpSignup(SendByEmailRequest req) {
        // Normalize email
        String normEmail = req.getEmail().trim().toLowerCase();
        // Check for existing unexpired OTP to enforce cooldown
        otpTokenRepo.findTopByEmailAndUsedFalseOrderByCreatedAtDesc(normEmail).ifPresent(last -> {
            if (Instant.now().isBefore(last.getCreatedAt().plusSeconds(resendCooldownSec))) {
                throw new IllegalStateException("Please wait before requesting another code.");
            }
        });
        // Generate and save new OTP token
        String code = gen6Digit();
        OtpToken t = new OtpToken();
        t.setEmail(normEmail);
        t.setAccountId(null); // No accountId since it's for verification before account creation
        t.setCode(code);
        t.setTokenType(req.getTokenType());
        t.setCreatedAt(Instant.now());
        t.setExpiresAt(t.getCreatedAt().plus(ttl));
        otpTokenRepo.save(t);

        try {
            sendEmailVerify(normEmail, code, "Verify your account with OTP", """
                    Your verification code is: %s
                    
                    It expires in 5 minutes. If you didn't request this, you can ignore this email.
                               \s""");
        } catch (Exception e) {
            throw new AppException(ErrorCode.EMAIL_INVALID);
        }

        return OtpSendResp.builder()
                .accountId(null)
                .email(normEmail)
                .tokenType(req.getTokenType())
                .createdAt(t.getCreatedAt())
                .expiresAt(t.getExpiresAt())
                .build();
    }

    /**
     * Verify OTP
     *
     * @param req
     * @return APIResponse
     */
    @Transactional
    public OtpVerifyResp verifyOtpSignUp(OtpVerifyRequest req) {
        String email = req.getEmail();
        String code = req.getCode();
        OtpTokenType tokenType = req.getTokenType();

        // Fetch the token based on userId or email
        OtpToken token = otpTokenRepo.findTopByEmailAndUsedFalseOrderByCreatedAtDesc(email.trim().toLowerCase()).orElse(null);

        // Check if token exists
        if (token == null) {
            return OtpVerifyResp.builder()
                    .status(HttpStatus.BAD_REQUEST)
                    .message("No OTP token found for the provided email.")
                    .build();
        }

        // Validate token properties
        if (!(tokenType == token.getTokenType())) {
            return OtpVerifyResp.builder()
                    .status(HttpStatus.BAD_REQUEST)
                    .message("OTP token type mismatch.")
                    .build();
        }
        if (Instant.now().isAfter(token.getExpiresAt())) {
            return OtpVerifyResp.builder()
                    .status(HttpStatus.BAD_REQUEST)
                    .message("OTP token has expired.")
                    .build();
        }
        if (!token.getCode().equals(code)) {
            return OtpVerifyResp.builder()
                    .status(HttpStatus.BAD_REQUEST)
                    .message("Invalid OTP code.")
                    .build();
        }

        // Mark token as used and save
        try {
            token.setUsed(true);
            otpTokenRepo.save(token);
        } catch (Exception e) {
            return OtpVerifyResp.builder()
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .message("Failed to update OTP token status.")
                    .build();
        }

        // Return success response
        return OtpVerifyResp.builder()
                .status(HttpStatus.OK)
                .message("OTP verified successfully.")
                .build();
    }

    /**
     * Send OTP code to email for forgot password.
     * @param req
     * @return
     */
    @Override
    public OtpSendResp sendOtpForgotPassword(SendByEmailRequest req) {
        return null;
    }

    @Override
    public OtpVerifyResp verifyOtpForgotPassword(OtpVerifyRequest req) {
        return null;
    }

}
