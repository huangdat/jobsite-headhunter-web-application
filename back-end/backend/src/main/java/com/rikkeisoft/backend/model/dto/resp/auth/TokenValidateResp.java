package com.rikkeisoft.backend.model.dto.resp.auth;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TokenValidateResp {
    boolean valid;
    String id;
    String username;
    String role;
    Boolean isActive;
}
