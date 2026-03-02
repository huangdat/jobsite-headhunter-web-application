package com.rikkeisoft.backend.model.dto.req.otp;

import com.rikkeisoft.backend.enums.OtpTokenType;
import jakarta.validation.constraints.Email;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SendByEmailRequest {
    @Email(message = "EMAIL_INVALID")
    String email;
    OtpTokenType tokenType;
    String accountId;
}
