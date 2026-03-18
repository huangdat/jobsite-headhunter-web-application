package com.rikkeisoft.backend.model.entity;
import com.rikkeisoft.backend.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Represents a candidate's application for a specific job.
 * Includes snapshot data (name, email, phone, etc.) at the time of applying
 * to ensure historical accuracy even if the candidate updates their profile later.
 */
@Entity
@Table(name = "application")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    Job job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_account_id", nullable = false)
    Account candidate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collaborator_account_id")
    Account collaborator;

    @Column(name = "cv_snapshot_url", columnDefinition = "TEXT")
    String cvSnapshotUrl;

    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(name = "salary_expectation")
    private String salaryExpectation;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    ApplicationStatus status = ApplicationStatus.APPLIED;

    @Column(name = "applied_at")
    LocalDateTime appliedAt;

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Interview> interviews;
}
