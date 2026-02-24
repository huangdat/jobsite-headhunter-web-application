package com.rikkeisoft.backend.model.dto.resp;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccountResp {
    String id;
    String username;
    String email;
    String fullName;
    String phone;
    String city;
    String image;
    Boolean isActive;
}
