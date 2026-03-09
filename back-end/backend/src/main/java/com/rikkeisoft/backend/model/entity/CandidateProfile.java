package com.rikkeisoft.backend.model.entity;

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
@Table(name = "candidate_profile")
public class CandidateProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @OneToOne
    @JoinColumn(name = "account_id", nullable = false, unique = true)
    Account account;

    String currentTitle;

    Float yearsOfExperience;

    Double expectedSalaryMin;

    Double expectedSalaryMax;

    @Column(columnDefinition = "TEXT")
    String bio;

    String city;

    @Builder.Default
    Boolean openForWork = false;

    LocalDateTime createdAt;
}
