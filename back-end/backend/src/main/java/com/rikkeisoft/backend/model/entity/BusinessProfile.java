package com.rikkeisoft.backend.model.entity;

import com.rikkeisoft.backend.enums.VerificationStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "business_profile")
public class BusinessProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @OneToOne
    @JoinColumn(name = "account_id", nullable = false, unique = true)
    Account account;

    @Column(nullable = false)
    String companyName;

    String taxCode;

    String websiteUrl;

    @Column(columnDefinition = "TEXT")
    String addressMain;

    String companyScale;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    VerificationStatus verificationStatus = VerificationStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    String noteByAdmin;
}
