package com.rikkeisoft.backend.model.dto.req;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccountCreateReq {
    String username;
    String password;
    String rePassword;
    String email;
    String fullName;
    String phone;
    String city;
    String image;
}
