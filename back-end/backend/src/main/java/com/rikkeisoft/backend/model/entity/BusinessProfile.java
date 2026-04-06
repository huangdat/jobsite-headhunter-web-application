package com.rikkeisoft.backend.model.entity;

import com.rikkeisoft.backend.enums.VerificationStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.BatchSize;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "business_profile")
@BatchSize(size = 50)
public class BusinessProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

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
