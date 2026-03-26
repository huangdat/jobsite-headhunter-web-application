package com.rikkeisoft.backend.model.dto.resp.forum;

import com.rikkeisoft.backend.enums.ReactionType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Recursive response DTO representing a node in a nested comment tree for a
 * {@link com.rikkeisoft.backend.model.entity.NewsPost}.
 *
 * <p>Each instance represents one {@link com.rikkeisoft.backend.model.entity.ForumComment}
 * and recursively contains its direct children in the {@code replies} field. The service
 * layer builds a flat list of all comment records from the database and assembles them
 * into this tree structure in O(n) time using a HashMap-based algorithm.
 *
 * <p>Tombstoned (deleted) comments are included in the tree with their content replaced
 * by a localized string such as "Comment deleted" and the {@code deleted} flag set to
 * {@code true}, preserving thread structure for ongoing replies.
 *
 * <p><strong>Tree construction algorithm overview:</strong>
 * <ol>
 *   <li>Fetch all comment records for the post (including tombstoned) from the DB.</li>
 *   <li>Map each entity to a {@code CommentTreeResp} and index by ID.</li>
 *   <li>Iterate: if {@code parentCommentId} is null → add to root list; otherwise
 *       → append to parent's {@code replies} list.</li>
 * </ol>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentTreeResp {

    /** The surrogate primary key of the comment. */
    Long id;

    /** The ID of the post this comment belongs to. */
    Long postId;

    /** The UUID string ID of the account that authored this comment. */
    String authorId;

    /** The display username of the comment author. */
    String authorUsername;

    /** The URL of the author's profile image. May be {@code null}. */
    String authorImageUrl;

    /**
     * The text content of the comment.
     *
     * <p>For tombstoned comments ({@code deleted = true}), this field will contain
     * a localized placeholder message such as "Comment deleted" instead of the
     * original content.
     */
    String content;

    /**
     * Whether this comment has been tombstone-deleted.
     *
     * <p>When {@code true}, the comment's original content is hidden and replaced
     * by a placeholder(example: "This comment has been deleted"). The node is still
     * included in the tree to preserve the reply chain.
     */
    boolean deleted;

    /**
     * A map from each {@link ReactionType} to the count of users who have
     * submitted that reaction on this specific comment.
     * Only types with at least one reaction are included in the map.
     */
    Map<ReactionType, Long> reactionCounts;

    /**
     * The reaction type the currently authenticated user has applied to this comment.
     * {@code null} if the current user has not reacted or is unauthenticated.
     */
    ReactionType currentUserReaction;

    /** Timestamp of when this comment was originally submitted. */
    LocalDateTime createdAt;

    /** Timestamp of the most recent edit to this comment. */
    LocalDateTime updatedAt;

    /**
     * The list of direct child replies to this comment.
     *
     * <p>Each element is itself a {@code CommentTreeResp} which may in turn have
     * its own {@code replies}, forming an arbitrarily deep tree. Initialized to an
     * empty list to avoid null-pointer exceptions during tree construction.
     */
    @Builder.Default
    List<CommentTreeResp> replies = new ArrayList<>();
}
