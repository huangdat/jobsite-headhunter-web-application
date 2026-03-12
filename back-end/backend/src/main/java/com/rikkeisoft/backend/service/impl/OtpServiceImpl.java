package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.enums.OtpTokenType;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.model.dto.req.otp.SendByEmailRequest;
import com.rikkeisoft.backend.model.dto.req.otp.OtpVerifyRequest;
import com.rikkeisoft.backend.model.dto.req.otp.OtpVerifyAndResetPasswordReq;
import com.rikkeisoft.backend.model.dto.resp.otp.OtpSendResp;
import com.rikkeisoft.backend.model.dto.resp.otp.OtpVerifyResp;
import com.rikkeisoft.backend.model.dto.resp.otp.OtpVerifyAndResetPasswordResp;
import com.rikkeisoft.backend.model.entity.Account;
import com.rikkeisoft.backend.model.entity.OtpToken;
import com.rikkeisoft.backend.repository.AccountRepo;
import com.rikkeisoft.backend.repository.OtpTokenRepo;
import com.rikkeisoft.backend.service.OtpService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;

@Slf4j
@RequiredArgsConstructor // Generates a constructor with required arguments for final fields.
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
public class OtpServiceImpl implements OtpService {
    JavaMailSender mailSender;
    OtpTokenRepo otpTokenRepo;
    PasswordEncoder passwordEncoder;
    SecureRandom random = new SecureRandom();
    Duration ttl = Duration.ofMinutes(5);
    int resendCooldownSec = 45;
    int forgotPasswordCooldownSec = 60;
    int maxOtpAttempts = 5;
    AccountRepo accountRepo;

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
            sendEmailVerify(normEmail, code, "Verify your account with OTP","""
        Your verification code is: %s

        It expires in 5 minutes. If you didn't request this, you can ignore this email.
                    """);
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
        
        // Check if maximum attempts exceeded
        if (token.getAttemptCount() >= maxOtpAttempts) {
            return OtpVerifyResp.builder()
                    .status(HttpStatus.TOO_MANY_REQUESTS)
                    .message("OTP verification attempts exceeded. Please request a new code.")
                    .build();
        }
        
        if (Instant.now().isAfter(token.getExpiresAt())) {
            return OtpVerifyResp.builder()
                    .status(HttpStatus.BAD_REQUEST)
                    .message("OTP token has expired.")
                    .build();
        }
        if (!token.getCode().equals(code)) {
            // Increment attempt count
            token.setAttemptCount(token.getAttemptCount() + 1);
            otpTokenRepo.save(token);
            // Check if this was the last allowed attempt
            if (token.getAttemptCount() >= maxOtpAttempts) {
                return OtpVerifyResp.builder()
                        .status(HttpStatus.TOO_MANY_REQUESTS)
                        .message("Maximum attempts exceeded. Please request a new OTP code.")
                        .build();
            }
            
            return OtpVerifyResp.builder()
                    .status(HttpStatus.BAD_REQUEST)
                    .message(String.format("Invalid OTP code. %d attempt(s) remaining.", 
                            maxOtpAttempts - token.getAttemptCount()))
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
    @Transactional
    public OtpSendResp sendOtpForgotPassword(SendByEmailRequest req) {
        // Normalize email
        String normEmail = req.getEmail().trim().toLowerCase();
        
        // Check if account with this email exists
        var account = accountRepo.findByEmail(normEmail)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        
        // Check rate limiting: 1 request per 60 seconds per email
        Instant rateLimitThreshold = Instant.now().minusSeconds(forgotPasswordCooldownSec);
        var recentTokens = otpTokenRepo.findAllByEmailAndTokenTypeOrderByCreatedAtDesc(
                normEmail, OtpTokenType.FORGOT_PASSWORD
        );
        
        // Count requests in the last 60 seconds
        long recentRequestCount = recentTokens.stream()
                .filter(token -> token.getCreatedAt().isAfter(rateLimitThreshold))
                .count();
        
        if (recentRequestCount > 0) {
            throw new AppException(ErrorCode.TOO_MANY_REQUESTS);
        }
        
        // Generate and save new OTP token
        String code = gen6Digit();
        OtpToken t = new OtpToken();
        t.setEmail(normEmail);
        t.setAccountId(account.getId());
        t.setCode(code);
        t.setTokenType(OtpTokenType.FORGOT_PASSWORD);
        t.setCreatedAt(Instant.now());
        t.setExpiresAt(t.getCreatedAt().plus(ttl));
        otpTokenRepo.save(t);

        try {
            sendEmailVerify(normEmail, code, "Reset Your Password", """
                    Your password reset code is: %s
                    
                    It expires in 5 minutes. If you didn't request this, you can ignore this email.
                               \s""");
        } catch (Exception e) {
            log.error("Failed to send forgot password OTP to email: {}", normEmail, e);
            throw new AppException(ErrorCode.EMAIL_INVALID);
        }

        return OtpSendResp.builder()
                .accountId(account.getId())
                .email(normEmail)
                .tokenType(OtpTokenType.FORGOT_PASSWORD)
                .createdAt(t.getCreatedAt())
                .expiresAt(t.getExpiresAt())
                .build();
    }

    /**
     * Verify OTP and reset password in one step
     * This combines OTP verification and password reset to simplify the flow
     * 
     * @param req OtpVerifyAndResetPasswordReq containing email, OTP code, and new password
     * @return OtpVerifyAndResetPasswordResp
     */
    @Override
    @Transactional
    public OtpVerifyAndResetPasswordResp verifyOtpAndResetPassword(OtpVerifyAndResetPasswordReq req) {
        String email = req.getEmail().trim().toLowerCase();
        String code = req.getCode();
        
        // Verify account exists
        Account account = accountRepo.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("Account not found for OTP verification. Email: {}", email);
                    throw new AppException(ErrorCode.NOT_FOUND);
                });

