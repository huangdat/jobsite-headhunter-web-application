package com.rikkeisoft.backend.model.dto.req.otp;

import com.rikkeisoft.backend.enums.OtpTokenType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

/**
 * @Author huangdat
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE) // Set default access level for fields to private
public class OtpVerifyRequest {
    // cannot be null userId
    @NotNull(message = "ACCOUNT_ID_REQUIRED")
    String accountId;
    @Email(message = "EMAIL_INVALID")
    String email;
    String code;
    OtpTokenType tokenType;
}
