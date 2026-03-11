package com.rikkeisoft.backend.model.dto.resp.otp;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

/**
 * Response DTO for OTP verification and password reset
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OtpVerifyAndResetPasswordResp {
    HttpStatus status;
    String message;
    String email;
}
