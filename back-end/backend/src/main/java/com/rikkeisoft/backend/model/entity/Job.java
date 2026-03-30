package com.rikkeisoft.backend.model.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.rikkeisoft.backend.enums.Currency;
import com.rikkeisoft.backend.enums.JobStatus;
import com.rikkeisoft.backend.enums.RankLevel;
import com.rikkeisoft.backend.enums.WorkingType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

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

    @Column(name = "job_code")
    String jobCode;

    @ManyToOne
    @JoinColumn(name = "headhunter_account_id", nullable = false)
    Account headhunter;

    @Column(nullable = false)
    String title;

    @Column(columnDefinition = "TEXT")
    String description;
        
    @Column(columnDefinition = "TEXT")
    String responsibilities;

    @Column(columnDefinition = "TEXT")
    String requirements;

    @Column(columnDefinition = "TEXT")
    String benefits;

    @Column(name = "working_time")
    String workingTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "rank_level")
    RankLevel rankLevel;

    @Enumerated(EnumType.STRING) //ONSITE, REMOTE, HYBRID
    @Column(name = "working_type")
    WorkingType workingType;

    String location; //Ho Chi Minh city, Can Tho city

    @Column(name = "address_detail")
    String addressDetail; // detailed address

    Double experience;

    @Column(name = "salary_min")
    Double salaryMin;

    @Column(name = "salary_max")
    Double salaryMax;

    Boolean negotiable;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    Currency currency = Currency.USD;

    Integer quantity;

    LocalDate deadline;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    JobStatus status = JobStatus.OPEN;

    @Column(name = "created_at")
    LocalDateTime createdAt;

    @Column(name = "imageUrl")
    String imageUrl;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    Set<JobSkill> jobSkills;

    @Builder.Default
    @Column(name = "visible")
    Boolean visible = true;

    @Builder.Default
    @Column(name = "featured")
    Boolean featured = false;

    @Column(name = "deleted_at")
    LocalDateTime deletedAt;

    @Column(name = "highlight_until")
    LocalDateTime highlightUntil;
}
