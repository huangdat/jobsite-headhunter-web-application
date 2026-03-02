package com.rikkeisoft.backend.model.dto.req.otp;

import jakarta.validation.constraints.Email;
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
public class SendForAccountRequest {
    String accountId;
    @Email(message = "EMAIL_INVALID")
    String email;
    String tokenType;
}
