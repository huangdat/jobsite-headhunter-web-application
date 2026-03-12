package com.rikkeisoft.backend.model.dto.req.auth;

import com.rikkeisoft.backend.enums.AuthProvider;
import com.rikkeisoft.backend.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SocialRegisterReq {
    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    String email;

    @NotNull(message = "Provider is required")
    AuthProvider provider;

    @NotBlank(message = "Provider ID is required")
    String providerId;

    @NotNull(message = "Role is required")
    Role role;

    String fullName;
    String imageUrl;
}
