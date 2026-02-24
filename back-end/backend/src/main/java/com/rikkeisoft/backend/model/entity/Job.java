package com.rikkeisoft.backend.model.entity;
import com.rikkeisoft.backend.enums.JobStatus;
import com.rikkeisoft.backend.enums.WorkingType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
    private Long id;

    private String jobCode;

    @ManyToOne
    @JoinColumn(name = "headhunter_account_id", nullable = false)
    private Account headhunter;

    @Column(nullable = false)
    private String title;

    private Integer quantity;

    @Enumerated(EnumType.STRING)
    private WorkingType workingType;

    private Double salaryMin;
    private Double salaryMax;

    private String currency;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDate deadline;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private JobStatus status = JobStatus.DRAFT;

    private String city;

    private LocalDateTime createdAt;
}
