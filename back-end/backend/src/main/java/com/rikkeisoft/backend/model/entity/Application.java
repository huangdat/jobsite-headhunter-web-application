package com.rikkeisoft.backend.model.entity;
import com.rikkeisoft.backend.enums.ApplicationStatus;
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
@Table(name = "application")
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    Job job;

    @ManyToOne
    @JoinColumn(name = "candidate_account_id", nullable = false)
    Account candidate;

    @ManyToOne
    @JoinColumn(name = "collaborator_account_id")
    Account collaborator;

    @Column(columnDefinition = "TEXT")
    String cvSnapshotUrl;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    ApplicationStatus status = ApplicationStatus.SUBMITTED;

    LocalDateTime appliedAt;
}
