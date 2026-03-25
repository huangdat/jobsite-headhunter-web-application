package com.rikkeisoft.backend.model.dto.req.forum;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

/**
 * Request DTO for adding a new comment to a {@link com.rikkeisoft.backend.model.entity.NewsPost}.
 *
 * <p>This single DTO covers both root-level comments and nested replies:
 * <ul>
 *   <li>To post a <strong>root-level comment</strong>, leave {@code parentCommentId} as
 *       {@code null}.</li>
 *   <li>To post a <strong>reply</strong>, set {@code parentCommentId} to the ID of the
 *       comment being replied to.</li>
 * </ul>
 *
 * <p>The comment author is resolved from the authenticated principal in the Spring
 * Security {@code SecurityContextHolder} and is not accepted from the client.
 */
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentCreateReq {

    /**
     * The ID of the {@link com.rikkeisoft.backend.model.entity.NewsPost} this comment
     * is being added to. Must not be null.
     */
    @NotNull(message = "COMMENT_POST_ID_REQUIRED")
    Long postId;

    /**
     * The ID of the parent {@link com.rikkeisoft.backend.model.entity.ForumComment}
     * that this comment is replying to.
     *
     * <p>Set to {@code null} (or omit the field) to create a root-level comment.
     * Set to a valid comment ID to create a nested reply at any depth.
     */
    Long parentCommentId;

    /**
     * The textual body of the comment.
     * Must not be blank and must be between 1 and 2000 characters.
     */
    @NotBlank(message = "COMMENT_CONTENT_REQUIRED")
    @Size(min = 1, max = 2000, message = "COMMENT_CONTENT_SIZE")
    String content;
}
