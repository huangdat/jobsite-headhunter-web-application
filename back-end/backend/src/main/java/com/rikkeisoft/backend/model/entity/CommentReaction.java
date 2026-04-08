package com.rikkeisoft.backend.model.entity;

import com.rikkeisoft.backend.enums.ReactionType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

/**
 * Persistent entity representing a user's LinkedIn-style reaction to a {@link ForumComment}.
 *
 * <p>Each {@code CommentReaction} links one {@link Account} to one {@link ForumComment}
 * with a specific {@link ReactionType}. The unique constraint on
 * {@code (comment_id, account_id)} ensures that each user holds at most
 * <strong>one active reaction per comment</strong> at any time.
 *
 * <p>Reaction behaviour is toggle-based:
 * <ul>
 *   <li>Same type submitted again → existing reaction is <strong>deleted</strong> (toggle off).</li>
 *   <li>Different type submitted → existing reaction's type is <strong>updated</strong>.</li>
 *   <li>No existing reaction → a new reaction is <strong>created</strong>.</li>
 * </ul>
 *
 * <p>The same eight {@link ReactionType} values are available for comments as for posts.
 */
@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(
    name = "comment_reaction",
    uniqueConstraints = @UniqueConstraint(columnNames = {"comment_id", "account_id"})
)
public class CommentReaction {

    /** Auto-generated surrogate primary key. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    /**
     * The {@link ForumComment} that received the reaction.
     * Cannot be {@code null}.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id", nullable = false)
    ForumComment comment;

    /**
     * The {@link Account} that submitted the reaction.
     * Cannot be {@code null}.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    Account account;

    /**
     * The emoji-style reaction type chosen by the user.
     * Stored as a string in the database for readability and query convenience.
     *
     * @see ReactionType
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    ReactionType reactionType;

    /** Timestamp of when this reaction was first recorded or last updated. */
    LocalDateTime reactedAt;
}
