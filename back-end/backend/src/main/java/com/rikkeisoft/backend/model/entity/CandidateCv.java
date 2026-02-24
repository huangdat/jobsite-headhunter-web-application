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
    private Long id;

    @ManyToOne
    @JoinColumn(name = "candidate_account_id", nullable = false)
    private Account candidate;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String cvUrl;

    @Builder.Default
    private Boolean isVisible = true;

    private LocalDateTime createdAt;
}
