package com.rikkeisoft.backend.model.dto.req.account;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccountChangePasswordreq {
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z0-9_]+$", message = "PASSWORD_INVALID")
    @Size(min = 8, max = 16, message = "PASSWORD_INVALID")
    String oldPassword;
    
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z0-9_]+$", message = "PASSWORD_INVALID")
    @Size(min = 8, max = 16, message = "PASSWORD_INVALID")
    String newPassword;

    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z0-9_]+$", message = "PASSWORD_INVALID")
    @Size(min = 8, max = 16, message = "PASSWORD_INVALID")
    String reNewPassword;
}
