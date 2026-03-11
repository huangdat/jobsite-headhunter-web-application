package com.rikkeisoft.backend.model.entity;
import com.rikkeisoft.backend.enums.JobStatus;
import com.rikkeisoft.backend.enums.WorkingType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "job")
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String jobCode;

    @ManyToOne
    @JoinColumn(name = "headhunter_account_id", nullable = false)
    Account headhunter;

    @Column(nullable = false)
    String title;

    Integer quantity;

    @Enumerated(EnumType.STRING)
    WorkingType workingType;

    Double salaryMin;
    Double salaryMax;

    String currency;

    @Column(columnDefinition = "TEXT")
    String description;

    LocalDate deadline;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    JobStatus status = JobStatus.DRAFT;

    String city;

    LocalDateTime createdAt;

    @OneToMany(mappedBy = "job")
    Set<JobSkill> jobSkills;
}
