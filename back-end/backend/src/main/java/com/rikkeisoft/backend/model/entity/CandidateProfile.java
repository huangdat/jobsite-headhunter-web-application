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
    private Long id;

    @OneToOne
    @JoinColumn(name = "account_id", nullable = false, unique = true)
    private Account account;

    private String currentTitle;

    private Float yearsOfExperience;

    private Double expectedSalaryMin;

    private Double expectedSalaryMax;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String city;

    @Builder.Default
    private Boolean openForWork = true;

    private LocalDateTime createdAt;
}
