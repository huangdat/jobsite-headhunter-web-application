package com.rikkeisoft.backend.model.dto.resp.otp;

import com.rikkeisoft.backend.enums.OtpTokenType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OtpSendResp {
    String accountId;
    String email;
    OtpTokenType tokenType;
    Instant createdAt;
    Instant expiresAt;
}
