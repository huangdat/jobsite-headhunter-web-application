
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
@Table(name = "forum_comment")
public class ForumComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    ForumPost post;

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    Account account;
    @ManyToOne
    @JoinColumn(name = "parent_comment_id")
    ForumComment parentComment;
    @Column(nullable = false, columnDefinition = "TEXT")
    String content;

    LocalDateTime createdAt;
}
