package com.rikkeisoft.backend.model.entity;

import com.rikkeisoft.backend.enums.ReactionType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

/**
 * Persistent entity representing a user's LinkedIn-style reaction to a {@link ForumPost}.
 *
 * <p>Each {@code PostReaction} links one {@link Account} to one {@link ForumPost}
 * with a specific {@link ReactionType}. The business rule enforces that a user
 * may hold at most <strong>one active reaction per post</strong> at any given time.
 *
 * <p>Reaction behaviour is toggle-based:
 * <ul>
 *   <li>If no existing reaction is found, a new one is created.</li>
 *   <li>If an existing reaction of the <em>same type</em> is found, it is deleted (toggle off).</li>
 *   <li>If an existing reaction of a <em>different type</em> is found, its type is updated.</li>
 * </ul>
 *
 * <p><strong>Note:</strong> There is NO "Share" functionality in this system.
 * Only the eight reaction types defined in {@link ReactionType} are supported.
 */
@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(
    name = "post_reaction",
    uniqueConstraints = @UniqueConstraint(columnNames = {"post_id", "account_id"})
)
public class PostReaction {

    /** Auto-generated surrogate primary key. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    /**
     * The {@link ForumPost} that received the reaction.
     * Cannot be {@code null}.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    ForumPost post;

    /**
     * The {@link Account} that submitted the reaction.
     * Cannot be {@code null}.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    Account account;

    /**
     * The type of reaction expressed by the user.
     * Stored as a {@link String} in the database column for readability.
     *
     * @see ReactionType
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    ReactionType reactionType;

    /** Timestamp of when this reaction was first recorded or last updated. */
    LocalDateTime reactedAt;
}
