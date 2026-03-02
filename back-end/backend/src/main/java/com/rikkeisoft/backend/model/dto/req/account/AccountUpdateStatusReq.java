package com.rikkeisoft.backend.model.dto.req.account;

import com.rikkeisoft.backend.enums.AccountStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccountUpdateStatusReq {
    AccountStatus status;
}
