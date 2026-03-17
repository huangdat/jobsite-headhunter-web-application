package com.rikkeisoft.backend.model.entity;

import com.rikkeisoft.backend.enums.InterviewStatus;
import com.rikkeisoft.backend.enums.InterviewType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

/**
 * Represents an interview session scheduled for a specific application.
 * Manages timing, location, meeting links, and the status of the interview.
 */
@Entity
@Table(name = "interview")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Interview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Column(name = "interview_code", unique = true)
    private String interviewCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "interview_type")
    private InterviewType interviewType; // ONLINE or OFFLINE

    @Enumerated(EnumType.STRING)
    private InterviewStatus status; // SCHEDULED, DONE, CANCELLED

    @Column(name = "scheduled_at", nullable = false)
    private LocalDateTime scheduledAt;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "meeting_link", columnDefinition = "TEXT")
    private String meetingLink;

    @Column(columnDefinition = "TEXT")
    private String location;

    @Column(columnDefinition = "LONGTEXT")
    private String notes;
}
