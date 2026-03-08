package com.rikkeisoft.backend.model.dto.resp.business;

import com.rikkeisoft.backend.enums.VerificationStatus;
import com.rikkeisoft.backend.model.entity.Account;
import jakarta.persistence.*;
import lombok.Builder;

public class BusinessProfileResp {

    Long id;
    Account account;
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
}
