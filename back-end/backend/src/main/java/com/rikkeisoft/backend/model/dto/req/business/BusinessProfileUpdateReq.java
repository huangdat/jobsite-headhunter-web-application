package com.rikkeisoft.backend.model.dto.req.business;

import com.rikkeisoft.backend.model.entity.Account;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BusinessProfileUpdateReq {
    String taxCode;
    String websiteUrl;
    String companyScale;
    String noteByAdmin;
}
