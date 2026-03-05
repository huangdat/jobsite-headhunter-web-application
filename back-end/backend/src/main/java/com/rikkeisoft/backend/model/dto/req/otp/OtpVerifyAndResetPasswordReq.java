package com.rikkeisoft.backend.model.dto.req.otp;

import com.rikkeisoft.backend.enums.OtpTokenType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

/**
 * Request DTO for verifying OTP and resetting password in one step
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OtpVerifyAndResetPasswordReq {
    @Email(message = "EMAIL_INVALID")
    @NotBlank(message = "EMAIL_REQUIRED")
    String email;
    
    @NotBlank(message = "OTP_CODE_REQUIRED")
    @Size(min = 6, max = 6, message = "OTP_CODE_INVALID")
    String code;
    
    OtpTokenType tokenType;
    
    @NotBlank(message = "PASSWORD_REQUIRED")
    @Size(min = 6, message = "PASSWORD_TOO_SHORT")
    String newPassword;
    
    @NotBlank(message = "CONFIRM_PASSWORD_REQUIRED")
    String confirmPassword;
}
