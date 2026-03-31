package com.rikkeisoft.backend.model.entity;

import com.rikkeisoft.backend.enums.PostStatus;
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
@Table(name = "forum_post")
public class ForumPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "author_account_id", nullable = false)
    Account author;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = true )
    Job job;

    @Column(nullable = false)
    String title;

    @Column(columnDefinition = "TEXT")
    String content;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    PostStatus status = PostStatus.DRAFT;

    LocalDateTime createdAt;

    LocalDateTime deletedAt;

}
