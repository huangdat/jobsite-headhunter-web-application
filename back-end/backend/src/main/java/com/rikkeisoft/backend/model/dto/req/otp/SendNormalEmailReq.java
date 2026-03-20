package com.rikkeisoft.backend.model.dto.req.otp;

import jakarta.validation.constraints.Email;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE) // Set default access level for fields to private
public class SendNormalEmailReq {
    @Email(message = "EMAIL_INVALID")
    String email;
    String subject;
    String content;
}
