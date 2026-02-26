package com.rikkeisoft.backend.model.dto.resp.auth;

import com.rikkeisoft.backend.enums.AccountStatus;
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
    AccountStatus status;
}
