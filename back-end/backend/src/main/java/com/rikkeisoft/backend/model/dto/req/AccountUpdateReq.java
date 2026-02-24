package com.rikkeisoft.backend.model.dto.req;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccountUpdateReq {
    String username;
    String email;
    String fullName;
    String phone;
    String city;
    String image;
    Boolean isActive;
}
