package com.rikkeisoft.backend.model.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

/**
 * Persistent entity representing a comment on a {@link NewsPost}.
 *
 * <p>Comments support unlimited levels of nesting via a self-referential
 * {@code parentComment} relationship. A root-level comment has
 * {@code parentComment = null}; a reply has a non-null {@code parentComment}.
 *
 * <p><strong>Deletion strategy:</strong>
 * <ul>
 *   <li>If the comment is a <em>leaf node</em> (has no child replies), it is
 *       <strong>hard-deleted</strong> from the database.</li>
 *   <li>If the comment <em>has replies</em>, the content is replaced with a
 *       localized placeholder string (e.g., "Comment deleted") and the
 *       {@code deleted} flag is set to {@code true} to preserve tree structure.</li>
 * </ul>
 *
 * <p>Reactions to comments are stored in {@link CommentReaction}.
 */
@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "forum_comment")
public class ForumComment {

    /** Auto-generated surrogate primary key. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    /**
     * The {@link NewsPost} this comment belongs to.
     * Cannot be {@code null}.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    ForumPost post;

    /**
     * The {@link Account} that authored this comment.
     * Used for permission checks during edit and delete operations.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    Account account;

    /**
     * The parent comment of this reply, or {@code null} if this is a root-level comment.
     * Enables unlimited depth nesting.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id")
    ForumComment parentComment;

    /**
     * The textual body of the comment.
     * When a non-leaf comment is deleted, this field is replaced with a tombstone message.
     */
    @Column(nullable = false, columnDefinition = "TEXT")
    String content;

    /**
     * Soft-delete / tombstone flag. When {@code true}, the comment has been deleted
     * but its row is retained to preserve the reply chain structure.
     * This flag is only set for comments that have child replies; leaf nodes are hard-deleted.
     */
    @Builder.Default
    boolean deleted = false;

    /** Timestamp of when this comment was first submitted. */
    LocalDateTime createdAt;

    /** Timestamp of the most recent edit to this comment. */
    LocalDateTime updatedAt;
}
