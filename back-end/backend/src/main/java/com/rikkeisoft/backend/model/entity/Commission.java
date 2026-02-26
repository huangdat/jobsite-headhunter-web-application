package com.rikkeisoft.backend.model.entity;


import com.rikkeisoft.backend.enums.CommissionStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "commission")
public class Commission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @OneToOne
    @JoinColumn(name = "application_id", nullable = false)
    Application application;

    @ManyToOne
    @JoinColumn(name = "collaborator_account_id", nullable = false)
    Account collaborator;

    Double salaryAmount;

    Double commissionAmount;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    CommissionStatus status = CommissionStatus.PENDING;

    LocalDateTime createdAt;
}
