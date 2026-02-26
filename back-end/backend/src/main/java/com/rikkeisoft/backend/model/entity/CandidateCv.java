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
@Table(name = "candidate_cv")
public class CandidateCv {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "candidate_account_id", nullable = false)
    Account candidate;

    @Column(nullable = false, columnDefinition = "TEXT")
    String cvUrl;

    @Builder.Default
    Boolean isVisible = true;

    LocalDateTime createdAt;
}
