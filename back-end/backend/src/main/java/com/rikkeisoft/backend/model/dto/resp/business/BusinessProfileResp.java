package com.rikkeisoft.backend.model.dto.resp.business;

import com.rikkeisoft.backend.enums.VerificationStatus;
import com.rikkeisoft.backend.model.dto.resp.account.AccountResp;
import com.rikkeisoft.backend.model.entity.Account;
import jakarta.persistence.*;
import lombok.Builder;

import java.util.List;

public class BusinessProfileResp {

    Long id;

    String companyName;

    String taxCode;

    String websiteUrl;

    @Column(columnDefinition = "TEXT")
    String addressMain;

    String companyScale;

    @Enumerated(EnumType.STRING)
    VerificationStatus verificationStatus = VerificationStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    String noteByAdmin;

    // list of account associated with this business profile
    List<AccountResp> accounts;
}
