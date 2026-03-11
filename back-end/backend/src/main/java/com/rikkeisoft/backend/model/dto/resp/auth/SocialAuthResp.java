package com.rikkeisoft.backend.model.dto.resp.auth;

import com.rikkeisoft.backend.enums.AuthProvider;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SocialAuthResp {
    String email;
    AuthProvider provider;
    String providerId;
    String fullName;
    String imageUrl;
}
