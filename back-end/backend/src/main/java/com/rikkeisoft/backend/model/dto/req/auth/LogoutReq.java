package com.rikkeisoft.backend.model.dto.req.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LogoutReq {
    @NotBlank(message = "TOKEN_REQUIRED")
    String token;
}
