package com.rikkeisoft.backend.model.dto.resp.otp;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OtpVerifyResp {
    HttpStatus status;
    String message;
    
    // Reset token for forgot password flow (null for signup flow)
    String resetToken;
    Instant resetTokenExpiresAt;
}
