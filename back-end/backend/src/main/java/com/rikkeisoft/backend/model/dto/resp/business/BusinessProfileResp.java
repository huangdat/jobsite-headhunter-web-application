package com.rikkeisoft.backend.model.dto.resp.business;

import com.rikkeisoft.backend.enums.VerificationStatus;
import com.rikkeisoft.backend.model.dto.resp.account.AccountResp;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BusinessProfileResp {

    Long id;

    String companyName;

    String taxCode;

    String websiteUrl;

    String addressMain;

    String companyScale;

    VerificationStatus verificationStatus;

    String noteByAdmin;

    // list of account associated with this business profile
    List<AccountResp> accounts;
}
