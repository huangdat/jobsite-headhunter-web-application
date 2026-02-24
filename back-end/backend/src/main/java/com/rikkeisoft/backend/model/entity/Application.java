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
    private Long id;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne
    @JoinColumn(name = "candidate_account_id", nullable = false)
    private Account candidate;

    @ManyToOne
    @JoinColumn(name = "collaborator_account_id")
    private Account collaborator;

    @Column(columnDefinition = "TEXT")
    private String cvSnapshotUrl;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.SUBMITTED;

    private LocalDateTime appliedAt;
}
