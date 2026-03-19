package com.rikkeisoft.backend.model.dto.resp.otp;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE) // Set default access level for fields to private
public class SendNormalEmailResp {
    HttpStatus status;
    String message;
}