        // Fetch the token based on email
        OtpToken token = otpTokenRepo.findTopByEmailAndUsedFalseOrderByCreatedAtDesc(email)
                .orElse(null);

        // Check if token exists
        if (token == null) {
            log.warn("No OTP token found for password reset. Email: {}", email);
            return OtpVerifyAndResetPasswordResp.builder()
                    .status(HttpStatus.BAD_REQUEST)
                    .message("No OTP token found for the provided email.")
                    .build();
        }

        // Validate token type
        if (token.getTokenType() != OtpTokenType.FORGOT_PASSWORD) {
            return OtpVerifyAndResetPasswordResp.builder()
                    .status(HttpStatus.BAD_REQUEST)
                    .message("OTP token type mismatch.")
                    .build();
        }
        
        // Check if maximum attempts exceeded
        if (token.getAttemptCount() >= maxOtpAttempts) {
            return OtpVerifyAndResetPasswordResp.builder()
                    .status(HttpStatus.TOO_MANY_REQUESTS)
                    .message("OTP verification attempts exceeded. Please request a new code.")
                    .build();
        }
        
        // Check if token expired
        if (Instant.now().isAfter(token.getExpiresAt())) {
            log.warn("Expired OTP token. Email: {}", email);
            return OtpVerifyAndResetPasswordResp.builder()
                    .status(HttpStatus.BAD_REQUEST)
                    .message("OTP token has expired.")
                    .build();
        }
        
        // Verify OTP code
        if (!token.getCode().equals(code)) {
            // Increment attempt count
            token.setAttemptCount(token.getAttemptCount() + 1);
            otpTokenRepo.save(token);
            
            log.warn("Invalid OTP code. Email: {}, Attempt: {}/{}", 
                    email, token.getAttemptCount(), maxOtpAttempts);
            
            // Check if this was the last allowed attempt
            if (token.getAttemptCount() >= maxOtpAttempts) {
                return OtpVerifyAndResetPasswordResp.builder()
                        .status(HttpStatus.TOO_MANY_REQUESTS)
                        .message("Maximum attempts exceeded. Please request a new OTP code.")
                        .build();
            }
            
            return OtpVerifyAndResetPasswordResp.builder()
                    .status(HttpStatus.BAD_REQUEST)
                    .message(String.format("Invalid OTP code. %d attempt(s) remaining.", 
                            maxOtpAttempts - token.getAttemptCount()))
                    .build();
        }

        // Validate password match
        if (!req.getNewPassword().equals(req.getConfirmPassword())) {
            log.warn("Password mismatch during reset. Email: {}", email);
            return OtpVerifyAndResetPasswordResp.builder()
                    .status(HttpStatus.BAD_REQUEST)
                    .message("Password and confirm password do not match.")
                    .build();
        }

        // Mark OTP token as used
        try {
            token.setUsed(true);
            otpTokenRepo.save(token);
        } catch (Exception e) {
            log.error("Failed to mark OTP token as used. Email: {}", email, e);
            return OtpVerifyAndResetPasswordResp.builder()
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .message("Failed to update OTP token status.")
                    .build();
        }

        // Update password
        try {
            account.setPassword(passwordEncoder.encode(req.getNewPassword()));
            account.setUpdatedAt(LocalDateTime.now());
            accountRepo.save(account);
            
            log.info("Password reset successfully via OTP. Email: {}", email);
        } catch (Exception e) {
            log.error("Failed to reset password. Email: {}", email, e);
            return OtpVerifyAndResetPasswordResp.builder()
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .message("Failed to reset password.")
                    .build();
        }

        // Return success response
        return OtpVerifyAndResetPasswordResp.builder()
                .status(HttpStatus.OK)
                .message("Password reset successfully.")
                .email(email)
                .build();
    }

}
