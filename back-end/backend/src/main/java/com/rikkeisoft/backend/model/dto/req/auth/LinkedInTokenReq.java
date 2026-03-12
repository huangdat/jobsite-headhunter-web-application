package com.rikkeisoft.backend.model.dto.req.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LinkedInTokenReq {
    @NotBlank(message = "Authorization code is required")
    String code;

    @NotBlank(message = "Redirect URI is required")
    String redirectUri;
}
